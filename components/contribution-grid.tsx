"use client"

import { completionLevel, toDateKey, type EntryMap, type CompletionLevel } from "@/lib/grind-storage"

const WEEKS = 26
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const LEVEL_CLASS: Record<CompletionLevel, string> = {
  empty: "bg-grind-empty",
  none: "bg-grind-none",
  one: "bg-grind-one",
  both: "bg-grind-both",
}

const LEVEL_LABEL: Record<CompletionLevel, string> = {
  empty: "No log",
  none: "Nothing done",
  one: "One habit done",
  both: "Both habits done",
}

type Cell = {
  key: string
  date: Date
  isFuture: boolean
  level: CompletionLevel
}

function buildWeeks(entries: EntryMap): Cell[][] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dow = today.getDay() // 0 Sun .. 6 Sat

  const start = new Date(today)
  start.setDate(today.getDate() - dow - (WEEKS - 1) * 7)

  const weeks: Cell[][] = []
  for (let w = 0; w < WEEKS; w++) {
    const col: Cell[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      const isFuture = date.getTime() > today.getTime()
      const key = toDateKey(date)
      col.push({
        key,
        date,
        isFuture,
        level: isFuture ? "empty" : completionLevel(entries[key]),
      })
    }
    weeks.push(col)
  }
  return weeks
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

export function ContributionGrid({ entries }: { entries: EntryMap }) {
  const weeks = buildWeeks(entries)

  // Month labels: mark the column index where a new month first appears (top row).
  const monthLabels: { index: number; label: string }[] = []
  let lastMonth = -1
  let lastLabelIndex = -3
  weeks.forEach((col, i) => {
    const firstDay = col[0].date
    const m = firstDay.getMonth()
    // new month, and far enough from the previous label to avoid overlap
    if (m !== lastMonth && i - lastLabelIndex >= 3) {
      monthLabels.push({ index: i, label: MONTHS[m] })
      lastLabelIndex = i
    }
    lastMonth = m
  })

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="inline-flex flex-col gap-2">
        {/* Month labels */}
        <div className="flex pl-8">
          <div className="relative h-4 flex-1" style={{ minWidth: WEEKS * 16 }}>
            {monthLabels.map((m) => (
              <span
                key={`${m.label}-${m.index}`}
                className="absolute text-[11px] text-muted-foreground"
                style={{ left: m.index * 16 }}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {/* Weekday labels */}
          <div className="flex w-6 flex-col gap-1">
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="flex h-3 items-center text-[10px] leading-none text-muted-foreground">
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {weeks.map((col, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {col.map((cell) => (
                  <div
                    key={cell.key}
                    title={
                      cell.isFuture
                        ? undefined
                        : `${formatDate(cell.date)} — ${LEVEL_LABEL[cell.level]}`
                    }
                    aria-hidden={cell.isFuture}
                    className={`h-3 w-3 rounded-[3px] ${
                      cell.isFuture ? "bg-transparent" : `${LEVEL_CLASS[cell.level]} ring-1 ring-inset ring-white/5`
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 pl-8 pt-1 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-grind-none ring-1 ring-inset ring-white/5" />
            None
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-grind-one ring-1 ring-inset ring-white/5" />
            One
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-grind-both ring-1 ring-inset ring-white/5" />
            Both
          </div>
        </div>
      </div>
    </div>
  )
}
