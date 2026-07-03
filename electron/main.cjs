const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Music Player',
    icon: path.join(__dirname, '../public/favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0a0a0a',
    show: false,
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.once('ready-to-show', () => {
    win.show()
  })

  // Media shortcuts
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      // Ctrl+Left: previous track
      if (input.control && input.key === 'ArrowLeft') {
        win.webContents.send('media-command', 'prev')
      }
      // Ctrl+Right: next track
      if (input.control && input.key === 'ArrowRight') {
        win.webContents.send('media-command', 'next')
      }
      // Ctrl+Up: volume up
      if (input.control && input.key === 'ArrowUp') {
        win.webContents.send('media-command', 'volume-up')
      }
      // Ctrl+Down: volume down
      if (input.control && input.key === 'ArrowDown') {
        win.webContents.send('media-command', 'volume-down')
      }
    }
  })

  return win
}

let mainWindow

app.whenReady().then(() => {
  mainWindow = createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
