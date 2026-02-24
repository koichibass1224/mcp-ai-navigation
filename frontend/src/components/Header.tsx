export function Header() {
  return (
    <header className="h-14 bg-surface border-b border-separator px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-apple-purple rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">✦</span>
        </div>
        <div>
          <h1 className="text-base font-semibold text-white">
            AI Navigation
          </h1>
          <p className="text-xs text-white/40">
            MCP × Google Maps PoC
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 bg-elevated rounded-md text-xs text-white/60">
          Demo
        </span>
      </div>
    </header>
  )
}
