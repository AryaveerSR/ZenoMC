const { ipcRenderer } = require('electron');
window.launch = (data) => {
    ipcRenderer.send('launch', data);
}

ipcRenderer.on('log', (event, data) => {
    doLog(data)
})

ipcRenderer.on('wrongLogin', () => {
    itWasWrong('Your Username/Password is wrong')
})