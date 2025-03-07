import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://gxpangwbqzzlwbgbbcmy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cGFuZ3dicXp6bHdiZ2JiY215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODAxMjMsImV4cCI6MjA1NjY1NjEyM30.SGhEjnJLcccBovRbGmujPOOtJm2AQtDOxvamlov0yQw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
