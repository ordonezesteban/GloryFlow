import { Plus } from 'lucide-react'

export function OrderList() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Orden del Culto</h3>
        <button className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs hover:bg-blue-600">
          <Plus size={12} /> Agregar
        </button>
      </div>
      <div className="flex-1 overflow-auto rounded border border-border bg-card">
        <div className="flex h-full items-center justify-center text-xs text-gray-600">
          Sin elementos en la escaleta
        </div>
      </div>
    </div>
  )
}
