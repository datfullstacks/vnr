'use client'

import { useEffect, useState } from 'react'

import type {
  PartyGameLeaderboardEntry,
  PartyGameLeaderboardPayload,
  PartyGamePayload,
  PartyGameSubmitResponse,
} from '@/lib/game-types'

function hashSeed(value: string) {
  let hash = 2166136261

  for (const char of value) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function createSeededRandom(seed: string) {
  let state = hashSeed(seed) || 1

  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function rotateRunQuestions(questions: PartyGamePayload['questions'], seed: string) {
  const random = createSeededRandom(seed)
  const next = [...questions].map((question) => {
    const options = question.options.map((option, index) => ({
      index,
      option,
    }))

    for (let optionIndex = options.length - 1; optionIndex > 0; optionIndex -= 1) {
      const swapIndex = Math.floor(random() * (optionIndex + 1))
      ;[options[optionIndex], options[swapIndex]] = [options[swapIndex], options[optionIndex]]
    }

    return {
      ...question,
      correctIndex: options.findIndex((item) => item.index === question.correctIndex),
      options: options.map((item) => item.option),
    }
  })

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }

  return next
}

function buildRunSeed(username: string) {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`

  return `${username}:${randomPart}`
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(1, Math.round(durationMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
}

export function PartyHistoryGame({ game }: { game: PartyGamePayload }) {
  const usernameStorageKey = `party-game:${game.gameId}:username`
  const questionTimeLimitMs = game.timePerQuestionSeconds * 1000
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [streamStatus, setStreamStatus] = useState<'connecting' | 'live' | 'offline'>('connecting')
  const [leaderboard, setLeaderboard] = useState<PartyGameLeaderboardEntry[]>(game.leaderboard)
  const [onlineCount, setOnlineCount] = useState(game.onlineCount)
  const [updatedAt, setUpdatedAt] = useState(game.updatedAt)
  const [runQuestions, setRunQuestions] = useState(game.questions)
  const [answers, setAnswers] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [questionStartedAt, setQuestionStartedAt] = useState<number | null>(null)
  const [finishedDurationMs, setFinishedDurationMs] = useState<number | null>(null)
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [playerRank, setPlayerRank] = useState<PartyGameLeaderboardEntry | null>(null)
  const [timedOutQuestions, setTimedOutQuestions] = useState<Record<number, true>>({})
  const [timerNow, setTimerNow] = useState(() => Date.now())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const savedUsername = window.localStorage.getItem(usernameStorageKey)

    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [usernameStorageKey])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (username.trim()) {
      window.localStorage.setItem(usernameStorageKey, username.trim())
    }
  }, [username, usernameStorageKey])

  useEffect(() => {
    setRunQuestions(rotateRunQuestions(game.questions, buildRunSeed('preview')))
  }, [game.questions])

  useEffect(() => {
    const source = new EventSource('/api/party-game/stream')

    const handleLeaderboard = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as PartyGameLeaderboardPayload
      setLeaderboard(payload.leaderboard)
      setOnlineCount(payload.onlineCount)
      setUpdatedAt(payload.updatedAt)
      setStreamStatus('live')
      setPlayerRank((current) => {
        if (!current) {
          return null
        }

        return payload.leaderboard.find((entry) => entry.username === current.username) ?? current
      })
    }

    source.addEventListener('leaderboard', handleLeaderboard as EventListener)
    source.onopen = () => {
      setStreamStatus('live')
    }
    source.onerror = () => {
      setStreamStatus('offline')
    }

    return () => {
      source.close()
    }
  }, [])

  useEffect(() => {
    if (streamStatus === 'live') {
      return
    }

    const timer = window.setInterval(async () => {
      try {
        const response = await fetch('/api/party-game', { cache: 'no-store' })

        if (!response.ok) {
          return
        }

        const payload = (await response.json()) as PartyGamePayload
        setLeaderboard(payload.leaderboard)
        setOnlineCount(payload.onlineCount)
        setUpdatedAt(payload.updatedAt)
      } catch {
        // Keep the last known leaderboard snapshot until the stream reconnects.
      }
    }, 8_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [streamStatus])

  const currentQuestion = status === 'idle' ? null : runQuestions[currentIndex] ?? null
  const score = answers.reduce((total, answer, index) => {
    const question = runQuestions[index]
    return question && answer === question.correctIndex ? total + 1 : total
  }, 0)
  const canStart = username.trim().length >= 2 && game.questionCount > 0
  const answeredCurrent = currentQuestion ? answers[currentIndex] !== undefined : false
  const timedOutCurrent = Boolean(timedOutQuestions[currentIndex])
  const lockedCurrent = answeredCurrent || timedOutCurrent
  const remainingMs =
    status === 'playing' && currentQuestion && questionStartedAt
      ? Math.max(0, questionStartedAt + questionTimeLimitMs - timerNow)
      : questionTimeLimitMs
  const remainingSeconds = Math.ceil(remainingMs / 1000)
  const progressPercent =
    game.questionCount > 0
      ? ((Math.min(currentIndex + (status === 'finished' ? 1 : 0), game.questionCount) || 0) / game.questionCount) *
        100
      : 0

  useEffect(() => {
    if (status !== 'playing' || !currentQuestion || lockedCurrent) {
      return
    }

    setTimerNow(Date.now())
    const timer = window.setInterval(() => {
      setTimerNow(Date.now())
    }, 250)

    return () => {
      window.clearInterval(timer)
    }
  }, [currentQuestion, lockedCurrent, status])

  useEffect(() => {
    if (status !== 'playing' || !currentQuestion || lockedCurrent || remainingMs > 0) {
      return
    }

    setTimedOutQuestions((current) => {
      if (current[currentIndex]) {
        return current
      }

      return {
        ...current,
        [currentIndex]: true,
      }
    })
  }, [currentIndex, currentQuestion, lockedCurrent, remainingMs, status])

  async function submitRun(durationMs: number, finalScore: number) {
    setSubmitState('submitting')
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/party-game/submit', {
        body: JSON.stringify({
          durationMs,
          score: finalScore,
          username: username.trim(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const payload = (await response.json()) as PartyGameSubmitResponse | { error?: string }

      if (!response.ok) {
        throw new Error('error' in payload ? payload.error ?? 'Không gửi được điểm số.' : 'Không gửi được điểm số.')
      }

      const result = payload as PartyGameSubmitResponse
      setLeaderboard(result.leaderboard)
      setOnlineCount(result.onlineCount)
      setUpdatedAt(result.updatedAt)
      setPlayerRank(result.entry)
      setSubmitState('submitted')
      setSubmitMessage(
        result.accepted
          ? result.entry
            ? `Bạn đang đứng hạng ${result.entry.rank} với ${result.entry.score}/${result.entry.totalQuestions}.`
            : 'Điểm của bạn đã được ghi nhận.'
          : 'Bảng xếp hạng vẫn giữ thành tích tốt hơn trước đó của username này.',
      )
    } catch (error) {
      setSubmitState('error')
      setSubmitMessage(error instanceof Error ? error.message : 'Không gửi được điểm số.')
    }
  }

  function startRun() {
    if (!canStart) {
      return
    }

    const nextQuestions = rotateRunQuestions(game.questions, buildRunSeed(username.trim()))
    setRunQuestions(nextQuestions)
    setAnswers([])
    setCurrentIndex(0)
    setStartedAt(Date.now())
    setQuestionStartedAt(Date.now())
    setFinishedDurationMs(null)
    setPlayerRank(null)
    setSubmitMessage(null)
    setSubmitState('idle')
    setTimedOutQuestions({})
    setTimerNow(Date.now())
    setStatus('playing')
  }

  function chooseAnswer(optionIndex: number) {
    if (status !== 'playing' || !currentQuestion || lockedCurrent) {
      return
    }

    setAnswers((current) => {
      const next = [...current]
      next[currentIndex] = optionIndex
      return next
    })
  }

  function moveForward() {
    if (!lockedCurrent) {
      return
    }

    if (currentIndex < game.questionCount - 1) {
      setCurrentIndex((value) => value + 1)
      setQuestionStartedAt(Date.now())
      setTimerNow(Date.now())
      return
    }

    const durationMs = Math.max(1_000, Date.now() - (startedAt ?? Date.now()))
    const finalScore = answers.reduce((total, answer, index) => {
      const question = runQuestions[index]
      return question && answer === question.correctIndex ? total + 1 : total
    }, 0)

    setFinishedDurationMs(durationMs)
    setQuestionStartedAt(null)
    setStatus('finished')
    void submitRun(durationMs, finalScore)
  }

  return (
    <div className="page-stack">
      <section className="hero-panel game-hero">
        <div className="game-hero-copy">
          <p className="eyebrow">Game realtime</p>
          <h1>{game.title}</h1>
          <p>{game.summary}</p>
          <div className="game-status-row">
            <span className="game-pill">#{game.questionCount} checkpoint</span>
            <span className="game-pill">Mỗi câu {game.timePerQuestionSeconds}s</span>
            <span className={`game-pill ${streamStatus === 'live' ? 'is-live' : 'is-waiting'}`}>
              {streamStatus === 'live' ? 'Leaderboard live' : 'Leaderboard đồng bộ lại'}
            </span>
            <span className="game-pill">{onlineCount} người đang theo dõi</span>
          </div>
        </div>

        <div className="game-hero-stats">
          <strong>{score}</strong>
          <span>/ {game.questionCount} điểm hiện tại</span>
          <small>
            {finishedDurationMs
              ? `Thời gian: ${formatDuration(finishedDurationMs)}`
              : 'Trả lời càng nhanh rank càng cao khi đồng điểm.'}
          </small>
        </div>
      </section>

      <section className="game-layout">
        <div className="game-main-column">
          <article className="game-card game-setup-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Người chơi</p>
                <h2>Vào đường đua bằng username</h2>
                <p className="section-copy">
                  Username dùng để giữ thành tích tốt nhất của bạn trên bảng xếp hạng realtime.
                </p>
              </div>
            </div>

            <div className="game-setup-row">
              <label className="game-input-block">
                <span>Username</span>
                <input
                  maxLength={24}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="ví dụ: tranphu1930"
                  value={username}
                />
              </label>

              <button className="primary-button" disabled={!canStart} onClick={startRun} type="button">
                {status === 'playing' ? 'Chơi lại từ đầu' : 'Bắt đầu'}
              </button>
            </div>
          </article>

          <article className="game-card game-track-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Path game</p>
                <h2>Đường đua theo checkpoint lịch sử</h2>
                <p className="section-copy">
                  Mỗi câu là một mốc trên trục lịch sử Đảng. Khóa đáp án tại từng checkpoint rồi đi tiếp.
                </p>
              </div>
            </div>

            <div aria-hidden="true" className="game-track">
              <div className="game-track-progress" style={{ width: `${progressPercent}%` }} />
              {runQuestions.map((question, index) => {
                const state =
                  index < currentIndex || status === 'finished'
                    ? 'done'
                    : index === currentIndex && status === 'playing'
                      ? 'active'
                      : 'idle'

                return (
                  <div className={`game-track-node is-${state}`} key={question.id}>
                    <span>{index + 1}</span>
                  </div>
                )
              })}
            </div>
          </article>

          {status === 'idle' ? (
            <article className="game-card game-question-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Sẵn sàng vào game</p>
                  <h2>Bấm bắt đầu để nhận bộ đáp án đã được đảo ngẫu nhiên</h2>
                  <p className="section-copy">
                    Mỗi lượt chơi sẽ xáo trộn lại thứ tự câu hỏi và vị trí đáp án đúng, nên không còn cố định theo A, B,
                    C hoặc D.
                  </p>
                </div>
              </div>
            </article>
          ) : currentQuestion ? (
            <article className="game-card game-question-card">
              <div className="game-question-head">
                <div>
                  <p className="eyebrow">Checkpoint {currentIndex + 1}</p>
                  <h2>{currentQuestion.prompt}</h2>
                  <p className="section-copy">
                    {currentQuestion.periodTitle} · nguồn câu hỏi từ {currentQuestion.quizTitle}
                  </p>
                </div>
                <div className="game-question-meta">
                  <strong>{remainingSeconds}</strong>
                  <span>giây còn lại</span>
                  <small>
                    Câu {currentIndex + 1} / {game.questionCount}
                  </small>
                </div>
              </div>

              <div className="game-options">
                {currentQuestion.options.map((option, optionIndex) => {
                  const chosen = answers[currentIndex] === optionIndex

                  return (
                    <button
                      className={`game-option ${chosen ? 'is-active' : ''}`}
                      disabled={lockedCurrent}
                      key={`${currentQuestion.id}:${optionIndex}`}
                      onClick={() => chooseAnswer(optionIndex)}
                      type="button"
                    >
                      <span className="game-option-index">{String.fromCharCode(65 + optionIndex)}</span>
                      <span>{option.label}</span>
                    </button>
                  )
                })}
              </div>

              {lockedCurrent ? (
                <div className="game-answer-feedback">
                  <strong>
                    {timedOutCurrent
                      ? 'Hết thời gian cho checkpoint này.'
                      : answers[currentIndex] === currentQuestion.correctIndex
                        ? 'Đúng checkpoint.'
                        : 'Sai checkpoint.'}
                  </strong>
                  <p>{currentQuestion.explanation}</p>
                  <button className="primary-button" onClick={moveForward} type="button">
                    {currentIndex === game.questionCount - 1 ? 'Khóa điểm và lên rank' : 'Sang checkpoint tiếp theo'}
                  </button>
                </div>
              ) : (
                <p className="section-copy">
                  Chọn một đáp án để khóa checkpoint này trước khi hết {game.timePerQuestionSeconds} giây.
                </p>
              )}
            </article>
          ) : null}

          {status === 'finished' ? (
            <article className="game-card game-result-card">
              <p className="eyebrow">Kết quả</p>
              <h2>{username.trim()} đã hoàn thành đường đua</h2>
              <div className="game-result-grid">
                <div>
                  <strong>{score}</strong>
                  <span>điểm</span>
                </div>
                <div>
                  <strong>{finishedDurationMs ? formatDuration(finishedDurationMs) : '--:--'}</strong>
                  <span>thời gian</span>
                </div>
                <div>
                  <strong>{playerRank?.rank ?? '--'}</strong>
                  <span>hạng hiện tại</span>
                </div>
              </div>
              <p className="section-copy">
                {submitState === 'submitting'
                  ? 'Đang gửi điểm lên leaderboard realtime...'
                  : submitMessage ?? 'Bạn có thể chơi lại để cải thiện rank.'}
              </p>
            </article>
          ) : null}
        </div>

        <aside className="game-side-column">
          <article className="game-card game-leaderboard-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Realtime rank</p>
                <h2>Bảng xếp hạng lịch sử Đảng</h2>
                <p className="section-copy">
                  Xếp theo điểm giảm dần, đồng điểm thì ưu tiên thời gian hoàn thành nhanh hơn.
                </p>
              </div>
            </div>

            <div className="game-leaderboard-list">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry) => (
                  <div
                    className={`game-leaderboard-row ${playerRank?.username === entry.username ? 'is-player' : ''}`}
                    key={`${entry.username}:${entry.submittedAt}`}
                  >
                    <strong>#{entry.rank}</strong>
                    <div>
                      <span>{entry.username}</span>
                      <small>
                        {entry.score}/{entry.totalQuestions} · {formatDuration(entry.durationMs)} ·{' '}
                        {formatTimestamp(entry.submittedAt)}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="section-copy">Chưa có người chơi nào lên bảng xếp hạng. Bạn có thể mở rank đầu tiên.</p>
              )}
            </div>

            <div className="game-leaderboard-footer">
              <span>Cập nhật: {formatTimestamp(updatedAt)}</span>
              <span>{onlineCount} kết nối đang xem</span>
            </div>
          </article>
        </aside>
      </section>
    </div>
  )
}
