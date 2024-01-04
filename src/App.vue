<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref } from 'vue'
import SvgTranslation from '@/assets/translation.svg'
import SvgLoading from '@/assets/loading.svg'

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

const refInput: Ref<HTMLElement> = ref(null) as any
onMounted(() => {
  refInput.value.focus()
})

const bodyPost = computed(() => {
  const body = {
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
  if (!fromValue.value) {
    toValue.value = ''
    return
  }
  
  if (loading.value) return

  ;loading.value = true
  fetch(`https://translate.junxio220.workers.dev`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyPost.value)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json()
    })
    .then(data => {
      if (data) {
        toValue.value = data?.response?.translated_text || ''
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
}

</script>

<template>
  <div>
    <div class="font-mono text-sm text-black/30 font-bold my-6">
      译 | from {{ TEXT_FROM[lang.from] }}
    </div>
    
    <div class="to">
      <img v-if="loading" class="max-w-[88px]" :src="SvgLoading" />
      <template v-else>
        {{ toValue }}
      </template>
    </div>
    
    <div class="flex justify-center my-8 cursor-pointer" @click="turnLang">
      <img :src="SvgTranslation" />
    </div>
    
    <div class="font-mono text-sm text-black/30 font-bold my-6">
      to {{ TEXT_FROM[lang.to] }}
    </div>
    
    <div class="from">
      <input
        ref="refInput"
        class="border-b border-b-gray-200 border-solid"
        v-model="fromValue"
      />
    </div>
    
    <button :disable="loading || !fromValue" class="btn-tran" @click="startTranslate">
      翻译
    </button>
  </div>
</template>

<style lang="scss" scoped>
.to,
.from {
  @apply text-center font-serif text-5xl text-black;
  
  input {
    @apply w-auto min-w-[2em] inline-block focus:border-b-gray-400;
    @apply text-5xl text-center outline-none px-2;
  }
}

.btn-tran {
  @apply my-12 text-sm border-solid border border-black text-black px-5 py-1 bg-transparent rounded-sm active:border-gray-500 active:text-gray-500;
  @apply transition-all;
  @apply active:translate-y-0.5;
}

img {
  @apply inline-block box-content;
}
</style>
