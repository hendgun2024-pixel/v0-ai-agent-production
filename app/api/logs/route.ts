import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('session_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }

    return NextResponse.json({ logs: data })
  } catch (error) {
    console.error('Fetch logs error:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, log_type = 'info' } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('session_logs')
      .insert({ message, log_type })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to add log' }, { status: 500 })
    }

    return NextResponse.json({ log: data })
  } catch (error) {
    console.error('Add log error:', error)
    return NextResponse.json({ error: 'Failed to add log' }, { status: 500 })
  }
}
