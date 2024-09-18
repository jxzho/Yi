import { onMounted, ref, Ref } from 'vue'

function useTextareaFocused () {
  const refTextarea: Ref<HTMLElement> = ref(null) as any
  onMounted(() => {
    refTextarea.value.focus()
  })
  return {
    refTextarea
  }
}

export { useTextareaFocused }
