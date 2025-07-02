
import { supabase } from '@/integrations/supabase/client';

export const handleMaterialDownload = async (materialId: string, fileUrl: string, fileName: string, materialTitle = 'Premium Material') => {
  try {
    console.log('Starting download process for:', fileName);
    console.log('File URL:', fileUrl);
    
    // Validate that we have a proper file URL
    if (!fileUrl || fileUrl.trim() === '') {
      throw new Error('Download link not available');
    }

    // Track the download in background (don't let this block the download)
    Promise.resolve(supabase.from('downloads').insert({
      content_id: materialId,
      user_ip: 'unknown',
      user_agent: navigator.userAgent
    })).then(() => {
      // Increment download count in background
      return supabase.rpc('increment_download_count', { content_uuid: materialId });
    }).catch(error => {
      console.warn('Failed to track download:', error);
    });

    // Always open the admin provided URL directly - this is the most reliable approach
    console.log('Opening admin provided URL:', fileUrl);
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
    console.log('Download initiated successfully via direct link');

  } catch (error) {
    console.error('Error handling download:', error);
    
    // Final fallback - just open the URL
    if (fileUrl) {
      try {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
        console.log('Opened file URL as fallback');
      } catch (fallbackError) {
        console.error('All download methods failed:', fallbackError);
        throw new Error('Download failed. Please try again or contact support.');
      }
    } else {
      throw new Error('No download link available');
    }
  }
};
