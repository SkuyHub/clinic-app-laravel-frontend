import type { PatientUser } from '@/types/api'
import { createPortalAuthStore } from '@/stores/createPortalAuthStore'

export const patientAuth = createPortalAuthStore<PatientUser>('patient', '/patient/me')
