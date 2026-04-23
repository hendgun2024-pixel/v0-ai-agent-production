"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Music, Loader2, Play, Download, Sparkles } from "lucide-react"

interface MusicTrack {
  id: string
  title: string
  prompt: string
  genre: string
  duration: number
  status: 'generating' | 'completed' | 'failed'
  created_at: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const genres = [
  "Electronic",
  "Hip Hop",
  "Pop",
  "Rock",
  "Jazz",
  "Classical",
  "Ambient",
  "Lo-Fi",
  "Cinematic",
  "EDM"
]

export function MusicGenerator() {
  const { data: tracks, mutate } = useSWR<MusicTrack[]>('/api/music', fetcher, {
    refreshInterval: 3000
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [title, setTitle] = useState("")
  const [prompt, setPrompt] = useState("")
  const [genre, setGenre] = useState("Electronic")
  const [duration, setDuration] = useState([30])

  const handleGenerate = async () => {
    if (!title.trim() || !prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          prompt: prompt.trim(),
          genre,
          duration: duration[0]
        })
      })

      if (response.ok) {
        setTitle("")
        setPrompt("")
        mutate()
      }
    } catch (error) {
      console.error('Failed to generate music:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Music className="h-4 w-4 text-primary" />
          </div>
          MusicFul AI
          <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
            Beta
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generator Form */}
        <div className="space-y-3 rounded-lg border border-border/50 bg-secondary/30 p-4">
          <Input
            placeholder="Track title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50"
          />
          <Textarea
            placeholder="Describe the music you want to generate... (e.g., 'Upbeat electronic track with synth melodies and deep bass drops')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] resize-none bg-background/50"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Genre</label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Duration: {duration[0]}s
              </label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={15}
                max={120}
                step={15}
                className="py-2"
              />
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim() || !prompt.trim()}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Music
              </>
            )}
          </Button>
        </div>

        {/* Generated Tracks */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Tracks</h4>
          <div className="max-h-[200px] space-y-2 overflow-y-auto">
            {tracks && tracks.length > 0 ? (
              tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/20 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    {track.status === 'generating' ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <Music className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{track.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {track.genre} &bull; {track.duration}s
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {track.status === 'completed' && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        track.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : track.status === 'generating'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {track.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No tracks generated yet. Create your first track above!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
