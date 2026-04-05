
import { useState } from 'react'
import { buildClientMessage, formatDeadline } from '@/lib/utils'
import { PROJECT_COLORS, type Task } from '@/types'

interface Props {
  tasks: Task[]
}

interface AlertCardProps {
  task: Task
  index: number
}

function AlertCard({ task, index }: AlertCardProps) {
  const [copied, setCopied] = useState(false)
  const projectColor = PROJECT_COLORS[task.projeto] ?? '#475569'
  const daysLate = task.deadlineStatus?.type === 'overdue' ? task.deadlineStatus.daysLate : 0

  async function handleCopy() {
    const msg = buildClientMessage(task)
    try {
      await navigator.clipboard.writeText(msg)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement('textarea')
      el.value = msg
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className={`animate-fade-up ${copied ? 'copy-success' : ''}`}
      style={{
        animationDelay: `${index * 0.05 + 0.1}s`,
        padding: '10px 12px',
        background: 'var(--bg-elevated)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: `2px solid ${projectColor}`,
        transition: 'border-color 0.3s ease, background 0.3s ease',
      }}
    >
      {/* Top: project + days late */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        {task.projeto && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: projectColor,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {task.projeto}
          </span>
        )}
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--status-atrasado)',
            background: 'rgba(239,68,68,0.1)',
            padding: '1px 6px',
            borderRadius: 4,
          }}
        >
          +{daysLate}d
        </span>
      </div>

      {/* Task name */}
      <p
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          marginBottom: 4,
          letterSpacing: '-0.01em',
        }}
      >
        {task.tarefa}
      </p>

      {/* Original deadline */}
      {task.prazo && (
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            color: 'var(--text-muted)',
            marginBottom: 8,
          }}
        >
          Prazo: {formatDeadline(task.prazo)}
        </p>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="btn"
        style={{
          width: '100%',
          justifyContent: 'center',
          fontSize: 11,
          padding: '6px 10px',
          background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
          color: copied ? '#10B981' : 'var(--text-secondary)',
          border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
          transition: 'all 0.2s ease',
        }}
      >
        {copied ? (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copiado!
          </>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copiar mensagem
          </>
        )}
      </button>
    </div>
  )
}

export function AlertsPanel({ tasks }: Props) {
  // Sort by most days late first
  const sorted = [...tasks].sort((a, b) => {
    const da = a.deadlineStatus?.type === 'overdue' ? a.deadlineStatus.daysLate : 0
    const db = b.deadlineStatus?.type === 'overdue' ? b.deadlineStatus.daysLate : 0
    return db - da
  })

  return (
    <div
      className="animate-fade-up stagger-4"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        position: 'sticky',
        top: 49, // below filter bar
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid rgba(239,68,68,0.2)',
          background: 'rgba(239,68,68,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span className="pulse-dot" style={{ position: 'relative', display: 'inline-block' }}>
          <span
            style={{
              display: 'block',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--status-atrasado)',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--status-atrasado)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Alertas
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--status-atrasado)',
            background: 'rgba(239,68,68,0.15)',
            padding: '1px 7px',
            borderRadius: 4,
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Description */}
      <div
        style={{
          padding: '8px 14px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Tarefas com prazo vencido. Clique em{' '}
          <span style={{ color: 'var(--text-secondary)' }}>copiar mensagem</span>{' '}
          para gerar update com nova previsão (+3 dias úteis).
        </p>
      </div>

      {/* Alert cards */}
      <div
        style={{
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxHeight: 'calc(100dvh - 200px)',
          overflowY: 'auto',
        }}
      >
        {sorted.map((task, i) => (
          <AlertCard key={`${task.id}-${task.tarefa}`} task={task} index={i} />
        ))}
      </div>
    </div>
  )
}
