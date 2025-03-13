
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkznoustvwyiugxtvmmc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrem5vdXN0dnd5aXVneHR2bW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODY4NjcsImV4cCI6MjA1NzQ2Mjg2N30.T82TlLiOiJiTiyOmBH8MrG7UQwqqeRwh9blQSBtkjzQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
