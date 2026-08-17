"use client"

import { useState } from "react"
import { Dumbbell, BookOpenCheck, Code2, Brain, Check, CircleCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DayEntry, Difficulty } from "@/lib/grind-storage"

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"]

function HabitToggle({
  checked,
  onChange,
  icon,
  label,
  hint,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  icon: React.ReactNode
  label: string
  hint: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
        checked
          ? "border-primary/60 bg-primary/10"
          : "border-border bg-secondary/40 hover:bg-secondary/70"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
          checked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-medium text-foreground">{label}</span>
        <span className="block text-sm text-muted-foreground">{hint}</span>
      </span>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md border ${
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
        }`}
      >
        {checked && <Check className="h-4 w-4" strokeWidth={3} />}
      </span>
    </button>
  )
}

export function TodayTab({
  todayKey,
  initial,
  onSave,
}: {
  todayKey: string
  initial?: DayEntry
  onSave: (entry: DayEntry) => void
}) {
  const [gateDpp, setGateDpp] = useState(initial?.gateDpp ?? false)
  const [gym, setGym] = useState(initial?.gym ?? false)
  const [leetcode, setLeetcode] = useState(initial?.leetcode ?? "")
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? "Easy")
  const [aptitude, setAptitude] = useState<string>(initial ? String(initial.aptitude) : "0")
  const [saved, setSaved] = useState(false)

  function handleSave() {
    const parsed = Math.max(0, Math.floor(Number(aptitude) || 0))
    onSave({
      date: todayKey,
      gateDpp,
      gym,
      leetcode: leetcode.trim(),
      difficulty,
      aptitude: parsed,
    })
    setAptitude(String(parsed))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  const prettyDate = new Date(`${todayKey}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Logging for</p>
        <h2 className="text-balance text-xl font-semibold text-foreground">{prettyDate}</h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <HabitToggle
            checked={gateDpp}
            onChange={setGateDpp}
            icon={<BookOpenCheck className="h-5 w-5" />}
            label="GATE DPP done"
            hint="Daily practice problems"
          />
          <HabitToggle
            checked={gym}
            onChange={setGym}
            icon={<Dumbbell className="h-5 w-5" />}
            label="Gym done"
            hint="Show up, get it in"
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="leetcode" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              LeetCode problem
            </label>
            <input
              id="leetcode"
              type="text"
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
              placeholder="e.g. Two Sum"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="mb-2 block text-sm font-medium text-foreground">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="aptitude" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Brain className="h-4 w-4 text-muted-foreground" />
              Aptitude questions solved
            </label>
            <input
              id="aptitude"
              type="number"
              min={0}
              inputMode="numeric"
              value={aptitude}
              onChange={(e) => setAptitude(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={handleSave} className="gap-2">
            {saved ? <CircleCheck className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {saved ? "Saved!" : "Save Today"}
          </Button>
          <span className="text-sm text-muted-foreground">Stored locally in your browser</span>
        </div>
      </div>
    </div>
  )
}
