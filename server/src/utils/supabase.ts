import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use Service Key for backend admin privileges

console.log('Current working directory:', process.cwd());
console.log('SUPABASE_URL present:', !!supabaseUrl);
console.log('SUPABASE_SERVICE_KEY present:', !!supabaseKey);
// console.log('Env keys:', Object.keys(process.env)); 

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
