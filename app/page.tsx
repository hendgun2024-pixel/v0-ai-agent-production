"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/dashboard/header"
import { AgentStatus } from "@/components/dashboard/agent-status"
import { ProductionWorkspace } from "@/components/dashboard/production-workspace"
import { VideoUpload } from "@/components/dashboard/video-upload"
import { SessionLogs } from "@/components/dashboard/session-logs"
import { BuildWorkflow } from "@/components/dashboard/build-workflow"
import { MusicGenerator } from "@/components/dashboard/music-generator"
import { LipSyncStudio } from "@/components/dashboard/lipsync-studio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
          <Tabs defaultValue="production" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="music">MusicFul AI</TabsTrigger>
              <TabsTrigger value="lipsync">Lip-Sync Studio</TabsTrigger>
            </TabsList>

            {/* Production Tab */}
            <TabsContent value="production" className="space-y-6">
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
            </TabsContent>

            /* Cari bagian MusicFul AI dan ganti isinya dengan ini */
<TabsContent value="music">
  <Card>
    <CardHeader>
      <CardTitle className="text-primary">MusicFul AI Generator</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Textarea placeholder="Describe the music you want to generate..." className="bg-secondary" />
      <Button className="w-full bg-primary text-black">Generate AI Music</Button>
    </CardContent>
  </Card>
</TabsContent>

/* Cari bagian Lip-Sync Studio dan ganti isinya dengan ini */
<TabsContent value="lipsync">
  <Card>
    <CardHeader>
      <CardTitle className="text-primary">Lip-Sync Studio</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="border-2 border-dashed border-border p-10 text-center rounded-lg">
        <p>Upload source video and voice audio to sync</p>
      </div>
      <Button className="w-full mt-4 bg-primary text-black">Start Syncing</Button>
    </CardContent>
  </Card>
</TabsContent>
