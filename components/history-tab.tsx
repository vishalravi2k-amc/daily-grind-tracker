"use client"

import { CalendarDays, Flame } from "lucide-react"
import { ContributionGrid } from "@/components/contribution-grid"
import { completionLevel, toDateKey, type EntryMap, type Difficulty } from "@/lib/grind-storage"

const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  Easy: "bg-grind-both/15 text-grind-both",
  Medium: "bg-grind-one/15 text-grind-one",
  Hard: "bg-destructive/15 text-destructive",
}

function last7Days(): Date[] {
  const days: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d)
  }
  return days
}

function currentStreak(entries: EntryMap): number {
  let streak = 0
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  // allow today to be unlogged without breaking the streak
  const todayLevel = completionLevel(entries[toDateKey(d)])
  if (todayLevel === "empty" || todayLevel === "none") {
    d.setDate(d.getDate() - 1)
  }
  while (true) {
    const level = completionLevel(entries[toDateKey(d)])
    if (level === "both" || level === "one") {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function HistoryTab({ entries }: { entries: EntryMap }) {
  const days = last7Days()
  const streak = currentStreak(entries)
  const totalLogged = Object.values(entries).filter((e) => completionLevel(e) !== "empty").length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Flame className="h-5 w-5" />
          </span>
          <div>
            <p className="text-2xl font-semibold text-foreground">{streak}</p>
            <p className="text-sm text-muted-foreground">Day streak</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <p className="text-2xl font-semibold text-foreground">{totalLogged}</p>
            <p className="text-sm text-muted-foreground">Days logged</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Contribution grid</h2>
        <ContributionGrid entries={entries} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Last 7 days</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">GATE</th>
                <th className="px-3 py-2 font-medium">Gym</th>
                <th className="px-3 py-2 font-medium">LeetCode</th>
                <th className="px-3 py-2 font-medium">Diff.</th>
                <th className="px-3 py-2 text-right font-medium">Aptitude</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => {
                const key = toDateKey(d)
                const entry = entries[key]
                const label = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
                return (
                  <tr key={key} className="border-b border-border/60 last:border-0">
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">{label}</td>
                    <td className="px-3 py-3">
                      <StatusDot done={!!entry?.gateDpp} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusDot done={!!entry?.gym} />
                    </td>
                    <td className="max-w-[180px] truncate px-3 py-3 text-muted-foreground">
                      {entry?.leetcode ? entry.leetcode : <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      {entry?.leetcode ? (
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_CLASS[entry.difficulty]}`}
                        >
                          {entry.difficulty}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-foreground">{entry?.aptitude ?? 0}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusDot({ done }: { done: boolean }) {
  return (
    <span
      aria-label={done ? "done" : "not done"}
      className={`inline-block h-2.5 w-2.5 rounded-full ${done ? "bg-grind-both" : "bg-grind-none"}`}
    />
  )
}
