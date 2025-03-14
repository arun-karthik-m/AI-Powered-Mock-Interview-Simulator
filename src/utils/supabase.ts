
import { supabase } from "@/integrations/supabase/client";

// Interview data type to match database structure
export interface InterviewData {
  user_id?: string;
  role_title: string;
  questions?: any[];
  answers?: any[];
  feedback?: string;
  scores?: any;
  overall_score?: number;
}

// Real Supabase interactions
export async function saveInterviewData(data: InterviewData) {
  try {
    // Using any type to bypass TypeScript errors until database types are properly defined
    const { data: result, error } = await (supabase as any)
      .from('interviews')
      .insert([data])
      .select();
      
    if (error) {
      console.error('Error saving interview data:', error);
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Error in saveInterviewData:', error);
    return null;
  }
}

export async function getUserInterviews(userId: string) {
  try {
    // Using any type to bypass TypeScript errors until database types are properly defined
    const { data, error } = await (supabase as any)
      .from('interviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user interviews:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserInterviews:', error);
    return [];
  }
}

// Authentication helper functions
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export { supabase };
