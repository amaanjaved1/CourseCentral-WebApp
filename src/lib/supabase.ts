import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the browser
// Hardcoded credentials to ensure we're connecting to the right database
const supabaseUrl = "https://kpjnsppbmyfrchhbnnjd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwam5zcHBibXlmcmNoaGJubmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzE5NjEsImV4cCI6MjA2MDI0Nzk2MX0._dQiEyVbqG9bf7vC8CVrodrV773_DqD3r-9ttH9CvWw"

console.log("Connecting to Supabase URL:", supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
