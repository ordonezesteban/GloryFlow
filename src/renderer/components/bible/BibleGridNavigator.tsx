import { useState } from 'react'
import { BIBLE_BOOKS } from '../../../shared/constants'
import { cn } from '../../lib/utils'

type Step = 'book' | 'chapter' | 'verse'

export function BibleGridNavigator() {
  const [step, setStep] = useState<Step>('book')
  const [selectedBook, setSelectedBook] = useState<typeof BIBLE_BOOKS[number] | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)

  const handleBookSelect = (book: typeof BIBLE_BOOKS[number]) => {
    setSelectedBook(book)
    setStep('chapter')
  }

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter)
    setStep('verse')
  }

  const handleBack = () => {
    if (step === 'verse') {
      setStep('chapter')
      setSelectedChapter(null)
    } else if (step === 'chapter') {
      setStep('book')
      setSelectedBook(null)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Navegador Bíblico</h3>
        {step !== 'book' && (
          <button onClick={handleBack} className="text-xs text-gray-400 hover:text-foreground">
            ← Atrás
          </button>
        )}
      </div>

      {step === 'book' && (
        <div className="grid grid-cols-5 gap-1.5 overflow-auto">
          {BIBLE_BOOKS.map((book) => (
            <button
              key={book.abbrev}
              onClick={() => handleBookSelect(book)}
              className={cn(
                'rounded px-1.5 py-1.5 text-xs font-medium transition-colors',
                book.testament === 'OT'
                  ? 'bg-orange-900/40 text-orange-300 hover:bg-orange-800/60'
                  : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60'
              )}
              title={book.name}
            >
              {book.abbrev}
            </button>
          ))}
        </div>
      )}

      {step === 'chapter' && selectedBook && (
        <div className="grid grid-cols-5 gap-1.5 overflow-auto">
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
            <button
              key={chapter}
              onClick={() => handleChapterSelect(chapter)}
              className="rounded bg-card border border-border px-2 py-2 text-sm hover:bg-primary/20 hover:border-primary/50 transition-colors"
            >
              {chapter}
            </button>
          ))}
        </div>
      )}

      {step === 'verse' && selectedBook && selectedChapter && (
        <div className="flex h-full flex-col gap-2">
          <div className="text-xs text-gray-400">
            {selectedBook.name} {selectedChapter}
          </div>
          <div className="grid grid-cols-6 gap-1.5 overflow-auto">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((verse) => (
              <button
                key={verse}
                className="rounded bg-card border border-border px-1 py-1.5 text-xs hover:bg-primary/20 hover:border-primary/50 transition-colors"
              >
                {verse}
              </button>
            ))}
          </div>
          <div className="mt-2 flex-1 overflow-auto rounded border border-border bg-card p-2">
            <p className="text-xs leading-relaxed text-gray-300">
              Selecciona un versículo para ver el texto completo...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
