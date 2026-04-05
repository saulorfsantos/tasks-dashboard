interface Env {
  SHEETS_API_KEY: string
}

interface Task {
  id: string
  projeto: string
  tarefa: string
  status: string
  prioridade: string
  prazo: string
  deadlineStatus: DeadlineStatus
}

type DeadlineStatus =
  | { type: 'overdue'; label: string; daysLate: number }
  | { type: 'today'; label: string }
  | { type: 'tomorrow'; label: string }
  | null

function parseDate(dateStr: string): Date | null {
  if (!dateStr?.trim()) return null

  // ISO: 2026-04-10
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? null : d
  }

  // BR: dd/mm/yyyy or dd/mm/yy
  const brMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{2,4})$/)
  if (brMatch) {
    const [, dd, mm, yy] = brMatch
    const year = yy.length === 2 ? 2000 + parseInt(yy) : parseInt(yy)
    const d = new Date(year, parseInt(mm) - 1, parseInt(dd))
    return isNaN(d.getTime()) ? null : d
  }

  return null
}

function normalizeStatus(raw: string): string {
  switch (raw.trim().toLowerCase()) {
    case 'a fazer':      return 'A Fazer'
    case 'em andamento': return 'Em Andamento'
    case 'pausado':      return 'Pausado'
    case 'concluído':
    case 'concluido':
    case 'realizada':    return 'Concluído'
    default:             return raw.trim()
  }
}

function getDeadlineStatus(prazo: string, status: string): DeadlineStatus {
  if (status === 'Concluído') return null

  const date = parseDate(prazo)
  if (!date) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  const diffMs = date.getTime() - today.getTime()
  const diff = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diff < 0) {
    const daysLate = Math.abs(diff)
    return { type: 'overdue', label: `${daysLate} dia${daysLate > 1 ? 's' : ''} de atraso`, daysLate }
  }
  if (diff === 0) return { type: 'today', label: 'Vence hoje' }
  if (diff === 1) return { type: 'tomorrow', label: 'Vence amanhã' }

  return null
}

const SPREADSHEET_ID = '1utkjBf2fGwuWuO9ZNmE-QCS9guKyK7i8z-50H6A0toc'
const SHEET_NAME = 'Master'
const RANGE = `${encodeURIComponent(SHEET_NAME)}!A:F`

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.SHEETS_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'SHEETS_API_KEY not configured' }, { status: 500 })
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${apiKey}`
    const res = await fetch(url, { cache: 'no-store' })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Google Sheets API error ${res.status}: ${body}`)
    }

    const data = await res.json() as { values?: string[][] }

    if (!data.values || data.values.length < 2) {
      return Response.json([], { headers: { 'Cache-Control': 'no-store' } })
    }

    const [header, ...rows] = data.values
    const idx = (name: string) =>
      header.findIndex((h: string) => h.trim().toUpperCase() === name.toUpperCase())

    const idIdx         = idx('ID')
    const projetoIdx    = idx('PROJETO')
    const tarefaIdx     = idx('TAREFA')
    const statusIdx     = idx('STATUS')
    const prioridadeIdx = idx('PRIORIDADE')
    const prazoIdx      = idx('PRAZO')

    const tasks: Task[] = []

    for (const row of rows) {
      const id         = row[idIdx]?.trim() ?? ''
      const projeto    = row[projetoIdx]?.trim() ?? ''
      const tarefa     = row[tarefaIdx]?.trim() ?? ''
      const status     = normalizeStatus(row[statusIdx]?.trim() ?? '')
      const prioridade = row[prioridadeIdx]?.trim() ?? ''
      const prazo      = row[prazoIdx]?.trim() ?? ''

      if (!tarefa && !id) continue

      tasks.push({ id, projeto, tarefa, status, prioridade, prazo, deadlineStatus: getDeadlineStatus(prazo, status) })
    }

    return Response.json(tasks, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/tasks]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
