import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`videos/${file.name}`, file, {
      access: 'public',
    })

    // Save to Supabase
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('videos')
      .insert({
        filename: file.name,
        blob_url: blob.url,
        blob_pathname: blob.pathname,
        status: 'uploaded',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save video record' }, { status: 500 })
    }

    // Add log entry
    await supabase.from('session_logs').insert({
      message: `File ${file.name} received by Agent Finishing.`,
      log_type: 'success',
    })

    return NextResponse.json({ 
      url: blob.url, 
      video: data 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
