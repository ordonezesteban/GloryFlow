import { ReactNode } from 'react'

interface ThreeColumnLayoutProps {
  left: ReactNode
  center: ReactNode
  right: ReactNode
}

export function ThreeColumnLayout({ left, center, right }: ThreeColumnLayoutProps) {
  return (
    <div className="grid h-screen grid-cols-[280px_1fr_320px] gap-px bg-border">
      <aside className="flex flex-col bg-background p-3 overflow-hidden">
        {left}
      </aside>
      <main className="flex flex-col bg-background p-3 overflow-hidden">
        {center}
      </main>
      <aside className="flex flex-col bg-background p-3 overflow-hidden">
        {right}
      </aside>
    </div>
  )
}
