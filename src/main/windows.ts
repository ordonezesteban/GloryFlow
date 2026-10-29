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
  const displays = screen.getAllDisplays()

  console.log(
    '[GLORYFLOW] Displays:',
    displays.map((d) => ({
      id: d.id,
      bounds: d.bounds,
      primary: d.id === screen.getPrimaryDisplay().id
    }))
  )

  console.log('[GLORYFLOW] ID solicitado:', displayId)

  const targetDisplay = displays.find((d) => d.id === displayId)

  if (!targetDisplay) {
    console.error('[GLORYFLOW] No existe el monitor seleccionado')
    return null
  }

  // Cerrar la ventana anterior solamente después de validar la selección.
  if (liveWindow && !liveWindow.isDestroyed()) {
    liveWindow.close()
  }

  const { x, y, width, height } = targetDisplay.bounds

  console.log('[GLORYFLOW] Monitor elegido:', targetDisplay.id, {
    x, y, width, height
  })

  const windowRef = new BrowserWindow({
    x,
    y,
    width,
    height,
    title: 'GloryFlow - Proyección',
    frame: false,
    show: false,
    backgroundColor: '#000000',
    skipTaskbar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  })

  liveWindow = windowRef

  if (process.env.NODE_ENV === 'development') {
    windowRef.loadURL(
      process.env['ELECTRON_RENDERER_URL'] + '/src/renderer/live.html'
    )
  } else {
    windowRef.loadFile(join(__dirname, '../renderer/live.html'))
  }

  windowRef.once('ready-to-show', () => {
    if (windowRef.isDestroyed()) return

    windowRef.setBounds({ x, y, width, height })
    windowRef.show()

    console.log('[GLORYFLOW] Bounds efectivos:', windowRef.getBounds())
  })

  windowRef.on('closed', () => {
    if (liveWindow === windowRef) {
      liveWindow = null
    }
  })

  return windowRef
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
