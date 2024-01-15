<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref } from 'vue'
import SvgTranslation from '@/assets/translation.svg'
import SvgLoading from '@/assets/loading.svg'
import { YiParamsPayload } from '@/types'
import UseTextArea from '@/components/textarea.vue'
import Toast from '@/components/toast.vue'

const lang = reactive({
  from: 'en',
  to: 'zh'
})

const TEXT_FROM: Record<string, string> = {
  en: '英',
  zh: '中'
}

const toValue = ref('')
const fromValue = ref('')

const refTextarea: Ref<HTMLElement> = ref(null) as any
onMounted(() => {
  refTextarea.value.focus()
})

const bodyPost = computed(() => {
  const body: YiParamsPayload = {
    text: fromValue.value,
    from: lang.from,
    to: lang.to
  }

  if (import.meta.env.DEV) {
    Object.assign(body, {
      dev: 'dev'
    })
  }
  
  return body
})

const loading = ref(false)
const startTranslate = () => {
  if (loading.value) return
  
  if (!fromValue.value) {
    toValue.value = ''
    return
  }

  ;loading.value = true
  
  fetch('https://translate.junxio220.workers.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyPost.value)
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Network response was not ok ' + response.statusText);
      }
    })
    .then(data => {
      if (data) {
        let val = data?.response?.text
        if (Array.isArray(val)) {
          val = val.join('/')
        }
        toValue.value = val ?? ''
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

const turnLang = () => {
  if (lang.from === 'en') {
    lang.from = 'zh'
    lang.to = 'en'
  } else {
    lang.from = 'en'
    lang.to = 'zh'
  }
  startTranslate()
}

const toastData = reactive({
  type: 'success',
  visible: false,
  messages: ''
})
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

let _timerToast: any
const startCopy = () => {
  if (toValue.value) {
    clearTimeout(_timerToast)

    const flag = copyTextToClipboard(toValue.value)
    toastData.messages = flag ? '已复制结果' : '请尝试手动复制'
    toastData.type = flag ? 'success' : 'warning'
    toastData.visible = true

    _timerToast = setTimeout(() => {
      toastData.messages = ''
      toastData.visible = false
    }, 2000)
  }
}

</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="font-mono text-3xl text-black font-bold">
      Yi & 译
    </h1>
    
    <div class="to">
      <TransitionGroup name="fade">
        <img v-if="loading" class="max-w-[88px]" :src="SvgLoading" />
        <div v-if="!loading && toValue" class="underline decoration-dotted">
          {{ toValue }}
          <i class="icon-copy" @click="startCopy">
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 12.432v-4.62A2.813 2.813 0 0 1 15.813 5h24.374A2.813 2.813 0 0 1 43 7.813v24.375A2.813 2.813 0 0 1 40.187 35h-4.67" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.188 13H7.811A2.813 2.813 0 0 0 5 15.813v24.374A2.813 2.813 0 0 0 7.813 43h24.375A2.813 2.813 0 0 0 35 40.187V15.814A2.813 2.813 0 0 0 32.187 13z" stroke="#333" stroke-width="2" stroke-linejoin="round"/></svg>
          </i>
        </div>
      </TransitionGroup>
    </div>
    
    <div class="from">
      <UseTextArea
        ref="refTextarea"
        v-model:value="fromValue"
        label-submit="翻译"
        :disabled="loading"
        @submit="startTranslate"
      >
        <template #action>
          <div class="btn-turn" @click="turnLang">
            <div class="text-black">{{ TEXT_FROM[lang.from] }}</div>
            <img class="mx-2" :src="SvgTranslation" />
            <div class="text-black">{{ TEXT_FROM[lang.to] }}</div>
          </div>
        </template>
      </UseTextArea>
    </div>
  </div>
  
  <Teleport to="body">
    <Toast
      :type="toastData.type as 'warning' | 'success'"
      :visible="toastData.visible"
      :message="toastData.messages"
      @close="toastData.visible = false;"
    />
  </Teleport>
</template>

<style lang="scss" scoped>
.to, .from {
  @apply w-[360px];
  @apply sm:w-[520px];
}

.to {
  @apply my-12;
}

.btn-tran {
  @apply my-12 border-solid border border-black text-black px-5 py-1 bg-transparent rounded-sm;
  @apply active:border-gray-500 active:text-gray-500;
  @apply transition-all active:translate-y-0.5;
}

.btn-turn {
  @apply cursor-pointer flex justify-center items-center;
}

.icon-copy {
  @apply inline-block ml-1.5 cursor-pointer;
}
</style>
