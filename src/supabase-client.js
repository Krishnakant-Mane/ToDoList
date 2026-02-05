import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sterqjiyqbthvrzspyxc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0ZXJxaml5cWJ0aHZyenNweXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTA5MTgsImV4cCI6MjA4NTc4NjkxOH0.Uew_aTMdeNRO5NNbuMGbOTD_5kOzwl4B9QrAwFVe-QM"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase;