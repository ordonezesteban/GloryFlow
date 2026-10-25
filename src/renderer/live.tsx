import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { Slide } from '../shared/types'

function LiveView() {
  const [slide, setSlide] = useState<Slide>({ id: 'init', type: 'clear', content: '' })

  useEffect(() => {
    const cleanup = window.gloryflow.onLiveSlideUpdate((newSlide) => {
      setSlide(newSlide)
    })
    return cleanup
  }, [])

  if (slide.type === 'black') {
    return <div className="h-screen w-screen bg-black" />
  }

  if (slide.type === 'logo') {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-6xl font-bold text-white/80">GloryFlow</div>
      </div>
    )
  }

  if (slide.type === 'clear') {
    return <div className="h-screen w-screen bg-transparent" />
  }

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center p-16">
      <div className="max-w-7xl text-center">
        <p className="text-6xl font-semibold leading-tight whitespace-pre-wrap">{slide.content}</p>
        {slide.subContent && <p className="mt-8 text-4xl text-gray-300 whitespace-pre-wrap">{slide.subContent}</p>}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('live-root')!).render(
  <React.StrictMode>
    <LiveView />
  </React.StrictMode>
)
