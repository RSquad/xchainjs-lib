import moment from 'moment'
type TDate = Date | number

export function sliceString(string: string, startEnd = 4) {
  if (!string) return ''
  return `${string.slice(0, startEnd)}...${string.slice(-startEnd)}`
}

export function formatDate(value: TDate, format = 'DD.MM.YYYY, HH:mm') {
  if (!value) return ''
  return moment(value).format(format)
}
