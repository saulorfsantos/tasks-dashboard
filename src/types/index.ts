export type TaskStatus = 'A Fazer' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Realizada'

export type TaskPriority = 'Alta' | 'Média' | 'Baixa' | string

export type ProjectKey = 'CDP' | 'RSL' | 'Savigny' | 'Jarede' | 'Forte Mais' | string

export type DeadlineStatus =
  | { type: 'overdue'; label: string; daysLate: number }
  | { type: 'today'; label: string }
  | { type: 'tomorrow'; label: string }
  | null

export interface Task {
  id: string
  projeto: ProjectKey
  tarefa: string
  status: TaskStatus
  prioridade: TaskPriority
  prazo: string // ISO date string or dd/mm/yyyy
  deadlineStatus: DeadlineStatus
}

export interface FilterState {
  projeto: string
  prioridade: string
}

export type KanbanColumn = {
  key: TaskStatus
  label: string
  colorVar: string
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { key: 'A Fazer',       label: 'A Fazer',       colorVar: 'var(--status-afazer)' },
  { key: 'Em Andamento',  label: 'Em Andamento',  colorVar: 'var(--status-andamento)' },
  { key: 'Pausado',       label: 'Pausado',        colorVar: 'var(--status-pausado)' },
  { key: 'Concluído',     label: 'Concluído',      colorVar: 'var(--status-concluido)' },
]

export const PROJECT_COLORS: Record<string, string> = {
  'CDP':        '#e7004c',
  'RSL':        '#3B82F6',
  'Savigny':    '#10B981',
  'Jarede':     '#F59E0B',
  'Forte Mais': '#8B5CF6',
}

export const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'Alta':  { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  label: 'Alta' },
  'Média': { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Média' },
  'Baixa': { color: '#6B7280', bg: 'rgba(107,114,128,0.12)', label: 'Baixa' },
}
