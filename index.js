const path = require("path");
const args = require("yargs").argv;
const express = require("express");
const fs = require("fs");
const PORT = args.port || process.env.PORT || 8080;
const facebook = require("./src/facebook");
const socketio = require("socket.io");
const http = require("http");

const app = express();
app.set("view engine", "ejs");
app.set("views", `${__dirname}/src`);
app.use(express.static(`${__dirname}/build`));
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server);

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
    facebook.client.getUserInfo(facebook.client.session.tokens.uid)
  );
});

app.get("/api/threads", (req, res) => {
  jsonResponse(res, facebook.client.getThreadList(100));
});

app.get("/api/messages/:threadId", (req, res) => {
  jsonResponse(res, facebook.client.getMessages(req.params.threadId, 30));
});

app.post("/api/messages/:threadId/send", (req, res) => {
  const message = req.body.message;
  jsonResponse(res, facebook.client.sendMessage(req.params.threadId, message));
});

app.post("/api/messages/:threadId/markAsRead/:authorId", (req, res) => {
  const message = {
    authorId: req.params.authorId,
    threadId: req.params.threadId,
    id: "",
    timestamp: Date.now(),
    message: "",
    fileAttachments: null,
    mediaAttachments: null
  };
  jsonResponse(res, facebook.client.sendReadReceipt(message));
});

const jsonResponse = (res, promise) =>
  promise
    .then(x => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(x));
    })
    .catch(err => {
      res.status(500).send(err.message);
    });

app.get("*", (req, res) => {
  if (req.path !== "/login" && !facebook.isLoggedIn()) {
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

let listenersSet = false;
io.on("connection", _socket => {
  if (listenersSet) return;
  facebook.client.on("message", message => {
    io.emit("fbEvent", { type: "message", payload: message });
  });

  listenersSet = true;
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`BasicMessenger listening on port http://localhost:${PORT}`)
);

const electron = require("electron");

const createWindow = () => {
  const win = new electron.BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/src/fixSSOUrl.js`
    }
  });

  win.loadURL(`http://localhost:${PORT}`);
};

if (electron.app) electron.app.on("ready", createWindow);
