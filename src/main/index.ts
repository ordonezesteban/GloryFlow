import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { createOperatorWindow, createLiveWindow, closeLiveWindow, getLiveWindow } from './windows'
import { IPC_CHANNELS } from '../shared/constants'
import { Slide } from '../shared/types'

function setupIPC() {
  ipcMain.handle(IPC_CHANNELS.GET_DISPLAYS, () => {
    const displays = screen.getAllDisplays()
    return displays.map((display, index) => ({
      id: index,
      bounds: display.bounds,
      primary: display.id === screen.getPrimaryDisplay().id
    }))
  })

  ipcMain.handle(IPC_CHANNELS.CREATE_LIVE_WINDOW, (_event, displayId: number) => {
    createLiveWindow(displayId)
  })

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

app.whenReady().then(() => {
  setupIPC()
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
