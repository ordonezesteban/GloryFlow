import { BrowserWindow, screen } from 'electron'
import { join } from 'path'

let operatorWindow: BrowserWindow | null = null
let liveWindow: BrowserWindow | null = null

export function createOperatorWindow() {
  operatorWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'GloryFlow - Control',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  })

  if (process.env.NODE_ENV === 'development') {
    operatorWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/src/renderer/index.html')
  } else {
    operatorWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  operatorWindow.on('closed', () => {
    operatorWindow = null
    if (liveWindow && !liveWindow.isDestroyed()) {
      liveWindow.close()
    }
  })

  return operatorWindow
}

export function createLiveWindow(displayId: number) {
  if (liveWindow && !liveWindow.isDestroyed()) {
    liveWindow.close()
  }

  const displays = screen.getAllDisplays()
  const display = displays.find((d, idx) => idx === displayId) || displays[1] || displays[0]

  liveWindow = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.bounds.width,
    height: display.bounds.height,
    fullscreen: true,
    frame: false,
    backgroundColor: '#000000',
    title: 'GloryFlow - Proyección',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  })

  if (process.env.NODE_ENV === 'development') {
    liveWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/src/renderer/live.html')
  } else {
    liveWindow.loadFile(join(__dirname, '../renderer/live.html'))
  }

  liveWindow.on('closed', () => {
    liveWindow = null
  })

  return liveWindow
}

export function getOperatorWindow() {
  return operatorWindow
}

export function getLiveWindow() {
  return liveWindow
}

export function closeLiveWindow() {
  if (liveWindow && !liveWindow.isDestroyed()) {
    liveWindow.close()
  }
  liveWindow = null
}
