import { useState } from 'react'
import { Search, Music, Book, Image } from 'lucide-react'
import { BibleGridNavigator } from '../bible/BibleGridNavigator'
import { cn } from '../../lib/utils'

type Tab = 'songs' | 'bible' | 'media'

export function LibrarySidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('bible')

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar... (Ctrl+K)"
            className="w-full rounded border border-border bg-card py-1.5 pl-7 pr-2 text-xs outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="mb-3 flex gap-1 rounded bg-card p-1">
        <button
          onClick={() => setActiveTab('songs')}
          className={cn('flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-xs', activeTab === 'songs' && 'bg-primary')}
        >
          <Music size={12} /> Canciones
        </button>
        <button
          onClick={() => setActiveTab('bible')}
          className={cn('flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-xs', activeTab === 'bible' && 'bg-primary')}
        >
          <Book size={12} /> Biblia
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={cn('flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-xs', activeTab === 'media' && 'bg-primary')}
        >
          <Image size={12} /> Multimedia
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'bible' && <BibleGridNavigator />}
        {activeTab === 'songs' && (
          <div className="flex h-full items-center justify-center text-xs text-gray-600">
            Biblioteca de canciones
          </div>
        )}
        {activeTab === 'media' && (
          <div className="flex h-full items-center justify-center text-xs text-gray-600">
            Recursos multimedia
          </div>
        )}
      </div>
    </div>
  )
}
