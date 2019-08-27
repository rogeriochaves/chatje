import { Elm } from "./Main.elm";
import io from "socket.io-client";

const app = Elm.Main.init();

const socket = io("http://localhost:8080");
socket.on("fbEvent", data => {
  app.ports.fbEvent.send(data);
});

app.ports.markAsRead.subscribe(payload => {
  socket.emit("markAsRead", payload);
});
