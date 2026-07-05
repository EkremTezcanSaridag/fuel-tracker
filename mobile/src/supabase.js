import { createClient } from '@supabase/supabase-js'

const env = typeof process !== 'undefined' ? process.env ?? {} : {}
const SUPABASE_URL = env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://phmmqamvornjwtcrbioh.supabase.co'
const SUPABASE_KEY =
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobW1xYW12b3Juand0Y3JiaW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwODg3NDksImV4cCI6MjA5ODY2NDc0OX0.mm4IMsUF4n1oK5rl7JVHDWbqNtnEa4xAHtmxYUhJv30'

export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_KEY)

export const supabase = hasSupabaseConfig
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
      },
    })
  : null
