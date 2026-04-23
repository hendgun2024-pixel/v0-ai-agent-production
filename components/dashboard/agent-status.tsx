"use client"

import useSWR from "swr"

type Agent = {
  id: string
  name: string
  status: "online" | "offline"
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AgentStatus() {
  const { data: agents, error, isLoading } = useSWR<Agent[]>("/api/agents", fetcher, {
    refreshInterval: 5000,
  })

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Agent Status
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Agent Status
        </h2>
        <p className="text-sm text-destructive">Failed to load agents</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Agent Status
      </h2>
      <div className="space-y-3">
        {agents?.map((agent) => (
          <div key={agent.id} className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{agent.name}</span>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  agent.status === "online"
                    ? "bg-primary shadow-[0_0_8px_oklch(0.85_0.25_142)]"
                    : "bg-muted-foreground"
                }`}
              />
              <span
                className={`text-xs font-medium uppercase ${
                  agent.status === "online" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {agent.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
