<template>
  <div class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
    <div class="p-2 bg-white rounded-t-lg">
      <textarea
        rows="5"
        class="use-textarea-content font-serif w-full py-2 px-3 text-gray-900 bg-white border-0 focus:ring-0"
        placeholder="待输入..."
        required
        maxlength="10000"
        :disabled="disabled"
        v-model="localValue"
        @keydown.enter="startSubmit"
      ></textarea>
    </div>
    <div class="px-3 py-2 border-t">
      <div class="flex items-center justify-between">
        <slot name="action">
          <div class="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2"></div>
        </slot>
        <button
          type="submit"
          :disabled="disabled"
          class="inline-flex items-center py-2 px-5 text-sm text-center text-black rounded-lg border border-solid border-gray-300 focus:ring-2 focus:ring-blue-200 hover:bg-gray-200"
          :class="{ 'cursor-not-allowed': disabled }"
          @click="startSubmit"
        >
          {{ labelSubmit }}
        </button>
      </div>
      <div v-if="searchLog.size" class="flex items-center flex-wrap my-1">
        <div
          v-for="[key] of searchLog"
          class="inline-block text-gray-500 px-1.5 py-1 my-1 mr-2 border border-solid border-gray-300 rounded-md bg-white text-sm max-w-28 truncate hover:cursor-pointer hover:bg-gray-100 hover:border-gray-500"
          @click="selectLog(key)"
        >
          {{ key }}
        </div>
        <div
          class="inline-flex items-center self-stretch px-1.5 py-1 my-1 mr-2 border border-solid border-gray-300 rounded-md bg-white max-w-28 truncate hover:cursor-pointer hover:bg-gray-100 hover:border-gray-500"
          @click="cleanLog"
        >
          <img class="w-[12px]" :src="SvgIconTrash" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, Ref } from 'vue'
import SvgIconTrash from '@/assets/trash.svg'

const searchLog: Ref<Map<string, string>> = inject('searchLog') as any

const props = withDefaults(defineProps<{
  value?: string
  labelSubmit?: string
  disabled?: boolean
}>(), {
  value: '',
  labelSubmit: '提交',
  disabled: false
})

const emit = defineEmits(['update:value', 'submit', 'select-log'])

const localValue = ref('')

function startSubmit () {
  emit('submit', localValue.value)
}

function selectLog (key: string) {
  emit('select-log', key)
}

function cleanLog () {
  searchLog.value.clear()  
}

watch(() => props.value, val => {
  if (val !== localValue.value) {
    localValue.value = val
  }
})

watch(localValue, (val) => {
  emit('update:value', val.trim())
})

defineExpose({
  focus () {
    const eleTextarea = document.querySelector('.use-textarea-content') as HTMLElement
    eleTextarea?.focus?.()
  }
})
</script>
