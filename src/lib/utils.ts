export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(typeof date === 'string' ? new Date(date) : date)
}

export function formatTime(date: string | Date) {
  return new Intl.DateTimeFormat('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(typeof date === 'string' ? new Date(date) : date)
}

export function applyTemplate(
  template: string,
  vars: Record<string, string>,
) {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  )
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
