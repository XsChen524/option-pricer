import { createRoot } from "react-dom/client";
import AppRouter from "router";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<AppRouter />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once("ipc-example", (arg) => {
	// eslint-disable-next-line no-console
	console.log(arg);
});
window.electron.ipcRenderer.sendMessage("ipc-example", ["ping"]);
