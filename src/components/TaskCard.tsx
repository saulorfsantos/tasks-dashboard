
import { formatDeadline } from '@/lib/utils'
import { PROJECT_COLORS, PRIORITY_CONFIG, type Task } from '@/types'

interface Props {
  task: Task
  animIndex?: number
}

function PriorityBadge({ prioridade }: { prioridade: string }) {
  const config = PRIORITY_CONFIG[prioridade] ?? {
    color: 'var(--text-muted)',
    bg: 'rgba(107,114,128,0.1)',
    label: prioridade,
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 6px',
        borderRadius: 4,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}30`,
        textTransform: 'uppercase',
      }}
    >
      {config.label}
    </span>
  )
}

function DeadlineBadge({ task }: { task: Task }) {
  const ds = task.deadlineStatus

  if (!task.prazo) return null

  const formattedDate = formatDeadline(task.prazo)

  if (!ds) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          color: 'var(--text-muted)',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {formattedDate}
      </div>
    )
  }

  if (ds.type === 'overdue') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 11,
          color: 'var(--status-atrasado)',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600,
        }}
      >
        <span className="pulse-dot" style={{ position: 'relative', display: 'inline-block' }}>
          <span
            style={{
              display: 'block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--status-atrasado)',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </span>
        {ds.label}
      </div>
    )
  }

  if (ds.type === 'today') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          color: 'var(--status-hoje)',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Vence hoje · {formattedDate}
      </div>
    )
  }

  // tomorrow
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: 'var(--status-amanha)',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      Vence amanhã · {formattedDate}
    </div>
  )
}

export function TaskCard({ task, animIndex = 0 }: Props) {
  const projectColor = PROJECT_COLORS[task.projeto] ?? '#475569'
  const isOverdue = task.deadlineStatus?.type === 'overdue'

  return (
    <div
      className={`card animate-fade-up stagger-${(animIndex % 8) + 1} ${isOverdue ? 'card-overdue' : ''}`}
      style={{
        padding: '12px 12px 12px 0',
        display: 'flex',
        gap: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Project color bar */}
      <div
        style={{
          width: 3,
          minHeight: '100%',
          background: projectColor,
          borderRadius: '2px 0 0 2px',
          flexShrink: 0,
          margin: '-12px 11px -12px 0',
          alignSelf: 'stretch',
          opacity: 0.9,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top row: ID + project chip + priority */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 6,
            flexWrap: 'wrap',
          }}
        >
          {task.id && (
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                fontWeight: 500,
              }}
            >
              #{task.id}
            </span>
          )}

          {task.projeto && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '1px 6px',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 600,
                color: projectColor,
                background: `${projectColor}18`,
                border: `1px solid ${projectColor}30`,
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {task.projeto}
            </span>
          )}

          <div style={{ marginLeft: 'auto' }}>
            <PriorityBadge prioridade={task.prioridade} />
          </div>
        </div>

        {/* Task name */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.45,
            marginBottom: 8,
            letterSpacing: '-0.01em',
          }}
        >
          {task.tarefa}
        </p>

        {/* Deadline */}
        <DeadlineBadge task={task} />
      </div>
    </div>
  )
}
