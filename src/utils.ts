function escapeHTML (str: string) {
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

function copyTextToClipboard (text: string) {
  var textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.opacity = '0'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    return document.execCommand('copy')
  }
  catch (err) {}
  finally { document.body.removeChild(textArea) }
  
  return false
}

export { escapeHTML, copyTextToClipboard }
