export type Difficulty = "Easy" | "Medium" | "Hard"

export type DayEntry = {
  date: string // YYYY-MM-DD (local)
  gateDpp: boolean
  gym: boolean
  leetcode: string
  difficulty: Difficulty
  aptitude: number
}

export type EntryMap = Record<string, DayEntry>

const STORAGE_KEY = "daily-grind-tracker-v1"

/** Returns a local YYYY-MM-DD string for the given date (defaults to today). */
export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function loadEntries(): EntryMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as EntryMap
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

export function saveEntries(entries: EntryMap): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // ignore quota / serialization errors
  }
}

export function upsertEntry(entries: EntryMap, entry: DayEntry): EntryMap {
  return { ...entries, [entry.date]: entry }
}

export type CompletionLevel = "empty" | "none" | "one" | "both"

export function completionLevel(entry?: DayEntry): CompletionLevel {
  if (!entry) return "empty"
  const count = (entry.gateDpp ? 1 : 0) + (entry.gym ? 1 : 0)
  if (count === 2) return "both"
  if (count === 1) return "one"
  // an entry exists but nothing checked -> logged but no core habits done
  if (entry.leetcode.trim() || entry.aptitude > 0) return "none"
  return "none"
}
