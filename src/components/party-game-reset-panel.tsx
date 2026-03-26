'use client'

import { useState } from 'react'

type ResetPayload = {
  leaderboard: Array<unknown>
  onlineCount: number
  updatedAt: string
}

export function PartyGameResetPanel() {
  const [confirmation, setConfirmation] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function resetLeaderboard() {
    if (confirmation.trim().toUpperCase() !== 'RESET') {
      setStatus('error')
      setMessage('Gõ đúng RESET để xác nhận xóa bảng điểm.')
      return
    }

    setStatus('submitting')
    setMessage(null)

    try {
      const response = await fetch('/api/party-game/reset', {
        method: 'POST',
      })
      const payload = (await response.json()) as ResetPayload | { error?: string }

      if (!response.ok) {
        throw new Error('error' in payload ? payload.error ?? 'Không reset được bảng điểm.' : 'Không reset được bảng điểm.')
      }

      const result = payload as ResetPayload
      setStatus('done')
      setMessage(`Đã xóa leaderboard. Còn ${result.leaderboard.length} bản ghi, cập nhật lúc ${new Date(result.updatedAt).toLocaleString('vi-VN')}.`)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Không reset được bảng điểm.')
    }
  }

  return (
    <section className="game-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Route ẩn</p>
          <h1>Reset leaderboard game lịch sử Đảng</h1>
          <p className="section-copy">
            Route này không nằm trong nav. Gõ <strong>RESET</strong> rồi xác nhận để xóa toàn bộ điểm hiện có.
          </p>
        </div>
      </div>

      <div className="game-setup-row">
        <label className="game-input-block">
          <span>Xác nhận</span>
          <input
            maxLength={12}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="Gõ RESET"
            value={confirmation}
          />
        </label>

        <button className="primary-button" disabled={status === 'submitting'} onClick={resetLeaderboard} type="button">
          {status === 'submitting' ? 'Đang reset...' : 'Reset điểm'}
        </button>
      </div>

      {message ? <p className="section-copy">{message}</p> : null}
    </section>
  )
}
