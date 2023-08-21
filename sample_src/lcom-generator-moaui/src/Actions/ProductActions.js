import { debounce } from "lodash";

const sendMessageToMidas = (message, value = "") => {
	window.chrome.webview.postMessage(`${message}${value === "" ? "" : " "}${value}`);
};

export const requestSearchToMidas = debounce((value) => {
	sendMessageToMidas("REQ_SEARCH", value);
}, 500); 

export const requestDlgOpenToMidas = (e, v) => {
	sendMessageToMidas("REQ_EXECUTE", v);
};

export const requestHideDlg = (e) => {
	sendMessageToMidas("REQ_CLOSE");
}

export const requestApikey = () => {
	sendMessageToMidas("REQ_KEY", "ApiKey");
}

export const requestSsoToken = () => {
	sendMessageToMidas("REQ_KEY", "token");
}

export const requestDragStart = (e) => {
	if (e.button === 0 || e.button === 1)
		sendMessageToMidas("REQ_WND_MOVE");
		// window.chrome.webview.postMessage(`DragStart`);
}

function getMidasAsync(func) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			window.chrome.webview.removeEventListener('message', listener);
			reject("Timeout.");
		}, 5000);
		
		if (!window.chrome || !window.chrome.webview) {
			reject("Not Supported.");
			clearTimeout(timer);
			return;
		}
		const listener = (value) => {
			clearTimeout(timer);
			resolve(value);
			window.chrome.webview.removeEventListener('message', listener);
		};

		window.chrome.webview.addEventListener('message', listener);
		func();
	});
}

export async function getMidasList(value) {
	const rawData = await getMidasAsync(() => requestSearchToMidas(value));
	return rawData.data.SearchResult;
};

export async function getMidasApiKey() {
	return getMidasAsync(requestApikey);
}

export async function getSsoToken() {
	return getMidasAsync(requestSsoToken);
}