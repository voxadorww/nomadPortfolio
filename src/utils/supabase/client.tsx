import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info.tsx';

// Create a singleton Supabase client
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API base URL
export const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-31ffd1db`;

// Helper to get auth headers
export const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
  };
};
