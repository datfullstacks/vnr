export type PartyGameQuestion = {
  correctIndex: number
  explanation: string
  id: string
  options: { label: string }[]
  periodTitle: string
  prompt: string
  quizSlug: string
  quizTitle: string
}

export type PartyGameLeaderboardEntry = {
  durationMs: number
  rank: number
  score: number
  submittedAt: string
  totalQuestions: number
  username: string
}

export type PartyGameLeaderboardPayload = {
  leaderboard: PartyGameLeaderboardEntry[]
  onlineCount: number
  updatedAt: string
}

export type PartyGamePayload = PartyGameLeaderboardPayload & {
  gameId: string
  questionCount: number
  questions: PartyGameQuestion[]
  summary: string
  title: string
}

export type PartyGameSubmitResponse = PartyGameLeaderboardPayload & {
  accepted: boolean
  entry: PartyGameLeaderboardEntry | null
}
