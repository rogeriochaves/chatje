const path = require("path");
const args = require("yargs").argv;
const express = require("express");
const fs = require("fs");
const PORT = args.port || process.env.PORT || 2428;
const socketio = require("socket.io");
const http = require("http");
const { shell } = require("electron");

const app = express();
app.set("view engine", "ejs");
app.set("views", `${__dirname}/src`);
app.use(express.static(`${__dirname}/build`));
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server);
const facebook = require("./src/facebook")(io);

let webpack;
let webpackMiddleware;
if (process.env.NODE_ENV === "development") {
  webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackConfig = require("./webpack.config")(
    {},
    { mode: "development" }
  );
  const compiler = webpack({ ...webpackConfig, mode: "development" });
  webpackMiddleware = webpackDevMiddleware(compiler, {
    serverSideRender: true,
    publicPath: "/"
  });
  app.use(webpackMiddleware);
}

app.get("/do-login", (req, res) => {
  const { email } = req.query;
  if (!facebook.isLoggedIn()) {
    const url = facebook.loginStart(email);
    return res.redirect(url);
  }
  res.redirect("/");
});

app.get("/sso", (req, res) => {
  const { uid, nonce } = req.query;
  facebook
    .loginAuth(uid, nonce)
    .then(() => {
      setTimeout(() => res.redirect("/"), 2000);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

app.get("/api/user", (_req, res) => {
  if (!facebook.isLoggedIn()) {
    return res.status(500).send("not signed in");
  }
  jsonResponse(
    res,
    facebook.getClient().getUserInfo(facebook.getClient().session.tokens.uid)
  );
});

app.get("/api/threads", (_req, res) => {
  jsonResponse(
    res,
    facebook.getClient().getThreadList(100),
    20000
  );
});

app.get("/api/messages/:threadId", (req, res) => {
  jsonResponse(res, facebook.getClient().getMessages(req.params.threadId, 30));
});

app.post("/api/messages/:threadId/send", (req, res) => {
  const message = req.body.message;
  jsonResponse(
    res,
    facebook.getClient().sendMessage(req.params.threadId, message),
    3000
  );
});

app.get("/open-in-browser", (_req, res) => {
  shell.openExternal(`http://localhost:${PORT}`);
  window.hide();
  res.send();
});

app.get("/sign-in-on-browser", (req, res) => {
  shell.openExternal(req.query.url);
  res.redirect("/paste-link");
});

app.get("/blank", (_req, res) => {
  res.send();
});

const jsonResponse = (res, promise, timeout) => {
  reconnectOnTimeout(promise, timeout)
    .then(x => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(x));
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
};

app.get("*", (req, res) => {
  if (
    req.path !== "/login" &&
    req.path !== "/paste-link" &&
    !facebook.isLoggedIn()
  ) {
    return res.redirect("/login");
  }
  const bundle = getBundle(res);
  res.render("index", { bundlePath: bundle.path, renderedHtml: "" });
});

const getBundle = res => {
  let bundlePath;
  let file;
  if (process.env.NODE_ENV === "development") {
    bundlePath = res.locals.webpackStats.toJson().assetsByChunkName.main;
    file = webpackMiddleware.fileSystem.readFileSync(
      path.join(process.cwd(), "build", bundlePath),
      "utf8"
    );
  } else {
    bundlePath = require(`${__dirname}/build/stats.json`).assetsByChunkName
      .main;
    file = fs.readFileSync(`${__dirname}/build/${bundlePath}`, "utf8");
  }
  return { path: `/${bundlePath}`, file };
};

const reconnectOnTimeout = (promise, timeout = 5000) => {
  const timeoutPromise = new Promise((_resolve, reject) =>
    setTimeout(() => reject("Timeout"), timeout)
  );
  return Promise.race([promise, timeoutPromise])
    .catch(err => {
      if (err === "Timeout") {
        facebook.reconnectFromCache();
      }
    });
};

io.on("connection", socket => {
  socket.on("markAsRead", ({ threadId, authorId }) => {
    const message = {
      authorId: authorId,
      threadId: threadId,
      id: "",
      timestamp: Date.now(),
      message: "",
      fileAttachments: null,
      mediaAttachments: null
    };

    reconnectOnTimeout(facebook.getClient().sendReadReceipt(message));
  });
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`Chatje listening on port http://localhost:${PORT}`)
);

const electron = require("electron");

let window;
const createWindow = () => {
  window = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/src/fixSSOUrl.js`
    }
  });

  window.loadURL(`http://localhost:${PORT}`);

  electron.app.setAsDefaultProtocolClient("fb-workchat-sso");
  electron.app.on("open-url", (_event, url) => {
    if (url.match("fb-workchat-sso")) {
      window.loadURL(`http://localhost:${PORT}/blank`);
      setTimeout(() => {
        window.loadURL(
          url.replace("fb-workchat-sso:/", `http://localhost:${PORT}`)
        );
      }, 1000);
    }
  });
};

if (electron.app) electron.app.on("ready", createWindow);
