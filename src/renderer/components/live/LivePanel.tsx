import { useState } from 'react'
import { Monitor, Square, Eye, Image } from 'lucide-react'

export function LivePanel() {
  const [liveActive, setLiveActive] = useState(false)
  const [displays, setDisplays] = useState<any[]>([])

  const loadDisplays = async () => {
    const d = await window.gloryflow.getDisplays()
    setDisplays(d)
  }

  const startLive = async (displayId: number) => {
    await window.gloryflow.createLiveWindow(displayId)
    setLiveActive(true)
  }

  const stopLive = async () => {
    await window.gloryflow.closeLiveWindow()
    setLiveActive(false)
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Control En Vivo</h3>
        <div className="rounded border border-border bg-card p-2">
          <div className="mb-2 text-xs text-gray-400">Previsualización</div>
          <div className="aspect-video w-full rounded bg-black flex items-center justify-center text-xs text-gray-600">
            Sin contenido
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-medium">Acceso Rápido</div>
        <div className="grid grid-cols-2 gap-1.5">
          <button className="rounded bg-card border border-border px-2 py-1.5 text-xs hover:bg-primary/20">Estrofa 1</button>
          <button className="rounded bg-card border border-border px-2 py-1.5 text-xs hover:bg-primary/20">Coro</button>
          <button className="rounded bg-card border border-border px-2 py-1.5 text-xs hover:bg-primary/20">Puente</button>
          <button className="rounded bg-card border border-border px-2 py-1.5 text-xs hover:bg-primary/20">Estrofa 2</button>
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-medium">Control de Pantalla</div>
        <div className="grid grid-cols-3 gap-1.5">
          <button onClick={() => window.gloryflow.setBlack(true)} className="flex items-center justify-center gap-1 rounded bg-card border border-border px-2 py-2 text-xs hover:bg-red-900/30">
            <Square size={12} /> BLACK
          </button>
          <button onClick={() => window.gloryflow.setClear()} className="flex items-center justify-center gap-1 rounded bg-card border border-border px-2 py-2 text-xs hover:bg-primary/20">
            <Eye size={12} /> CLEAR
          </button>
          <button onClick={() => window.gloryflow.showLogo(true)} className="flex items-center justify-center gap-1 rounded bg-card border border-border px-2 py-2 text-xs hover:bg-primary/20">
            <Image size={12} /> LOGO
          </button>
        </div>
      </div>

      <div className="mt-auto">
        <div className="mb-2 text-xs font-medium">Ventana de Proyección</div>
        {!liveActive ? (
          <button onClick={loadDisplays} className="w-full rounded bg-primary px-3 py-2 text-xs font-medium hover:bg-blue-600 flex items-center justify-center gap-2">
            <Monitor size={14} /> Detectar Pantallas
          </button>
        ) : (
          <button onClick={stopLive} className="w-full rounded bg-red-600 px-3 py-2 text-xs font-medium hover:bg-red-700">
            Cerrar Proyección
          </button>
        )}
        {displays.length > 0 && !liveActive && (
          <div className="mt-2 flex flex-col gap-1">
            {displays.map((d) => (
              <button key={d.id} onClick={() => startLive(d.id)} className="w-full rounded bg-card border border-border px-2 py-1.5 text-xs text-left hover:bg-primary/20">
                Pantalla {d.id + 1} {d.primary ? '(Principal)' : ''} - {d.bounds.width}x{d.bounds.height}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
