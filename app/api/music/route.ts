import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching music tracks:', error)
    return NextResponse.json({ error: 'Failed to fetch music tracks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, prompt, genre, duration } = await request.json()

    if (!title || !prompt) {
      return NextResponse.json({ error: 'Title and prompt are required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Create initial record
    const { data: track, error: insertError } = await supabase
      .from('music_tracks')
      .insert({
        title,
        prompt,
        genre: genre || 'Electronic',
        duration: duration || 30,
        status: 'generating'
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Log the action
    await supabase.from('session_logs').insert({
      message: `MusicGen AI: Generating "${title}" - ${genre || 'Electronic'} (${duration || 30}s)`,
      log_type: 'info'
    })

    // Simulate music generation (in real app, this would call an AI service)
    setTimeout(async () => {
      const supabaseUpdate = await createClient()
      await supabaseUpdate
        .from('music_tracks')
        .update({ 
          status: 'completed',
          blob_url: `https://example.com/music/${track.id}.mp3`,
          blob_pathname: `music/${track.id}.mp3`
        })
        .eq('id', track.id)

      await supabaseUpdate.from('session_logs').insert({
        message: `MusicGen AI: "${title}" completed successfully`,
        log_type: 'success'
      })
    }, 5000)

    return NextResponse.json(track)
  } catch (error) {
    console.error('Error creating music track:', error)
    return NextResponse.json({ error: 'Failed to create music track' }, { status: 500 })
  }
}
