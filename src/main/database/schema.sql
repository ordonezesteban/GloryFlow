PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS bibles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  language TEXT DEFAULT 'es',
  is_active INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS verses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bible_id INTEGER NOT NULL,
  book_number INTEGER NOT NULL,
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  FOREIGN KEY (bible_id) REFERENCES bibles(id) ON DELETE CASCADE,
  UNIQUE(bible_id, book_number, chapter, verse)
);

CREATE INDEX IF NOT EXISTS idx_verses_lookup ON verses(bible_id, book_number, chapter);
CREATE INDEX IF NOT EXISTS idx_verses_search ON verses(text);

CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  category TEXT,
  tags TEXT,
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS song_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('verse','chorus','bridge','prechorus','tag','intro','outro')),
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_song_sections_song ON song_sections(song_id, sort_order);

CREATE TABLE IF NOT EXISTS playlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS playlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  playlist_id INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK(item_type IN ('song','bible','image','video','text')),
  item_id INTEGER,
  title TEXT NOT NULL,
  data TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_playlist_items ON playlist_items(playlist_id, sort_order);

INSERT OR IGNORE INTO settings (key, value) VALUES ('activeBible', '1');
INSERT OR IGNORE INTO settings (key, value) VALUES ('theme', 'dark');
