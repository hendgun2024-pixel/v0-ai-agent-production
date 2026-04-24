"use client"

import { useState, useEffect } from "react"
import { Zap, Activity, Upload, Play, Share2, Music, Languages } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
// Import client Supabase jika kamu sudah setup, jika belum kita pakai simulasi dulu
// import { supabase } from "@/lib/supabase" 

export default function OmniviralDashboard() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("idle")
  const [logs, setLogs] = useState<string[]>(["System initialized. Ready for production."])
  const [aiOutput, setAiOutput] = useState("")

  // Fungsi Jalankan Produksi AI (Tab 1)
  const runAnalysis = () => {
    setAiOutput("Analyzing trend data... 🤖\nTargeting: Viral Hooks & Trending Audio...\nResult: Skrip video siap! Fokus pada 3 detik pertama dengan visual kontras tinggi.")
    addLog("AI Agent: Content analysis completed.")
  }

  // Fungsi Jalankan Build Workflow
  const startBuild = () => {
    if (status === "building") return
    setStatus("building")
    setProgress(0)
    addLog("Starting build process...")

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus("completed")
          addLog("BUILD SUCCESS: Content ready for distribution.")
          return 100
        }
        const next = prev + 5
        if (next === 25) addLog("Processing Agent Skrip Viral...")
        if (next === 50) addLog("Merging MusicFul AI tracks...")
        if (next === 75) addLog("Finalizing Lip-Sync Studio...")
        return next
      })
    }, 300)
  }

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev])
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-emerald-500/20 bg-black/50 backdrop-blur-md p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="text-emerald-400 h-6 w-6 fill-emerald-400" />
            <h1 className="text-xl font-bold tracking-tighter">OMNIVIRAL <span className="text-emerald-400">300</span></h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
            <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Agent Online</span>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-7xl mx-auto">
        <Tabs defaultValue="production" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="music">MusicFul AI</TabsTrigger>
            <TabsTrigger value="lipsync">Lip-Sync</TabsTrigger>
          </TabsList>

          {/* TAB 1: PRODUCTION */}
          <TabsContent value="production" className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <h2 className="text-xs font-bold mb-4 text-emerald-400 uppercase tracking-widest">Workspace Agent</h2>
                <Textarea 
                  placeholder="Masukkan brief konten atau ide video di sini..." 
                  className="min-h-[120px] mb-4 bg-black border-zinc-800 focus:border-emerald-500"
                />
                <Button onClick={runAnalysis} className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold">
                  RUN AI ANALYSIS
                </Button>
                {aiOutput && (
                  <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded text-sm font-mono text-emerald-200 whitespace-pre-wrap">
                    {aiOutput}
                  </div>
                )}
              </Card>

              <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <h2 className="text-xs font-bold mb-4 text-zinc-500 uppercase">Live Session Logs</h2>
                <div className="h-[150px] overflow-y-auto font-mono text-[10px] space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes("SUCCESS") ? "text-emerald-400" : "text-zinc-400"}>
                      {log}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <h2 className="text-xs font-bold mb-4 text-emerald-400 uppercase">Build Workflow</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="text-zinc-500 uppercase">Progress</span>
                    <span className="text-emerald-400">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black rounded-full">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <Button 
                    onClick={startBuild} 
                    disabled={status === "building"}
                    className="w-full bg-white text-black hover:bg-zinc-200 font-bold"
                  >
                    {status === "building" ? "PROCESSING..." : "START BUILD"}
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: MUSICFUL AI */}
          <TabsContent value="music">
            <Card className="p-8 text-center bg-zinc-900/50 border-zinc-800">
              <Music className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
              <h2 className="text-xl font-bold mb-2">MusicFul AI Engine</h2>
              <p className="text-zinc-400 text-sm mb-6">Ubah teks menjadi background music yang viral.</p>
              <div className="max-w-md mx-auto space-y-4">
                <Textarea placeholder="Mood: Phonk, Bass Boosted, Cinematic..." className="bg-black border-zinc-800" />
                <Button onClick={() => addLog("MusicFul: Generating audio track...")} className="w-full bg-emerald-500 text-black font-bold">GENERATE AUDIO</Button>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: LIPSYNC */}
          <TabsContent value="lipsync">
            <Card className="p-8 text-center bg-zinc-900/50 border-zinc-800">
              <Languages className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
              <h2 className="text-xl font-bold mb-2">Lip-Sync Studio</h2>
              <p className="text-zinc-400 text-sm mb-6">Sinkronisasi gerakan mulut dengan audio AI.</p>
              <div className="flex justify-center gap-4 mb-6">
                <div className="h-24 w-24 border border-zinc-800 rounded-lg flex flex-col items-center justify-center bg-black hover:border-emerald-500 transition-colors cursor-pointer">
                  <Upload className="h-5 w-5 mb-1 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500">Video</span>
                </div>
                <div className="h-24 w-24 border border-zinc-800 rounded-lg flex flex-col items-center justify-center bg-black hover:border-emerald-500 transition-colors cursor-pointer">
                  <Music className="h-5 w-5 mb-1 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500">Audio</span>
                </div>
              </div>
              <Button onClick={() => addLog("LipSync: Analyzing facial landmarks...")} className="w-full max-w-xs bg-emerald-500 text-black font-bold">START SYNCING</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
