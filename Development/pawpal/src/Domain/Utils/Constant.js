import { createClient } from "@supabase/supabase-js";

// подключение к базе

const supabaseUrl = "https://dyfqrzaqhdqccrvwctdh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5ZnFyemFxaGRxY2NydndjdGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0Nzg0OTIsImV4cCI6MjA2MzA1NDQ5Mn0.3tBvhYgUE2Wcif-QfGqKZo1DmpnULgYU5IpEcko7Pw8";


const supabase = createClient(supabaseUrl, supabaseAnonKey); // создание клиента
export default supabase;