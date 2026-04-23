"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"

type Log = {
  id: string
  message: string
  log_type: "info" | "success" | "warning" | "error"
  created_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SessionLogs() {
  const { data: logs, error, isLoading } = useSWR<Log[]>("/api/logs", fetcher, {
    refreshInterval: 3000,
  })
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const getLogColor = (type: Log["log_type"]) => {
    switch (type) {
      case "success":
        return "text-primary"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Live Session Logs
        </h2>
        <div className="h-48 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Live Session Logs
        </h2>
        <p className="text-sm text-destructive">Failed to load logs</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Live Session Logs
      </h2>
      <div className="h-48 overflow-auto rounded bg-background p-2 font-mono text-xs">
        {logs && logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2 py-1">
              <span className="text-muted-foreground shrink-0">
                [{formatTime(log.created_at)}]
              </span>
              <span className={getLogColor(log.log_type)}>{log.message}</span>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No logs yet...</p>
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}
