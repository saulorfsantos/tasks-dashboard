
import { useState } from 'react'
import { KanbanColumn } from './KanbanColumn'
import { AlertsPanel } from './AlertsPanel'
import { KANBAN_COLUMNS, type Task, type TaskStatus } from '@/types'

// Maps kanban column key → status string sent to the webhook
const COLUMN_TO_STATUS: Record<TaskStatus, string> = {
  'A Fazer':      'A fazer',
  'Em Andamento': 'Em Andamento',
  'Pausado':      'Pausado',
  'Concluído':    'Concluído',
  'Realizada':    'Concluído',
}

interface Props {
  tasks: Task[]
  onTaskMove: (taskId: string, newStatus: string) => void
}

export function KanbanBoard({ tasks, onTaskMove }: Props) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)
  const [droppedTaskId, setDroppedTaskId]   = useState<string | null>(null)

  const overdueTasks = tasks.filter(t => t.deadlineStatus?.type === 'overdue')

  function handleDragStart(e: React.DragEvent, task: Task) {
    setDraggingTaskId(task.id)
    setDroppedTaskId(null)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.setData('currentStatus', task.status)
  }

  function handleDragEnd() {
    setDraggingTaskId(null)
    setDragOverColumn(null)
  }

  function handleDragOver(colKey: TaskStatus) {
    setDragOverColumn(colKey)
  }

  function handleDragLeave() {
    setDragOverColumn(null)
  }

  function handleDrop(colKey: TaskStatus) {
    if (!draggingTaskId) return

    const task = tasks.find(t => t.id === draggingTaskId)
    if (!task) return

    const newStatus = COLUMN_TO_STATUS[colKey]
    const isSameColumn = task.status === colKey ||
      (colKey === 'Concluído' && (task.status === 'Concluído' || task.status === 'Realizada'))

    setDraggingTaskId(null)
    setDragOverColumn(null)

    if (!isSameColumn) {
      setDroppedTaskId(draggingTaskId)
      setTimeout(() => setDroppedTaskId(null), 400)
      onTaskMove(draggingTaskId, newStatus)
    }
  }

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
              columnKey={col.key}
              draggingTaskId={draggingTaskId}
              droppedTaskId={droppedTaskId}
              isDropTarget={dragOverColumn === col.key && draggingTaskId !== null}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
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
