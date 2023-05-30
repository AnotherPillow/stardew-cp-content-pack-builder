const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs');
var win;

let devMode = process.argv.includes('--dev');

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: __dirname + '/preload.js',
            nodeIntegration: true
        },
        //autoHideMenuBar: true,
        //alwaysOnTop: true, // Always on top, remove comments to enable
        // frame: false, // Remove frame, remove comments to enable
    })
    win.loadFile('renderer/index.html');

    win.on('closed', () => {
        win = null;
    });

    //remove menu bar but still allow dev tools
    //win.setMenu(null);
    win.setMenuBarVisibility(false);
    if (devMode) win.webContents.openDevTools();
    
}

app.on('ready', () => createWindow()); // Create window when app is ready