import { createClient as createBrowser } from './client'
export const supabase = typeof window !== 'undefined' ? createBrowser() : null as any
export { createBrowser as createClient }
