export interface IUrl {
  url: string
}

export interface ICountdown {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
  totalDays: number,
  totalHours: number,
  totalMinutes: number,
  totalSeconds: number,
  totalMilliseconds: number
}

export type HasAttributeWhenTrue<A extends boolean, B> = A extends true ? B : undefined
