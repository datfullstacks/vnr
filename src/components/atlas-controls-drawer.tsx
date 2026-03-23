'use client'

import { useEffect, useState, type ReactNode } from 'react'

export function AtlasControlsDrawer({
  children,
  summary,
  title,
}: {
  children: ReactNode
  summary: string
  title: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.documentElement.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className={open ? 'atlas-controls-shell is-open' : 'atlas-controls-shell'}>
      <button
        aria-controls="atlas-controls-panel"
        aria-expanded={open}
        className="atlas-controls-toggle"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="atlas-controls-toggle-label">Bộ điều khiển atlas</span>
        <strong>{title}</strong>
        <small>{summary}</small>
      </button>

      <button
        aria-hidden={!open}
        className="atlas-controls-backdrop"
        onClick={() => setOpen(false)}
        tabIndex={open ? 0 : -1}
        type="button"
      />

      <div className="atlas-controls-panel" id="atlas-controls-panel">
        <div className="atlas-controls-mobile-header">
          <div>
            <p className="eyebrow">Điều khiển atlas</p>
            <h2>{title}</h2>
            <p className="timeline-copy">{summary}</p>
          </div>
          <button className="ghost-button" onClick={() => setOpen(false)} type="button">
            Đóng
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
