"use client"

import { useState, useRef } from "react"
import { Upload, X, Film } from "lucide-react"
import { Button } from "@/components/ui/button"

type VideoUploadProps = {
  onUploadComplete?: (video: { id: string; filename: string; pathname: string }) => void
  onLogMessage?: (message: string, type: "info" | "success" | "warning" | "error") => void
}

export function VideoUpload({ onUploadComplete, onLogMessage }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      setUploadedFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setUploadedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) return

    setIsUploading(true)
    setUploadProgress(0)
    onLogMessage?.(`Starting upload: ${uploadedFile.name}`, "info")

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (data.error) {
        onLogMessage?.(`Upload failed: ${data.error}`, "error")
      } else {
        onLogMessage?.(`Upload complete: ${uploadedFile.name}`, "success")
        onUploadComplete?.(data)
        setUploadedFile(null)
      }
    } catch {
      clearInterval(progressInterval)
      onLogMessage?.("Upload failed. Please try again.", "error")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Video Upload
      </h2>

      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Upload className={`mb-2 h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm text-muted-foreground">
            Drag & drop or click to upload
          </p>
          <p className="mt-1 text-xs text-muted-foreground">MP4, MOV, WebM</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
            <div className="flex items-center gap-3">
              <Film className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={removeFile}
                className="rounded-full p-1 hover:bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {isUploading && (
            <div className="space-y-1">
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {uploadProgress}%
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_12px_oklch(0.85_0.25_142/0.4)]"
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      )}
    </div>
  )
}
