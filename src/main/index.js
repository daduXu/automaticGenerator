'use strict'

import { app, BrowserWindow, dialog, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegrationInWorker: true,
      sandbox: false
    },
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
ipcMain.on('open-directory-dialog', function (event, p) {
  const { type, eventName } = p
  dialog.showOpenDialog({
    properties: [type]
  }, (files) => {
    // 如果有选中
    if (files) {
      event.sender.send(eventName, files[0])
    }
  })
})
// 接受来自渲染进程的消息
ipcMain.on('saveFile', (event, option) => {
  let fs = require('fs')
  const { data, path } = option
  // 数组转json字符串
  const jsonObj = JSON.stringify(data)
  // 把json数据写入TXT文件中
  fs.writeFile(path, jsonObj, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('file success！！！')
    }
  })
})
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
