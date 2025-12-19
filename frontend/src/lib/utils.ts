export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const displayHours = hours
  const displayMinutes = minutes % 60
  const displaySeconds = seconds % 60

  return `${displayHours.toString().padStart(2, "0")}:${displayMinutes
    .toString()
    .padStart(2, "0")}:${displaySeconds.toString().padStart(2, "0")}`
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
