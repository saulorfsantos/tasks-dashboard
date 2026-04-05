
import type { FilterState, Task } from '@/types'
import { PROJECT_COLORS } from '@/types'

interface Props {
  filters: FilterState
  tasks: Task[]
  onChange: (filters: FilterState) => void
}

function ColorDot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  )
}

export function FilterBar({ filters, tasks, onChange }: Props) {
  const projetos  = Array.from(new Set(tasks.map(t => t.projeto).filter(Boolean))).sort()
  const prioridades = Array.from(new Set(tasks.map(t => t.prioridade).filter(Boolean)))
  const prioOrder = ['Alta', 'Média', 'Baixa']
  prioridades.sort((a, b) => {
    const ia = prioOrder.indexOf(a)
    const ib = prioOrder.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })

  const hasFilters = filters.projeto !== '' || filters.prioridade !== ''

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 24px',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(8px)',
        flexWrap: 'wrap',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <span className="label" style={{ marginRight: 4 }}>Filtros</span>

      {/* Projeto filter */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {filters.projeto && PROJECT_COLORS[filters.projeto] && (
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <ColorDot color={PROJECT_COLORS[filters.projeto]} />
          </span>
        )}
        <select
          className="select"
          value={filters.projeto}
          onChange={e => onChange({ ...filters, projeto: e.target.value })}
          style={{ paddingLeft: filters.projeto && PROJECT_COLORS[filters.projeto] ? 24 : 12 }}
        >
          <option value="">Todos os projetos</option>
          {projetos.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Prioridade filter */}
      <select
        className="select"
        value={filters.prioridade}
        onChange={e => onChange({ ...filters, prioridade: e.target.value })}
      >
        <option value="">Todas as prioridades</option>
        {prioridades.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          className="btn btn-ghost"
          onClick={() => onChange({ projeto: '', prioridade: '' })}
          style={{ marginLeft: 4, color: 'var(--text-muted)', fontSize: 11 }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Limpar
        </button>
      )}

      {/* Active filter chips */}
      {filters.projeto && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 8px 3px 6px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-hover)',
            borderRadius: 100,
            fontSize: 11,
            color: 'var(--text-secondary)',
          }}
        >
          {PROJECT_COLORS[filters.projeto] && (
            <ColorDot color={PROJECT_COLORS[filters.projeto]} />
          )}
          {filters.projeto}
        </div>
      )}
      {filters.prioridade && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-hover)',
            borderRadius: 100,
            fontSize: 11,
            color: 'var(--text-secondary)',
          }}
        >
          {filters.prioridade}
        </div>
      )}
    </div>
  )
}
