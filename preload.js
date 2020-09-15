const { ipcRenderer } = require('electron');

window.launch = (data) => {
    ipcRenderer.send('launch', data);
}

ipcRenderer.on('log', (event, data) => {
    log(data)
});

ipcRenderer.on('wrongLogin', () => {
    logError('Your Username/Password is wrong')
});

ipcRenderer.on('versionJSON', (event, data) => {
    getVersions(JSON.stringify(data));
})

window.getVersionsW = () => {
    ipcRenderer.send('getVersions');
}