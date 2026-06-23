import { toast } from 'vue-sonner'
import services from '@/utils/services'

export async function onDelete(model: string, id: number | string): Promise<void> {
    try {
        await services.delete(model, id)
        toast.success('Record deleted.')
    } catch (err: any) {
        toast.error(err.response?.data?.message ?? 'Delete failed.')
        throw err
    }
}