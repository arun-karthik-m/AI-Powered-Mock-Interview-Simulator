
import { supabase } from "@/integrations/supabase/client";

// Real Supabase interactions
export async function saveInterviewData(data: any) {
  try {
    const { data: result, error } = await supabase
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
    const { data, error } = await supabase
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

export { supabase };
