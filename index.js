const {app, BrowserWindow, ipcMain} = require('electron')
const unzipper = require('unzipper');
const fs = require('fs');
const exec = require('child_process').exec;
var win;

const userdata = app.getPath('userData');
const modsPath = userdata + '\\Run\\Mods';
if (!fs.existsSync(modsPath)) fs.mkdirSync(modsPath, {recursive: true});

let gamePath = ''

const findGame = () => {
    let alphabet = 'CDEFGHIJKLMNOPQRSTUVWXYZ';
    const username = process.env['USERPROFILE'].split('\\')[2];

    
    if (fs.existsSync('C:\\Program Files (x86)\\Steam\\steamapps\\common\\Stardew Valley\\StardewModdingAPI.exe'))
        return 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Stardew Valley\\StardewModdingAPI.exe';
    
    //loop through all drives and check for steam
    
    for (const letter of alphabet) {
        if (fs.existsSync(`${letter}:\\SteamLibrary\\steamapps\\common\\Stardew Valley\\StardewModdingAPI.exe`))
            return `${letter}:\\SteamLibrary\\steamapps\\common\\Stardew Valley\\StardewModdingAPI.exe`;
    }    
    if (fs.existsSync('C:\\GOG Games\\Stardew Valley\\StardewModdingAPI.exe')) 
        return 'C:\\GOG Games\\Stardew Valley\\StardewModdingAPI.exe';
}

const runSMAPI = () => {
    //change to game folder
    process.chdir(gamePath.split('\\').slice(0, -1).join('\\'));
    //console.log(process.cwd());



    const cmd = `StardewModdingAPI.exe --mods-path "${modsPath}"`;

    //run cmd, but make it in a brand new console window
    //exec(cmd, {detached: true, windowsHide: true});
    exec(`start cmd.exe /K "${cmd}"`, {detached: true});
}

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

ipcMain.on('getgamedir', (event, arg) => {
    gamePath = findGame();
    win.webContents.send('gamedirgot', gamePath);
});

ipcMain.on('setgamedir', (event, arg) => {
    gamePath = arg;
})

ipcMain.on('download', (event, arg) => {
    const data = atob(arg)
    const filename = 'mod.zip';
    
    const filepath = modsPath + '\\' + filename;
    const outfolder = modsPath + '\\mod';

    try {
        fs.rmSync(outfolder, {recursive: true});
    } catch {}
    
    fs.writeFileSync(filepath, data, {encoding: 'binary'});

    fs.createReadStream(filepath).pipe(unzipper.Extract({ path: outfolder })).on('close', () => {
        fs.unlinkSync(filepath);
        runSMAPI();
    });
    
    


})