import { notFound } from 'next/navigation'

import { SourceList } from '@/components/content-blocks'
import { PublicDataErrorState } from '@/components/public-data-error-state'
import { QuizPlayer } from '@/components/quiz-player'
import { SiteShell } from '@/components/site-shell'
import { getQuiz } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let quiz: Awaited<ReturnType<typeof getQuiz>>

  try {
    quiz = await getQuiz(slug)
  } catch (error) {
    return (
      <SiteShell>
        <PublicDataErrorState
          context="Trang ôn tập cần dữ liệu câu hỏi và nguồn từ vnr-be để dựng nội dung học tập."
          error={error}
          title="Không thể tải bộ câu hỏi này"
        />
      </SiteShell>
    )
  }

  if (!quiz) {
    notFound()
  }

  return (
    <SiteShell>
      <div className="page-stack">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Ôn tập</p>
            <h1>{quiz.title}</h1>
            <p>{quiz.summary}</p>
          </div>
          <div className="hero-stats">
            <strong>{quiz.questions.length}</strong>
            <span>câu hỏi để ôn lại mốc thời gian, nhân vật và không gian lịch sử</span>
          </div>
        </section>

        <QuizPlayer quiz={quiz} />
        <SourceList
          description="Phần ôn tập được dựng từ cùng hệ nguồn với atlas để người học kiểm tra lại kiến thức theo trục thời gian và bản đồ."
          sources={quiz.sources}
        />
      </div>
    </SiteShell>
  )
}
