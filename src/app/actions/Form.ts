import { defineAsyncComponent, type Component } from "vue"
import services from '@/utils/services'

export const componentTypeMap: Record<string, Component> = {
    text:     defineAsyncComponent(() => import('@/components/inputs/TextInput.vue')),
    password: defineAsyncComponent(() => import('@/components/inputs/PasswordInput.vue')),
    textarea: defineAsyncComponent(() => import('@/components/inputs/TextareaInput.vue')),
    number:   defineAsyncComponent(() => import('@/components/inputs/NumberInput.vue')),
    date:     defineAsyncComponent(() => import('@/components/inputs/DateInput.vue')),
    select:   defineAsyncComponent(() => import('@/components/inputs/SelectInput.vue')),
    radio:    defineAsyncComponent(() => import('@/components/inputs/RadioInput.vue')),
    image:    defineAsyncComponent(() => import('@/components/inputs/ImageInput.vue')),
}

export async function defaultFormGetData(
    getAPI: string,
    id: string | number,
): Promise<Record<string,any>> {
    const res = await services.show(getAPI, id)
    return res.data
}