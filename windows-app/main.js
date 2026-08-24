const { app, BrowserWindow, Menu, shell, dialog } = require("electron");

const APP_URL = "https://wpt-player-notes-new.gigi300606.chatgpt.site";

function createWindow() {
  app.setAppUserModelId("com.chris.wptplayernotes");
  const win = new BrowserWindow({
    title: "WPT Player Notes",
    width: 980,
    height: 760,
    minWidth: 720,
    minHeight: 560,
    backgroundColor: "#f3f1ea",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: true
    }
  });

  Menu.setApplicationMenu(null);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(APP_URL)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  win.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (!isMainFrame || errorCode === -3) return;
    const message = encodeURIComponent("No se pudo conectar. Revisa tu internet y vuelve a intentarlo.");
    win.loadURL(`data:text/html;charset=utf-8,<style>body{margin:0;display:grid;place-items:center;height:100vh;background:%2310201a;color:white;font-family:Segoe UI;text-align:center}main{max-width:420px;padding:30px}h1{font-family:Georgia;font-size:34px}button{padding:12px 18px;border:0;border-radius:8px;background:%23d6a83d;font-weight:700;cursor:pointer}</style><main><h1>WPT Player Notes</h1><p>${message}</p><button onclick="location.href='${APP_URL}'">Volver a intentar</button></main>`);
  });

  win.loadURL(APP_URL);
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

process.on("uncaughtException", error => {
  dialog.showErrorBox("WPT Player Notes", error.message || "Ocurrió un error inesperado.");
});
