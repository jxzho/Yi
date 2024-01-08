<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref } from 'vue'
import SvgTranslation from '@/assets/translation.svg'
import SvgLoading from '@/assets/loading.svg'
import { YiParamsPayload } from '@/types'
import UseTextArea from '@/components/textarea.vue'

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
    headers: { 'Content-Type': 'application/json' },
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
      console.error('There has been a problem with your fetch operation:', error);
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

</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="font-mono text-3xl text-black font-bold">
      Yi & 译
    </h1>
    
    <div class="to">
      <TransitionGroup name="fade">
        <img v-if="loading" class="max-w-[88px]" :src="SvgLoading" />
        <div v-if="!loading" class="underline decoration-dotted">
          {{ toValue }}
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
</template>

<style lang="scss" scoped>
.from {
  @apply w-[360px];
}

.to, .from {
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
</style>
