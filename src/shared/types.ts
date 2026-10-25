export type SlideType = 'song' | 'bible' | 'image' | 'video' | 'black' | 'clear' | 'logo'

export interface Slide {
  id: string
  type: SlideType
  content: string
  subContent?: string
  background?: string
}

export interface Song {
  id: string
  title: string
  author?: string
  lyrics: SongSection[]
  tags?: string[]
}

export interface SongSection {
  id: string
  type: 'verse' | 'chorus' | 'bridge' | 'prechorus' | 'tag'
  label: string
  lines: string[]
}

export interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
}

export interface PlaylistItem {
  id: string
  type: SlideType
  title: string
  data: any
}

export interface DisplayInfo {
  id: number
  bounds: { x: number; y: number; width: number; height: number }
  primary: boolean
}
