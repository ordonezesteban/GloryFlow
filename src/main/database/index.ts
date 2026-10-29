import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { readFileSync } from 'fs'

let db: Database.Database | null = null

export function getDatabase() {
  if (db) return db

  const userDataPath = app.getPath('userData')
  const dbPath = join(userDataPath, 'gloryflow.db')
  
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')
  db.exec(schema)
  
  console.log('[GLORYFLOW] DB connected:', dbPath)
  return db
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}
