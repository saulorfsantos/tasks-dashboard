import { parseISO, differenceInDays, addDays, format, isValid, parse } from 'date-fns'
import type { DeadlineStatus, Task } from '@/types'

/** Parse dates in both ISO (2026-04-10) and BR format (10/04/2026) */
function parseDate(dateStr: string): Date | null {
  if (!dateStr?.trim()) return null

  // Try ISO format first
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const d = parseISO(dateStr)
    return isValid(d) ? d : null
  }

  // Try dd/mm/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}/.test(dateStr)) {
    const d = parse(dateStr, 'dd/MM/yyyy', new Date())
    return isValid(d) ? d : null
  }

  // Try dd/mm/yy
  if (/^\d{2}\/\d{2}\/\d{2}$/.test(dateStr)) {
    const d = parse(dateStr, 'dd/MM/yy', new Date())
    return isValid(d) ? d : null
  }

  return null
}

export function getDeadlineStatus(prazo: string, status: string): DeadlineStatus {
  const completedStatuses = ['Concluído', 'Realizada', 'Concluida']
  if (completedStatuses.includes(status)) return null

  const date = parseDate(prazo)
  if (!date) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diff = differenceInDays(date, today)

  if (diff < 0) {
    const daysLate = Math.abs(diff)
    return { type: 'overdue', label: `${daysLate} dia${daysLate > 1 ? 's' : ''} de atraso`, daysLate }
  }
  if (diff === 0) return { type: 'today', label: 'Vence hoje' }
  if (diff === 1) return { type: 'tomorrow', label: 'Vence amanhã' }

  return null
}

/** Add N business days (skip Sat/Sun) */
export function addBusinessDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr)
  if (!date) return dateStr

  let count = 0
  let current = date
  while (count < days) {
    current = addDays(current, 1)
    const dow = current.getDay()
    if (dow !== 0 && dow !== 6) count++
  }
  return format(current, 'dd/MM/yyyy')
}

export function formatDeadline(prazo: string): string {
  const date = parseDate(prazo)
  if (!date) return prazo
  return format(date, 'dd/MM/yyyy')
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function getGreetingEmoji(): string {
  const hour = new Date().getHours()
  if (hour < 12) return '☀️'
  if (hour < 18) return '🌤️'
  return '🌙'
}

export function buildClientMessage(task: Task): string {
  const novaData = addBusinessDays(task.prazo, 3)
  return `[Cliente], tudo bem? Passando para dar um update sobre ${task.tarefa}. Estou trabalhando nisso e a previsão é entregar até ${novaData}. Qualquer dúvida, me avisa!`
}

export function formatLastUpdated(date: Date): string {
  return format(date, 'HH:mm:ss')
}
