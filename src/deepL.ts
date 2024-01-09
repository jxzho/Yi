import { YiParamsPayload } from '@/types'

const AUTH_KEY = import.meta.env.VITE_DEEPL_AUTH_KEY

const HOST = 'https://api-free.deepl.com'

const PATH = '/v2/translate'

export const yiDeepL = (p: YiParamsPayload) => {
  return fetch(HOST + PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: AUTH_KEY
    },
    body: JSON.stringify({
      source_lang: p.from,
      target_lang: p.to,
      text: [p.text]
    })
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Network response was not ok ' + response.statusText); 
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
}