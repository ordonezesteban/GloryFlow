import { ipcMain } from 'electron'
import { SongsDB, BibleDB, PlaylistDB } from '../database/queries'

export function setupDatabaseIPC() {
  // Songs
  ipcMain.handle('db:songs:getAll', () => SongsDB.getAll())
  ipcMain.handle('db:songs:getById', (_e, id: number) => SongsDB.getById(id))
  ipcMain.handle('db:songs:create', (_e, title: string, author?: string, category?: string) => SongsDB.create(title, author, category))
  ipcMain.handle('db:songs:update', (_e, id: number, data: any) => SongsDB.update(id, data))
  ipcMain.handle('db:songs:delete', (_e, id: number) => SongsDB.delete(id))
  ipcMain.handle('db:songs:getSections', (_e, songId: number) => SongsDB.getSections(songId))
  ipcMain.handle('db:songs:addSection', (_e, songId: number, type: string, label: string, content: string, sortOrder: number) => SongsDB.addSection(songId, type, label, content, sortOrder))
  ipcMain.handle('db:songs:updateSection', (_e, id: number, content: string) => SongsDB.updateSection(id, content))
  ipcMain.handle('db:songs:deleteSection', (_e, id: number) => SongsDB.deleteSection(id))

  // Bible
  ipcMain.handle('db:bible:getBibles', () => BibleDB.getBibles())
  ipcMain.handle('db:bible:getBooks', (_e, bibleId: number) => BibleDB.getBooks(bibleId))
  ipcMain.handle('db:bible:getChapters', (_e, bibleId: number, bookNumber: number) => BibleDB.getChapters(bibleId, bookNumber))
  ipcMain.handle('db:bible:getVerses', (_e, bibleId: number, bookNumber: number, chapter: number) => BibleDB.getVerses(bibleId, bookNumber, chapter))
  ipcMain.handle('db:bible:search', (_e, bibleId: number, query: string, limit?: number) => BibleDB.search(bibleId, query, limit))

  // Playlists
  ipcMain.handle('db:playlist:getAll', () => PlaylistDB.getAll())
  ipcMain.handle('db:playlist:getItems', (_e, playlistId: number) => PlaylistDB.getItems(playlistId))
  ipcMain.handle('db:playlist:create', (_e, name: string) => PlaylistDB.create(name))
  ipcMain.handle('db:playlist:addItem', (_e, playlistId: number, itemType: string, itemId: number | null, title: string, data: string, sortOrder: number) => PlaylistDB.addItem(playlistId, itemType, itemId, title, data, sortOrder))
  ipcMain.handle('db:playlist:reorder', (_e, playlistId: number, items: Array<{id: number, sort_order: number}>) => PlaylistDB.reorder(playlistId, items))
  ipcMain.handle('db:playlist:removeItem', (_e, id: number) => PlaylistDB.removeItem(id))
}
