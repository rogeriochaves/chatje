import { Elm } from "./Main.elm";
import io from "socket.io-client";

const inElectron = eval('typeof require === "function"');
const app = Elm.Main.init({ flags: { inElectron } });

const socket = io("http://localhost:2428");
socket.on("fbEvent", data => {
  app.ports.fbEvent.send(data);
});

app.ports.markAsRead.subscribe(payload => {
  socket.emit("markAsRead", payload);
});

if (inElectron) {
  const shell = eval('require("electron").shell');
  document.body.addEventListener("click", function(e) {
    let elem;
    if (e.target && e.target.target === "_blank") {
      elem = e.target;
    } else if (e.target && e.target.parentElement.target === "_blank") {
      elem = e.target.parentElement;
    }
    if (elem) {
      event.preventDefault();
      shell.openExternal(elem.href);
    }
  });
}
