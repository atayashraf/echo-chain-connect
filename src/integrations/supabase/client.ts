// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qxspnyupxtvolzwjlgqt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4c3BueXVweHR2b2x6d2psZ3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTQwODgsImV4cCI6MjA2MDg5MDA4OH0.VOZB0h0JN1iDQqIvAcCq44PoBWaLc0LNtNUeAbj8NlI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);