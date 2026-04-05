import { getDeadlineStatus } from '@/lib/utils'
import type { Task } from '@/types'

function normalizeStatus(raw: string): Task['status'] {
  switch (raw.trim().toLowerCase()) {
    case 'a fazer':      return 'A Fazer'
    case 'em andamento': return 'Em Andamento'
    case 'pausado':      return 'Pausado'
    case 'concluído':
    case 'concluido':
    case 'realizada':    return 'Concluído'
    default:             return raw.trim() as Task['status']
  }
}

const SPREADSHEET_ID = '1utkjBf2fGwuWuO9ZNmE-QCS9guKyK7i8z-50H6A0toc'
const SHEET_NAME = 'Master'
const RANGE = `${encodeURIComponent(SHEET_NAME)}!A:F`

export async function fetchTasks(apiKey: string): Promise<Task[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${apiKey}`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google Sheets API error ${res.status}: ${body}`)
  }

  const data = await res.json() as { values?: string[][] }

  if (!data.values || data.values.length < 2) return []

  const [header, ...rows] = data.values

  // Find column indices by header name (case-insensitive, trimmed)
  const idx = (name: string) =>
    header.findIndex(h => h.trim().toUpperCase() === name.toUpperCase())

  const idIdx        = idx('ID')
  const projetoIdx   = idx('PROJETO')
  const tarefaIdx    = idx('TAREFA')
  const statusIdx    = idx('STATUS')
  const prioridadeIdx = idx('PRIORIDADE')
  const prazoIdx     = idx('PRAZO')

  const tasks: Task[] = []

  for (const row of rows) {
    const id        = row[idIdx]?.trim() ?? ''
    const projeto   = row[projetoIdx]?.trim() ?? ''
    const tarefa    = row[tarefaIdx]?.trim() ?? ''
    const status    = row[statusIdx]?.trim() ?? ''
    const prioridade = row[prioridadeIdx]?.trim() ?? ''
    const prazo     = row[prazoIdx]?.trim() ?? ''

    // Skip empty rows
    if (!tarefa && !id) continue

    tasks.push({
      id,
      projeto,
      tarefa,
      status: normalizeStatus(status),
      prioridade,
      prazo,
      deadlineStatus: getDeadlineStatus(prazo, status),
    })
  }

  return tasks
}
