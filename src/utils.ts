export function escapeHTML (str: string) {
  return str.replace(/[&<>'"]/g, (tag) => {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  })
}
