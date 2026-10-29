import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/constants'
import { Slide } from '../shared/types'

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
  },

  db: {
    songs: {
      getAll: () => ipcRenderer.invoke('db:songs:getAll'),
      getById: (id: number) => ipcRenderer.invoke('db:songs:getById', id),
      create: (title: string, author?: string, category?: string) => ipcRenderer.invoke('db:songs:create', title, author, category),
      update: (id: number, data: any) => ipcRenderer.invoke('db:songs:update', id, data),
      delete: (id: number) => ipcRenderer.invoke('db:songs:delete', id),
      getSections: (songId: number) => ipcRenderer.invoke('db:songs:getSections', songId),
      addSection: (songId: number, type: string, label: string, content: string, sortOrder: number) => ipcRenderer.invoke('db:songs:addSection', songId, type, label, content, sortOrder),
      updateSection: (id: number, content: string) => ipcRenderer.invoke('db:songs:updateSection', id, content),
      deleteSection: (id: number) => ipcRenderer.invoke('db:songs:deleteSection', id),
    },
    bible: {
      getBibles: () => ipcRenderer.invoke('db:bible:getBibles'),
      getBooks: (bibleId: number) => ipcRenderer.invoke('db:bible:getBooks', bibleId),
      getChapters: (bibleId: number, bookNumber: number) => ipcRenderer.invoke('db:bible:getChapters', bibleId, bookNumber),
      getVerses: (bibleId: number, bookNumber: number, chapter: number) => ipcRenderer.invoke('db:bible:getVerses', bibleId, bookNumber, chapter),
      search: (bibleId: number, query: string, limit?: number) => ipcRenderer.invoke('db:bible:search', bibleId, query, limit),
    },
    playlist: {
      getAll: () => ipcRenderer.invoke('db:playlist:getAll'),
      getItems: (playlistId: number) => ipcRenderer.invoke('db:playlist:getItems', playlistId),
      create: (name: string) => ipcRenderer.invoke('db:playlist:create', name),
      addItem: (playlistId: number, itemType: string, itemId: number | null, title: string, data: string, sortOrder: number) => ipcRenderer.invoke('db:playlist:addItem', playlistId, itemType, itemId, title, data, sortOrder),
      reorder: (playlistId: number, items: Array<{id: number, sort_order: number}>) => ipcRenderer.invoke('db:playlist:reorder', playlistId, items),
      removeItem: (id: number) => ipcRenderer.invoke('db:playlist:removeItem', id),
    }
  }
}

contextBridge.exposeInMainWorld('gloryflow', api)

export type GloryFlowAPI = typeof api
