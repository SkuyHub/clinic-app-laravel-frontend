import type { DoctorUser } from '@/types/api'
import { createPortalAuthStore } from '@/stores/createPortalAuthStore'

export const doctorAuth = createPortalAuthStore<DoctorUser>('doctor', '/doctor/me')
