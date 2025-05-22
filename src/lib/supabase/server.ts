import { createClient } from "@supabase/supabase-js"

// Hardcode the values to ensure we're connecting to the right database
const supabaseUrl = "https://kpjnsppbmyfrchhbnnjd.supabase.co"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwam5zcHBibXlmcmNoaGJubmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzE5NjEsImV4cCI6MjA2MDI0Nzk2MX0._dQiEyVbqG9bf7vC8CVrodrV773_DqD3r-9ttH9CvWw"

console.log("Server: Connecting to Supabase URL:", supabaseUrl)

export const getSupabaseServerClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}
