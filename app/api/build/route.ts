import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { videoId } = await request.json()

  if (!videoId) {
    return new Response(JSON.stringify({ error: 'Video ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const supabase = await createClient()

        // Create build record
        const { data: build, error: buildError } = await supabase
          .from('builds')
          .insert({
            video_id: videoId,
            status: 'building',
            progress: 0,
          })
          .select()
          .single()

        if (buildError) {
          send({ error: 'Failed to create build', status: 'failed' })
          controller.close()
          return
        }

        // Add initial log
        await supabase.from('session_logs').insert({
          message: 'Build process initialized...',
          log_type: 'info',
        })

        send({ progress: 10, status: 'building', message: 'Build process initialized...', type: 'info' })

        // Simulate build stages
        const stages = [
          { progress: 25, message: 'Analyzing video content...', delay: 800 },
          { progress: 40, message: 'Merging Agents data...', delay: 1000 },
          { progress: 55, message: 'Generating captions...', delay: 800 },
          { progress: 70, message: 'Applying Verified Key Signature...', delay: 1000 },
          { progress: 85, message: 'Optimizing for platforms...', delay: 700 },
          { progress: 95, message: 'Finalizing build...', delay: 500 },
        ]

        for (const stage of stages) {
          await new Promise(resolve => setTimeout(resolve, stage.delay))
          
          await supabase.from('session_logs').insert({
            message: stage.message,
            log_type: 'info',
          })

          send({ progress: stage.progress, message: stage.message, type: 'info' })
        }

        // Complete the build
        const result = 'Your viral video content is ready! Optimized for TikTok, Instagram Reels, and YouTube Shorts with AI-generated captions and hooks.'

        await supabase
          .from('builds')
          .update({
            status: 'completed',
            progress: 100,
            result,
            completed_at: new Date().toISOString(),
          })
          .eq('id', build.id)

        await supabase.from('session_logs').insert({
          message: 'BUILD SUCCESS: Content Ready for Distribution.',
          log_type: 'success',
        })

        send({ 
          progress: 100, 
          status: 'completed', 
          message: 'BUILD SUCCESS: Content Ready for Distribution.',
          type: 'success',
          result 
        })

      } catch (error) {
        console.error('Build error:', error)
        send({ error: 'Build failed', status: 'failed' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
