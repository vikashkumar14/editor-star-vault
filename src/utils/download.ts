
import { supabase } from '@/integrations/supabase/client';

export const handleMaterialDownload = async (materialId: string, fileUrl: string, fileName: string, materialTitle = 'Premium Material') => {
  try {
    console.log('Starting download process for:', fileName);
    console.log('File URL:', fileUrl);
    
    // Track the download
    await supabase.from('downloads').insert({
      content_id: materialId,
      user_ip: 'unknown',
      user_agent: navigator.userAgent
    });

    // Increment download count
    await supabase.rpc('increment_download_count', { content_uuid: materialId });

    // Create a simple anchor element for download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Download initiated successfully');

  } catch (error) {
    console.error('Error handling download:', error);
    // Fallback - try direct window open
    try {
      window.open(fileUrl, '_blank');
    } catch (fallbackError) {
      console.error('Fallback download also failed:', fallbackError);
      throw new Error('Download failed. Please try again.');
    }
  }
};
