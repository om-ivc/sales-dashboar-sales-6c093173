export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function formatShortDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function calculatePercentageChange(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }
  return Math.round(((current - previous) / previous) * 100)
}

export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) return `${interval} years ago`
  if (interval === 1) return '1 year ago'

  interval = Math.floor(seconds / 2592000)
  if (interval > 1) return `${interval} months ago`
  if (interval === 1) return '1 month ago'

  interval = Math.floor(seconds / 86400)
  if (interval > 1) return `${interval} days ago`
  if (interval === 1) return '1 day ago'

  interval = Math.floor(seconds / 3600)
  if (interval > 1) return `${interval} hours ago`
  if (interval === 1) return '1 hour ago'

  interval = Math.floor(seconds / 60)
  if (interval > 1) return `${interval} minutes ago`
  if (interval === 1) return '1 minute ago'

  return 'Just now'
}

export function getInitials(name) {
  if (!name) return ''
  const names = name.split(' ')
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

export function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'pending':
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}