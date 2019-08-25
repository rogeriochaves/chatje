const path = require("path");
const args = require("yargs").argv;
const webpack = require("webpack");
const express = require("express");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const { Script } = require("vm");
const PORT = args.port || process.env.PORT || 8080;
const facebook = require("./src/facebook");
const socketio = require("socket.io");
const http = require("http");

const app = express();
app.set("view engine", "ejs");
app.set("views", "./src");
app.use(express.static("build"));
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server);

let webpackMiddleware;
if (process.env.NODE_ENV !== "production") {
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

app.get("/sso", (req, res) => {
  const { uid, nonce } = req.query;
  facebook.loginAuth(uid, nonce);
  res.send("amazing!");
});

app.get("/api/user", (req, res) => {
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
  if (!facebook.isLoggedIn()) {
    const url = facebook.loginStart();
    return res.redirect(url);
  }
  const bundle = getBundle(res);
  res.render("index", { bundlePath: bundle.path, renderedHtml: "" });
});

const getBundle = res => {
  let bundlePath;
  let file;
  if (process.env.NODE_ENV === "production") {
    bundlePath = require("./build/stats.json").assetsByChunkName.main;
    file = fs.readFileSync(`./build/${bundlePath}`, "utf8");
  } else {
    bundlePath = "/" + res.locals.webpackStats.toJson().assetsByChunkName.main;
    file = webpackMiddleware.fileSystem.readFileSync(
      path.join(process.cwd(), "build", bundlePath),
      "utf8"
    );
  }
  return { path: bundlePath, file };
};

let listenersSet = false;
io.on("connection", function(socket) {
  if (listenersSet) return;
  facebook.client.on("message", message => {
    io.emit("fbEvent", { type: "message", payload: message });
  });

  listenersSet = true;
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`BasicMessenger listening on port http://localhost:${PORT}`)
);
