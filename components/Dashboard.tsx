'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { HeaderStats } from './HeaderStats'
import { FilterBar } from './FilterBar'
import { KanbanBoard } from './KanbanBoard'
import type { FilterState, Task } from '@/types'

const REFRESH_INTERVAL = 60_000 // 60 seconds

function LoadingSkeleton() {
  return (
    <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header skeleton */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {[80, 64, 64, 64, 64].map((w, i) => (
          <div key={i} className="skeleton" style={{ width: w, height: 36 }} />
        ))}
      </div>
      {/* Kanban skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {Array.from({ length: 4 }).map((_, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="skeleton" style={{ height: 36 }} />
            {Array.from({ length: 3 + ci }).map((_, ri) => (
              <div key={ri} className="skeleton" style={{ height: 80 + ri * 12 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EF4444',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
          Erro ao carregar tarefas
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 340, lineHeight: 1.5 }}>
          {error}
        </p>
      </div>
      <button className="btn btn-ghost" onClick={onRetry} style={{ marginTop: 4 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
        Tentar novamente
      </button>
    </div>
  )
}

function applyFilters(tasks: Task[], filters: FilterState): Task[] {
  return tasks.filter(task => {
    if (filters.projeto && task.projeto !== filters.projeto) return false
    if (filters.prioridade && task.prioridade !== filters.prioridade) return false
    return true
  })
}

export function Dashboard() {
  const [tasks, setTasks]               = useState<Task[]>([])
  const [isLoading, setIsLoading]       = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [lastUpdated, setLastUpdated]   = useState<Date | null>(null)
  const [filters, setFilters]           = useState<FilterState>({ projeto: '', prioridade: '' })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true)
    }

    try {
      const res = await fetch('/api/tasks', { cache: 'no-store' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }
      const data: Task[] = await res.json()
      setTasks(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(msg)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => fetchData(), REFRESH_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchData])

  const filteredTasks = applyFilters(tasks, filters)

  if (isLoading) return <LoadingSkeleton />
  if (error && tasks.length === 0) return <ErrorState error={error} onRetry={() => fetchData(true)} />

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <HeaderStats
        tasks={filteredTasks}
        lastUpdated={lastUpdated}
        isLoading={isRefreshing}
        onRefresh={() => fetchData(true)}
      />

      <FilterBar
        filters={filters}
        tasks={tasks}
        onChange={setFilters}
      />

      <KanbanBoard tasks={filteredTasks} />
    </div>
  )
}
