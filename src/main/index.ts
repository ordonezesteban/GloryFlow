import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { createOperatorWindow, createLiveWindow, closeLiveWindow, getLiveWindow } from './windows'
import { IPC_CHANNELS } from '../shared/constants'
import { Slide } from '../shared/types'
import { getDatabase } from './database'
import { setupDatabaseIPC } from './ipc/database'

function setupIPC() {
  ipcMain.handle(IPC_CHANNELS.GET_DISPLAYS, () => {
    const displays = screen.getAllDisplays()
    const primary = screen.getPrimaryDisplay()

    return displays.map((display) => ({
        id: display.id, // ID real de Electron, no el índice
        bounds: display.bounds,
        primary: display.id === primary.id
    }))
  })

  ipcMain.handle(
    IPC_CHANNELS.CREATE_LIVE_WINDOW,
    (_event, displayId: number) => {
      const live = createLiveWindow(displayId)

      return {
        success: live !== null,
        displayId: displayId
      }
    }
  )

  ipcMain.handle(IPC_CHANNELS.CLOSE_LIVE_WINDOW, () => {
    closeLiveWindow()
  })

  ipcMain.on(IPC_CHANNELS.SYNC_SLIDE, (_event, slide: Slide) => {
    const live = getLiveWindow()
    if (live && !live.isDestroyed()) {
      live.webContents.send(IPC_CHANNELS.LIVE_SLIDE_UPDATE, slide)
    }
  })

  ipcMain.on(IPC_CHANNELS.BLACK_SCREEN, (_event, active: boolean) => {
    const live = getLiveWindow()
    if (live && !live.isDestroyed()) {
      live.webContents.send(IPC_CHANNELS.LIVE_SLIDE_UPDATE, { id: 'black', type: active ? 'black' : 'clear', content: '' })
    }
  })

  ipcMain.on(IPC_CHANNELS.CLEAR_SCREEN, () => {
    const live = getLiveWindow()
    if (live && !live.isDestroyed()) {
      live.webContents.send(IPC_CHANNELS.LIVE_SLIDE_UPDATE, { id: 'clear', type: 'clear', content: '' })
    }
  })

  ipcMain.on(IPC_CHANNELS.SHOW_LOGO, (_event, show: boolean) => {
    const live = getLiveWindow()
    if (live && !live.isDestroyed()) {
      live.webContents.send(IPC_CHANNELS.LIVE_SLIDE_UPDATE, { id: 'logo', type: show ? 'logo' : 'clear', content: '' })
    }
  })
}

app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('disable-setuid-sandbox')
app.commandLine.appendSwitch('disable-dev-shm-usage')
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-gpu-sandbox')
app.disableHardwareAcceleration()

app.whenReady().then(() => {
  getDatabase()
  setupIPC()
  setupDatabaseIPC()
  createOperatorWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createOperatorWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})