import { Elm } from "./Main.elm";
import io from "socket.io-client";

const app = Elm.Main.init();

const socket = io("http://localhost:8080");
socket.on("fbEvent", data => {
  console.log("received event", data);
  app.ports.fbEvent.send(data);
});
