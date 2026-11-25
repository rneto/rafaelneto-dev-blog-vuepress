// Post dates for readers: "21 nov 2026" on Spanish pages, "Nov 21, 2026" on English ones.
// Frontmatter dates look like "2025-4-12" or "2025-04-12T00:00:00.000Z"; not every browser parses
// the first one, so the parts are read by hand.
const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const dateParts = date => String(date).split(/\D+/).slice(0, 3).map(Number)

// Valid value for <time datetime="...">: YYYY-MM-DD
export function isoDate (date) {
  const [year, month, day] = dateParts(date)
  return [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('-')
}

export function formatDate (date, english) {
  const [year, month, day] = dateParts(date)
  if (!year || !month || !day) return String(date || '')
  return english
    ? `${MONTHS_EN[month - 1]} ${day}, ${year}`
    : `${day} ${MONTHS_ES[month - 1]} ${year}`
}
