import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/constants'
import { Slide, DisplayInfo } from '../shared/types'

const api = {
  getDisplays: (): Promise<DisplayInfo[]> => ipcRenderer.invoke(IPC_CHANNELS.GET_DISPLAYS),
  createLiveWindow: (displayId: number): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.CREATE_LIVE_WINDOW, displayId),
  closeLiveWindow: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.CLOSE_LIVE_WINDOW),
  syncSlide: (slide: Slide): void => ipcRenderer.send(IPC_CHANNELS.SYNC_SLIDE, slide),
  setBlack: (active: boolean): void => ipcRenderer.send(IPC_CHANNELS.BLACK_SCREEN, active),
  setClear: (): void => ipcRenderer.send(IPC_CHANNELS.CLEAR_SCREEN),
  showLogo: (show: boolean): void => ipcRenderer.send(IPC_CHANNELS.SHOW_LOGO, show),
  onLiveSlideUpdate: (callback: (slide: Slide) => void) => {
    const handler = (_event: any, slide: Slide) => callback(slide)
    ipcRenderer.on(IPC_CHANNELS.LIVE_SLIDE_UPDATE, handler)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.LIVE_SLIDE_UPDATE, handler)
  }
}

contextBridge.exposeInMainWorld('gloryflow', api)

export type GloryFlowAPI = typeof api
