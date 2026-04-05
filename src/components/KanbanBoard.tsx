
import { KanbanColumn } from './KanbanColumn'
import { AlertsPanel } from './AlertsPanel'
import { KANBAN_COLUMNS, type Task } from '@/types'

interface Props {
  tasks: Task[]
}

export function KanbanBoard({ tasks }: Props) {
  const overdueTasks = tasks.filter(t => t.deadlineStatus?.type === 'overdue')

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '16px 24px 32px',
        alignItems: 'flex-start',
        minHeight: 0,
      }}
    >
      {/* Kanban columns grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 12,
          minWidth: 0,
        }}
      >
        {KANBAN_COLUMNS.map((col, i) => {
          const colTasks = tasks.filter(t => {
            if (col.key === 'Concluído') {
              return t.status === 'Concluído' || t.status === 'Realizada'
            }
            return t.status === col.key
          })

          return (
            <KanbanColumn
              key={col.key}
              label={col.label}
              colorVar={col.colorVar}
              tasks={colTasks}
              columnIndex={i}
            />
          )
        })}
      </div>

      {/* Alerts panel */}
      {overdueTasks.length > 0 && (
        <div style={{ width: 280, flexShrink: 0 }}>
          <AlertsPanel tasks={overdueTasks} />
        </div>
      )}
    </div>
  )
}
