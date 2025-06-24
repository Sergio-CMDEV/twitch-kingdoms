// Supabase client for frontend (ESM import)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://dctszgnpnhfemdzfybfv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdHN6Z25wbmhmZW1kemZ5YmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjQyNzUsImV4cCI6MjA2NjMwMDI3NX0.yf12PI1OSIE12k_QHchkYhaUwHZHqNPm2XVu-5R6LoA';

export const supabase = createClient(supabaseUrl, supabaseKey);
