import { ReactNode } from 'react'

interface MainLayoutProps {
  mapArea: ReactNode
  sidePanel: ReactNode
}

export function MainLayout({ mapArea, sidePanel }: MainLayoutProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 h-full">
        {mapArea}
      </div>
      <div className="w-[360px] h-full bg-surface border-l border-separator overflow-y-auto">
        {sidePanel}
      </div>
    </div>
  )
}
