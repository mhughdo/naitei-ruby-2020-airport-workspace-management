import format from 'date-fns/format'

const formatDate = (timestamp: number): string => {
  try {
    if (!timestamp) return null
    return format(new Date(Number(timestamp)), 'dd/MM/yyyy')
  } catch (error) {
    return null
  }
}

export {formatDate}
