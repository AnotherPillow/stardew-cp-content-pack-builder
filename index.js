const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs');
var win;

function createWindow() {
    win = new BrowserWindow({
        width: 800, // Window width
        height: 600, // Window height
        webPreferences: {
            preload: __dirname + '/preload.js', // Preload script, used to communicate with the renderer process
            nodeIntegration: true // Allow node integration
        },
        //alwaysOnTop: true, // Always on top, remove comments to enable
        // frame: false, // Remove frame, remove comments to enable
    })
    win.loadFile('renderer/index.html') //Load renderer/index.html as the window content

    win.on('closed', () => {
        win = null; // Dereference the window object
    });
}

app.on('ready', () => createWindow()); // Create window when app is ready