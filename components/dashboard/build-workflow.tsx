"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Share2 } from "lucide-react"

type BuildWorkflowProps = {
  videoId?: string | null
  onLogMessage?: (message: string, type: "info" | "success" | "warning" | "error") => void
}

export function BuildWorkflow({ videoId, onLogMessage }: BuildWorkflowProps) {
  const [status, setStatus] = useState<"idle" | "building" | "completed" | "failed">("idle")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    if (status === "completed" || status === "failed") {
      setProgress(100)
    }
  }, [status])

  const handleBuild = async () => {
    if (!videoId) {
      onLogMessage?.("No video selected for build", "warning")
      return
    }

    setStatus("building")
    setProgress(0)
    setResult(null)
    onLogMessage?.("Build process started", "info")

    try {
      const response = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No response body")
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n").filter(Boolean)

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6))

            if (data.progress !== undefined) {
              setProgress(data.progress)
            }

            if (data.status) {
              setStatus(data.status)
            }

            if (data.message) {
              onLogMessage?.(data.message, data.type || "info")
            }

            if (data.result) {
              setResult(data.result)
            }
          }
        }
      }
    } catch {
      setStatus("failed")
      onLogMessage?.("Build process failed", "error")
    }
  }

  const handlePost = () => {
    if (result) {
      onLogMessage?.("Content posted successfully!", "success")
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Build & Post Workflow
      </h2>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full transition-all duration-500 ${
                status === "failed"
                  ? "bg-destructive"
                  : status === "completed"
                  ? "bg-primary shadow-[0_0_12px_oklch(0.85_0.25_142/0.6)]"
                  : "bg-primary"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <span
            className={`text-xs font-medium uppercase ${
              status === "completed"
                ? "text-primary"
                : status === "failed"
                ? "text-destructive"
                : status === "building"
                ? "text-yellow-500"
                : "text-muted-foreground"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Result Preview */}
        {result && (
          <div className="rounded bg-background p-3">
            <p className="text-xs text-muted-foreground mb-1">Generated Content:</p>
            <p className="text-sm text-foreground line-clamp-3">{result}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleBuild}
            disabled={status === "building" || !videoId}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_12px_oklch(0.85_0.25_142/0.4)]"
          >
            <Play className="mr-2 h-4 w-4" />
            {status === "building" ? "Building..." : "Build"}
          </Button>
          <Button
            onClick={handlePost}
            disabled={status !== "completed"}
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/10"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}
