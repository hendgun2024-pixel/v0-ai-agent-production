"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/dashboard/header"
import { AgentStatus } from "@/components/dashboard/agent-status"
import { ProductionWorkspace } from "@/components/dashboard/production-workspace"
import { VideoUpload } from "@/components/dashboard/video-upload"
import { SessionLogs } from "@/components/dashboard/session-logs"
import { BuildWorkflow } from "@/components/dashboard/build-workflow"
import { mutate } from "swr"

export default function Dashboard() {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)

  const addLog = useCallback(async (message: string, type: "info" | "success" | "warning" | "error" = "info") => {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, log_type: type }),
      })
      // Refresh logs
      mutate("/api/logs")
    } catch {
      console.error("Failed to add log")
    }
  }, [])

  const handleUploadComplete = useCallback((video: { id: string; filename: string; pathname: string }) => {
    setCurrentVideoId(video.id)
    addLog(`Video ready for processing: ${video.filename}`, "success")
  }, [addLog])

  const handleAnalysisComplete = useCallback((result: string) => {
    addLog(`Analysis completed: ${result.substring(0, 50)}...`, "success")
  }, [addLog])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column - Agent Status & Video Upload */}
            <div className="space-y-6 lg:col-span-3">
              <AgentStatus />
              <VideoUpload 
                onUploadComplete={handleUploadComplete}
                onLogMessage={addLog}
              />
            </div>

            {/* Center Column - Production Workspace */}
            <div className="lg:col-span-6">
              <ProductionWorkspace onAnalysisComplete={handleAnalysisComplete} />
            </div>

            {/* Right Column - Session Logs & Build Workflow */}
            <div className="space-y-6 lg:col-span-3">
              <SessionLogs />
              <BuildWorkflow 
                videoId={currentVideoId}
                onLogMessage={addLog}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
