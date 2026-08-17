"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"
import { TodayTab } from "@/components/today-tab"
import { HistoryTab } from "@/components/history-tab"
import {
  loadEntries,
  saveEntries,
  upsertEntry,
  toDateKey,
  type DayEntry,
  type EntryMap,
} from "@/lib/grind-storage"

type Tab = "today" | "history"

export function GrindTracker() {
  const [entries, setEntries] = useState<EntryMap>({})
  const [tab, setTab] = useState<Tab>("today")
  const [ready, setReady] = useState(false)
  const todayKey = toDateKey()

  useEffect(() => {
    setEntries(loadEntries())
    setReady(true)
  }, [])

  function handleSave(entry: DayEntry) {
    setEntries((prev) => {
      const next = upsertEntry(prev, entry)
      saveEntries(next)
      return next
    })
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Flame className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground">Daily Grind Tracker</h1>
          <p className="text-sm text-muted-foreground">GATE · Gym · LeetCode · Aptitude</p>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Tracker views"
        className="mb-6 inline-flex rounded-lg border border-border bg-secondary/40 p-1"
      >
        <TabButton active={tab === "today"} onClick={() => setTab("today")} controls="today-panel">
          Today
        </TabButton>
        <TabButton active={tab === "history"} onClick={() => setTab("history")} controls="history-panel">
          History
        </TabButton>
      </div>

      {ready && tab === "today" && (
        <section id="today-panel" role="tabpanel">
          <TodayTab key={todayKey} todayKey={todayKey} initial={entries[todayKey]} onSave={handleSave} />
        </section>
      )}

      {ready && tab === "history" && (
        <section id="history-panel" role="tabpanel">
          <HistoryTab entries={entries} />
        </section>
      )}
    </main>
  )
}

function TabButton({
  active,
  onClick,
  controls,
  children,
}: {
  active: boolean
  onClick: () => void
  controls: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}
