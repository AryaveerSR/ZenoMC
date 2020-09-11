const { app, screen, BrowserWindow, ipcMain } = require('electron');
const shortcut = require('electron-localshortcut');
const { Client, Authenticator } = require('minecraft-launcher-core');

ipcMain.on('launch', (event, data) => {
    var win = BrowserWindow.getAllWindows()[0]
    var obj = JSON.parse(data)
    var opts = {}
    if (obj.cracked) {
        opts = {
            clientPackage: null,
            authorization: Authenticator.getAuth(obj.user, ""),
            root: app.getPath('documents') + `/ZenoMC`,
            version: {
                number: obj.version,
                type: "release"
            },
            memory: {
                max: "6G",
                min: "4G"
            }
        }
    } else {
        var authResult = Authenticator.getAuth(obj.user, obj.pass).then(null, () => {
            win.webContents.send('wrongLogin')
        })

        opts = {
            clientPackage: null,
            authorization: authResult,
            root: app.getPath('documents') + `/ZenoMC`,
            version: {
                number: obj.version,
                type: "release"
            },
            memory: {
                max: "6G",
                min: "4G"
            }
        }
    }
    const launcher = new Client();
    launcher.launch(opts).then(() => {
        app.quit()
    })
    launcher.on('debug', (e) => {
        win.webContents.send('log', e);
    });
    launcher.on('data', (e) => {
        win.webContents.send('log', e);
    });
})

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            preload: `${__dirname}/preload.js`,
            nodeIntergration: true
        }
    })
    shortcut.register(win, 'F11', () => {
        win.setSimpleFullScreen(!win.isSimpleFullScreen())
    })
    win.loadFile(__dirname + "/src/index.html")
    win.removeMenu()
    win.maximize()
}

app.whenReady().then(createWindow)

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});