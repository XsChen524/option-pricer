import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import MainLayout from "layout/MainLayout";
import "../style/default.css";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
	<HashRouter>
		<MainLayout />
	</HashRouter>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once("ipc-example", (arg) => {
	// eslint-disable-next-line no-console
	console.log(arg);
});
window.electron.ipcRenderer.sendMessage("ipc-example", ["ping"]);
