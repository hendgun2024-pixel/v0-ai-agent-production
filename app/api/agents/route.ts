import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    return NextResponse.json({ agents: data })
  } catch (error) {
    console.error('Fetch agents error:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}
