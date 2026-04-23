"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Video, Loader2, Upload, Play, Download, Mic2 } from "lucide-react"

interface LipSyncVideo {
  id: string
  title: string
  lyrics: string
  status: 'processing' | 'rendering' | 'completed' | 'failed'
  progress: number
  music_tracks?: { title: string; genre: string; duration: number }
  videos?: { filename: string }
  created_at: string
}

interface MusicTrack {
  id: string
  title: string
  genre: string
  status: string
}

interface SourceVideo {
  id: string
  filename: string
  status: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function LipSyncStudio() {
  const { data: lipsyncVideos, mutate: mutateLipsync } = useSWR<LipSyncVideo[]>('/api/lipsync', fetcher, {
    refreshInterval: 2000
  })
  const { data: musicTracks } = useSWR<MusicTrack[]>('/api/music', fetcher)
  const { data: sourceVideos } = useSWR<SourceVideo[]>('/api/videos', fetcher)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [title, setTitle] = useState("")
  const [lyrics, setLyrics] = useState("")
  const [selectedMusic, setSelectedMusic] = useState<string>("")
  const [selectedVideo, setSelectedVideo] = useState<string>("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setUploadedFile(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleProcess = async () => {
    if (!title.trim()) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/lipsync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          musicTrackId: selectedMusic || null,
          sourceVideoId: selectedVideo || null,
          lyrics: lyrics.trim()
        })
      })

      if (response.ok) {
        setTitle("")
        setLyrics("")
        setSelectedMusic("")
        setSelectedVideo("")
        setUploadedFile(null)
        mutateLipsync()
      }
    } catch (error) {
      console.error('Failed to process lip-sync:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const completedTracks = musicTracks?.filter(t => t.status === 'completed') || []

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Mic2 className="h-4 w-4 text-primary" />
          </div>
          Lip-Sync Studio
          <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
            AI
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Studio Form */}
        <div className="space-y-3 rounded-lg border border-border/50 bg-secondary/30 p-4">
          <Input
            placeholder="Video title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50"
          />

          {/* Video Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : uploadedFile
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-border/50 hover:border-primary/50'
            }`}
          >
            {uploadedFile ? (
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-green-400" />
                <span className="text-sm">{uploadedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadedFile(null)}
                  className="h-6 px-2 text-xs"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop video or{' '}
                  <label className="cursor-pointer text-primary hover:underline">
                    browse
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </p>
              </>
            )}
          </div>

          {/* Or select existing video */}
          {sourceVideos && sourceVideos.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Or select uploaded video</label>
              <Select value={selectedVideo} onValueChange={setSelectedVideo}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a video..." />
                </SelectTrigger>
                <SelectContent>
                  {sourceVideos.map((video) => (
                    <SelectItem key={video.id} value={video.id}>
                      {video.filename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Music Selection */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Select music track</label>
            <Select value={selectedMusic} onValueChange={setSelectedMusic}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a track from MusicFul AI..." />
              </SelectTrigger>
              <SelectContent>
                {completedTracks.length > 0 ? (
                  completedTracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.title} ({track.genre})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No tracks available - Generate one first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Lyrics Input */}
          <Textarea
            placeholder="Enter lyrics for lip-sync (optional)..."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            className="min-h-[80px] resize-none bg-background/50"
          />

          <Button
            onClick={handleProcess}
            disabled={isProcessing || !title.trim()}
            className="w-full gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Mic2 className="h-4 w-4" />
                Create Lip-Sync Video
              </>
            )}
          </Button>
        </div>

        {/* Processing Videos */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Lip-Sync Projects</h4>
          <div className="max-h-[200px] space-y-2 overflow-y-auto">
            {lipsyncVideos && lipsyncVideos.length > 0 ? (
              lipsyncVideos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-lg border border-border/50 bg-secondary/20 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {video.status === 'completed' ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{video.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {video.music_tracks?.title || 'No track'} 
                        {video.music_tracks && ` • ${video.music_tracks.genre}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {video.status === 'completed' && (
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
                          video.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : video.status === 'failed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {video.status}
                      </span>
                    </div>
                  </div>
                  {video.status !== 'completed' && video.status !== 'failed' && (
                    <div className="mt-3">
                      <Progress value={video.progress} className="h-1.5" />
                      <p className="mt-1 text-xs text-muted-foreground text-right">
                        {video.progress}%
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No lip-sync videos yet. Create your first one above!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
