
import { useRef } from 'react'
import { TaskCard } from './TaskCard'
import type { Task, TaskStatus } from '@/types'

interface Props {
  label: string
  colorVar: string
  tasks: Task[]
  columnIndex: number
  columnKey: TaskStatus
  draggingTaskId: string | null
  droppedTaskId: string | null
  isDropTarget: boolean
  onDragOver: (colKey: TaskStatus) => void
  onDragLeave: () => void
  onDrop: (colKey: TaskStatus) => void
  onDragStart: (e: React.DragEvent, task: Task) => void
  onDragEnd: () => void
}

export function KanbanColumn({
  label,
  colorVar,
  tasks,
  columnIndex,
  columnKey,
  draggingTaskId,
  droppedTaskId,
  isDropTarget,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
}: Props) {
  // Counter to handle dragLeave firing on child elements
  const dragCounter = useRef(0)

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current++
    onDragOver(columnKey)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDragLeave() {
    dragCounter.current--
    if (dragCounter.current === 0) onDragLeave()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current = 0
    onDrop(columnKey)
  }

  return (
    <div
      className={`kanban-col animate-fade-up ${isDropTarget ? 'kanban-col-drop-target' : ''}`}
      style={{ animationDelay: `${columnIndex * 0.06}s`, transition: 'background 0.15s, outline 0.15s' }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
            <TaskCard
              key={`${task.id}-${task.tarefa}`}
              task={task}
              animIndex={i}
              isDragging={draggingTaskId === task.id}
              isDropped={droppedTaskId === task.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  )
}
