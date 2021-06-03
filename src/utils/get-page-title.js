import defaultSettings from '@/settings'

const title = defaultSettings.title || '房屋租赁信息网站'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
