'use client'

import { TaskCard } from './TaskCard'
import type { Task } from '@/types'

interface Props {
  label: string
  colorVar: string
  tasks: Task[]
  columnIndex: number
}

export function KanbanColumn({ label, colorVar, tasks, columnIndex }: Props) {
  return (
    <div
      className="kanban-col animate-fade-up"
      style={{ animationDelay: `${columnIndex * 0.06}s` }}
    >
      {/* Column header */}
      <div className="kanban-col-header">
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: colorVar,
            flexShrink: 0,
            boxShadow: `0 0 6px ${colorVar}60`,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            flex: 1,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            fontWeight: 600,
            color: tasks.length > 0 ? colorVar : 'var(--text-muted)',
            background: tasks.length > 0 ? `${colorVar}18` : 'transparent',
            padding: '1px 7px',
            borderRadius: 4,
            minWidth: 24,
            textAlign: 'center',
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="kanban-col-body">
        {tasks.length === 0 ? (
          <div
            style={{
              padding: '24px 12px',
              textAlign: 'center',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              fontSize: 12,
            }}
          >
            Nenhuma tarefa
          </div>
        ) : (
          tasks.map((task, i) => (
            <TaskCard key={`${task.id}-${task.tarefa}`} task={task} animIndex={i} />
          ))
        )}
      </div>
    </div>
  )
}
