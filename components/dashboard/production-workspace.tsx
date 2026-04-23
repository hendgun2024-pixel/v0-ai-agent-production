"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type ProductionWorkspaceProps = {
  onAnalysisComplete?: (result: string) => void
}

export function ProductionWorkspace({ onAnalysisComplete }: ProductionWorkspaceProps) {
  const [prompt, setPrompt] = useState("")
  const [output, setOutput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!prompt.trim()) return

    setIsAnalyzing(true)
    setOutput("")

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.error) {
        setOutput(`Error: ${data.error}`)
      } else {
        setOutput(data.result)
        onAnalysisComplete?.(data.result)
      }
    } catch {
      setOutput("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Production Workspace
        </h2>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !prompt.trim()}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_12px_oklch(0.85_0.25_142/0.4)]"
        >
          {isAnalyzing ? "Analyzing..." : "Run Analysis"}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Input Prompt
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your content brief or analysis request..."
            className="h-24 resize-none border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
          />
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            AI Output
          </label>
          <div className="h-32 overflow-auto rounded-md border border-border bg-background p-3 font-mono text-sm">
            {isAnalyzing ? (
              <span className="text-primary animate-pulse">Processing...</span>
            ) : output ? (
              <pre className="whitespace-pre-wrap text-foreground">{output}</pre>
            ) : (
              <span className="text-muted-foreground">Output will appear here...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
