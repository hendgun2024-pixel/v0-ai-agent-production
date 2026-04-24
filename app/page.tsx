"use client"

import { useState } from "react"
import { Zap, Activity, Upload, Play, Share2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function OmniviralDashboard() {
  const [progress, setProgress] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="text-primary h-6 w-6" />
            <h1 className="text-xl font-bold">OMNIVIRAL <span className="text-primary">360</span></h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-medium">System Active</span>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="production" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="music">MusicFul AI</TabsTrigger>
            <TabsTrigger value="lipsync">Lip-Sync</TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <Card className="p-4 border-primary/20">
                <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase">Workspace</h2>
                <Textarea
                  placeholder="Enter your content brief here..."
                  className="min-h-[150px] mb-4 bg-secondary/50"
                />
                <Button className="w-full shadow-lg shadow-primary/20">Run AI Analysis</Button>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card className="p-4 bg-card">
                <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase">Build Workflow</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" className="flex-1"><Play className="h-4 w-4 mr-2"/> Build</Button>
                    <Button variant="outline" className="flex-1"><Share2 className="h-4 w-4 mr-2"/> Post</Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="music">
            <Card className="p-8 text-center border-dashed border-2">
              <h2 className="text-2xl font-bold text-primary mb-2">MusicFul AI Engine</h2>
              <p className="text-muted-foreground mb-6">Generate viral-ready background music for your content.</p>
              <div className="max-w-md mx-auto space-y-4">
                <Textarea placeholder="Describe the mood (e.g. Energetic Phonk, Lo-fi chill)..." className="bg-secondary/50" />
                <Button className="w-full">Generate AI Track</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="lipsync">
            <Card className="p-8 text-center border-dashed border-2">
              <h2 className="text-2xl font-bold text-primary mb-2">Lip-Sync Studio</h2>
              <p className="text-muted-foreground mb-6">Sync any audio to your character's facial movements.</p>
              <div className="flex justify-center gap-4">
                <div className="h-32 w-32 border border-border rounded flex items-center justify-center bg-secondary/30">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="h-32 w-32 border border-border rounded flex items-center justify-center bg-secondary/30">
                  <Play className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <Button className="mt-6">Start Lip-Syncing</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
