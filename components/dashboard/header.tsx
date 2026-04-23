"use client"

import { Activity, Zap } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shadow-[0_0_20px_oklch(0.85_0.25_142/0.3)]">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              OMNIVIRAL <span className="text-primary">360</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              AI Multi-Agent Production
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-medium text-foreground">Live</span>
          </div>
        </div>
      </div>
    </header>
  )
}
