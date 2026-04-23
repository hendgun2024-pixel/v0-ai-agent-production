import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { video_id } = await request.json()

    if (!video_id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Create build record
    const { data: build, error: buildError } = await supabase
      .from('builds')
      .insert({
        video_id,
        status: 'building',
        progress: 0,
      })
      .select()
      .single()

    if (buildError) {
      return NextResponse.json({ error: 'Failed to create build' }, { status: 500 })
    }

    // Add log
    await supabase.from('session_logs').insert({
      message: 'Build process started...',
      log_type: 'info',
    })

    return NextResponse.json({ build })
  } catch (error) {
    console.error('Build error:', error)
    return NextResponse.json({ error: 'Build failed' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { build_id, progress, status, result } = await request.json()

    if (!build_id) {
      return NextResponse.json({ error: 'Build ID is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const updateData: Record<string, unknown> = {}
    if (progress !== undefined) updateData.progress = progress
    if (status) updateData.status = status
    if (result) updateData.result = result
    if (status === 'completed') updateData.completed_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('builds')
      .update(updateData)
      .eq('id', build_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update build' }, { status: 500 })
    }

    // Add progress logs
    if (progress === 30) {
      await supabase.from('session_logs').insert({
        message: 'Merging Agents data...',
        log_type: 'info',
      })
    } else if (progress === 70) {
      await supabase.from('session_logs').insert({
        message: 'Applying Verified Key Signature...',
        log_type: 'info',
      })
    } else if (progress === 100) {
      await supabase.from('session_logs').insert({
        message: 'BUILD SUCCESS: Content Ready for Distribution.',
        log_type: 'success',
      })
    }

    return NextResponse.json({ build: data })
  } catch (error) {
    console.error('Update build error:', error)
    return NextResponse.json({ error: 'Failed to update build' }, { status: 500 })
  }
}
