import { getDatabase } from './index'

export const SongsDB = {
  getAll() {
    const db = getDatabase()
    return db.prepare('SELECT * FROM songs ORDER BY title ASC').all()
  },
  
  getById(id: number) {
    const db = getDatabase()
    return db.prepare('SELECT * FROM songs WHERE id = ?').get(id)
  },
  
  create(title: string, author?: string, category?: string) {
    const db = getDatabase()
    const stmt = db.prepare('INSERT INTO songs (title, author, category, updated_at) VALUES (?, ?, ?, strftime(\'%s\',\'now\'))')
    const info = stmt.run(title, author || null, category || null)
    return info.lastInsertRowid
  },
  
  update(id: number, data: any) {
    const db = getDatabase()
    const fields = []
    const values = []
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id') {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    }
    fields.push("updated_at = strftime('%s','now')")
    values.push(id)
    const stmt = db.prepare(`UPDATE songs SET ${fields.join(', ')} WHERE id = ?`)
    return stmt.run(...values)
  },
  
  delete(id: number) {
    const db = getDatabase()
    return db.prepare('DELETE FROM songs WHERE id = ?').run(id)
  },
  
  getSections(songId: number) {
    const db = getDatabase()
    return db.prepare('SELECT * FROM song_sections WHERE song_id = ? ORDER BY sort_order ASC').all(songId)
  },
  
  addSection(songId: number, type: string, label: string, content: string, sortOrder: number) {
    const db = getDatabase()
    const stmt = db.prepare('INSERT INTO song_sections (song_id, type, label, content, sort_order) VALUES (?, ?, ?, ?, ?)')
    return stmt.run(songId, type, label, content, sortOrder)
  },
  
  updateSection(id: number, content: string) {
    const db = getDatabase()
    return db.prepare('UPDATE song_sections SET content = ? WHERE id = ?').run(content, id)
  },
  
  deleteSection(id: number) {
    const db = getDatabase()
    return db.prepare('DELETE FROM song_sections WHERE id = ?').run(id)
  }
}

export const BibleDB = {
  getBibles() {
    const db = getDatabase()
    return db.prepare('SELECT * FROM bibles ORDER BY id ASC').all()
  },
  
  getBooks(bibleId: number) {
    const db = getDatabase()
    return db.prepare('SELECT DISTINCT book_number, book_name FROM verses WHERE bible_id = ? ORDER BY book_number ASC').all(bibleId)
  },
  
  getChapters(bibleId: number, bookNumber: number) {
    const db = getDatabase()
    return db.prepare('SELECT DISTINCT chapter FROM verses WHERE bible_id = ? AND book_number = ? ORDER BY chapter ASC').all(bibleId, bookNumber)
  },
  
  getVerses(bibleId: number, bookNumber: number, chapter: number) {
    const db = getDatabase()
    return db.prepare('SELECT verse, text FROM verses WHERE bible_id = ? AND book_number = ? AND chapter = ? ORDER BY verse ASC').all(bibleId, bookNumber, chapter)
  },
  
  search(bibleId: number, query: string, limit = 50) {
    const db = getDatabase()
    return db.prepare("SELECT * FROM verses WHERE bible_id = ? AND text LIKE ? ORDER BY book_number, chapter, verse LIMIT ?").all(bibleId, `%${query}%`, limit)
  }
}

export const PlaylistDB = {
  getAll() {
    const db = getDatabase()
    return db.prepare('SELECT * FROM playlists ORDER BY created_at DESC').all()
  },
  
  getItems(playlistId: number) {
    const db = getDatabase()
    return db.prepare('SELECT * FROM playlist_items WHERE playlist_id = ? ORDER BY sort_order ASC').all(playlistId)
  },
  
  create(name: string) {
    const db = getDatabase()
    const stmt = db.prepare('INSERT INTO playlists (name) VALUES (?)')
    return stmt.run(name).lastInsertRowid
  },
  
  addItem(playlistId: number, itemType: string, itemId: number | null, title: string, data: string, sortOrder: number) {
    const db = getDatabase()
    const stmt = db.prepare('INSERT INTO playlist_items (playlist_id, item_type, item_id, title, data, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
    return stmt.run(playlistId, itemType, itemId, title, data, sortOrder)
  },
  
  reorder(playlistId: number, items: Array<{id: number, sort_order: number}>) {
    const db = getDatabase()
    const stmt = db.prepare('UPDATE playlist_items SET sort_order = ? WHERE id = ? AND playlist_id = ?')
    const tx = db.transaction((items: Array<{id: number, sort_order: number}>) => {
      for (const item of items) {
        stmt.run(item.sort_order, item.id, playlistId)
      }
    })
    tx(items)
  },
  
  removeItem(id: number) {
    const db = getDatabase()
    return db.prepare('DELETE FROM playlist_items WHERE id = ?').run(id)
  }
}
