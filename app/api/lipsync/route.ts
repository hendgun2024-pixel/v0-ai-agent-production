import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('lipsync_videos')
      .select(`
        *,
        music_tracks (title, genre, duration),
        videos (filename)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching lipsync videos:', error)
    return NextResponse.json({ error: 'Failed to fetch lipsync videos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, musicTrackId, sourceVideoId, lyrics } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Create initial record
    const { data: lipsync, error: insertError } = await supabase
      .from('lipsync_videos')
      .insert({
        title,
        music_track_id: musicTrackId || null,
        source_video_id: sourceVideoId || null,
        lyrics: lyrics || '',
        status: 'processing',
        progress: 0
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Log the action
    await supabase.from('session_logs').insert({
      message: `LipSyncAI: Processing "${title}" - Analyzing audio and video`,
      log_type: 'info'
    })

    // Simulate lip-sync processing with progress updates
    const progressSteps = [
      { progress: 20, message: 'Analyzing audio waveform...' },
      { progress: 40, message: 'Detecting facial landmarks...' },
      { progress: 60, message: 'Mapping phonemes to visemes...' },
      { progress: 80, message: 'Rendering lip movements...' },
      { progress: 100, message: 'Finalizing video...' }
    ]

    let stepIndex = 0
    const interval = setInterval(async () => {
      if (stepIndex >= progressSteps.length) {
        clearInterval(interval)
        const supabaseFinal = await createClient()
        await supabaseFinal
          .from('lipsync_videos')
          .update({ 
            status: 'completed',
            progress: 100,
            blob_url: `https://example.com/lipsync/${lipsync.id}.mp4`,
            blob_pathname: `lipsync/${lipsync.id}.mp4`
          })
          .eq('id', lipsync.id)

        await supabaseFinal.from('session_logs').insert({
          message: `LipSyncAI: "${title}" completed successfully`,
          log_type: 'success'
        })
        return
      }

      const step = progressSteps[stepIndex]
      const supabaseProgress = await createClient()
      await supabaseProgress
        .from('lipsync_videos')
        .update({ 
          progress: step.progress,
          status: step.progress === 100 ? 'completed' : 'rendering'
        })
        .eq('id', lipsync.id)

      stepIndex++
    }, 2000)

    return NextResponse.json(lipsync)
  } catch (error) {
    console.error('Error creating lipsync video:', error)
    return NextResponse.json({ error: 'Failed to create lipsync video' }, { status: 500 })
  }
}
