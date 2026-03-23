'use client'

import { useEffect, useState } from 'react'

import type { QuizRecord } from '@/lib/content-types'

export function QuizPlayer({ quiz }: { quiz: QuizRecord }) {
  const storageKey = `quiz:${quiz.slug}:answers`
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    if (typeof window === 'undefined') {
      return {}
    }

    const raw = window.localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as Record<number, number>) : {}
  })

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(answers))
  }, [answers, storageKey])

  const score = quiz.questions.reduce((total, question, index) => {
    const choice = answers[index]

    if (choice === undefined) {
      return total
    }

    return question.options[choice]?.isCorrect ? total + 1 : total
  }, 0)

  return (
    <section className="quiz-card">
      <div className="quiz-header">
        <div>
          <p className="eyebrow">Chế độ ôn tập</p>
          <h2>{quiz.title}</h2>
          <p className="section-copy">
            Trả lời theo từng câu để tự kiểm tra xem mình đã nắm được mốc thời gian, nhân vật và không
            gian lịch sử quan trọng đến đâu.
          </p>
        </div>
        <p>
          Điểm hiện tại: <strong>{score}</strong> / {quiz.questions.length}
        </p>
      </div>

      <div className="quiz-list">
        {quiz.questions.map((question, index) => (
          <article className="quiz-question" key={`${quiz.slug}-${index}`}>
            <h3>
              Câu {index + 1}. {question.prompt}
            </h3>
            <div className="quiz-options">
              {question.options.map((option, optionIndex) => {
                const checked = answers[index] === optionIndex

                return (
                  <label className={checked ? 'quiz-option active' : 'quiz-option'} key={option.label}>
                    <input
                      checked={checked}
                      name={`${quiz.slug}-${index}`}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [index]: optionIndex,
                        }))
                      }
                      type="radio"
                    />
                    <span>{option.label}</span>
                  </label>
                )
              })}
            </div>
            {answers[index] !== undefined ? <p>{question.explanation}</p> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
