import { NextResponse } from 'next/server'
import { fetchTasks } from '@/lib/sheets'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.SHEETS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'SHEETS_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    const tasks = await fetchTasks(apiKey)
    return NextResponse.json(tasks, {
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/tasks]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
