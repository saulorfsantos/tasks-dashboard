
import { getGreeting, getGreetingEmoji } from '@/lib/utils'
import type { Task } from '@/types'

interface Props {
  tasks: Task[]
  lastUpdated: Date | null
  isLoading: boolean
  onRefresh: () => void
}

interface StatPillProps {
  value: number
  label: string
  color: string
  bg: string
  index: number
}

function StatPill({ value, label, color, index }: StatPillProps) {
  return (
    <div
      className={`animate-fade-up stagger-${index + 2}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: `2px solid ${color}`,
      }}
    >
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600,
          fontSize: 18,
          color,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          minWidth: 24,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 11,
          color: 'var(--text-secondary)',
          fontWeight: 500,
          letterSpacing: '0.02em',
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    </div>
  )
}

function RefreshIndicator({ isLoading, lastUpdated, onRefresh }: {
  isLoading: boolean
  lastUpdated: Date | null
  onRefresh: () => void
}) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {lastUpdated && (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}
        >
          {timeStr}
        </span>
      )}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="btn btn-ghost"
        title="Atualizar dados"
        style={{ padding: '6px 10px', gap: 5 }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: isLoading ? 'spin 0.8s linear infinite' : 'none',
            transformOrigin: 'center',
          }}
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
        {isLoading ? 'Atualizando…' : 'Atualizar'}
      </button>
    </div>
  )
}

export function HeaderStats({ tasks, lastUpdated, isLoading, onRefresh }: Props) {
  const total       = tasks.length
  const afazer      = tasks.filter(t => t.status === 'A Fazer').length
  const andamento   = tasks.filter(t => t.status === 'Em Andamento').length
  const concluidas  = tasks.filter(t => t.status === 'Concluído' || t.status === 'Realizada').length
  const atrasadas   = tasks.filter(t => t.deadlineStatus?.type === 'overdue').length

  const greeting = getGreeting()
  const emoji = getGreetingEmoji()

  const stats: StatPillProps[] = [
    { value: total,      label: 'Total',        color: 'var(--text-secondary)', bg: '', index: 0 },
    { value: afazer,     label: 'A Fazer',       color: 'var(--status-afazer)',   bg: '', index: 1 },
    { value: andamento,  label: 'Em Andamento',  color: 'var(--status-andamento)', bg: '', index: 2 },
    { value: concluidas, label: 'Concluídas',    color: 'var(--status-concluido)', bg: '', index: 3 },
    { value: atrasadas,  label: 'Atrasadas',     color: 'var(--status-atrasado)',  bg: '', index: 4 },
  ]

  return (
    <header style={{ padding: '20px 24px 0', marginBottom: 20 }}>
      {/* Top row: greeting + refresh */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div className="animate-fade-up">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 3,
            }}
          >
            <span style={{ fontSize: 20 }}>{emoji}</span>
            <h1
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              {greeting}, Saulo
            </h1>
          </div>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            TASKS · ROTTENYSCALELAB
          </p>
        </div>

        <RefreshIndicator
          isLoading={isLoading}
          lastUpdated={lastUpdated}
          onRefresh={onRefresh}
        />
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {stats.map((s, i) => (
          <StatPill key={s.label} {...s} index={i} />
        ))}
      </div>
    </header>
  )
}
