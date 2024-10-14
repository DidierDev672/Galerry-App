import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "http://localhost:8000";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";
const SERVICEROLEKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";
const DASHBOARDUSERNAME = "supabase";
const DASHBOARDPASSWORD = "this_password_is_insecure_and_should_be_updated";

if (!supabaseUrl || !supabaseAnonKey || !DASHBOARDPASSWORD || !DASHBOARDUSERNAME || !SERVICEROLEKEY) {
    throw new Error('No se ha configurado correctamente la URL y la clave de Supabase');
}

export const supabase = createClient(supabaseUrl,SERVICEROLEKEY);
