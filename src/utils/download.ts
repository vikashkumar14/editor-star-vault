
import { supabase } from '@/integrations/supabase/client';

export const handleMaterialDownload = async (materialId: string, fileUrl: string, fileName: string) => {
  try {
    // Track the download
    await supabase.from('downloads').insert({
      content_id: materialId,
      user_ip: 'unknown', // In a real app, you'd get this from the server
      user_agent: navigator.userAgent
    });

    // Increment download count
    await supabase.rpc('increment_download_count', { content_uuid: materialId });

    // Create download link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Download initiated for:', fileName);
  } catch (error) {
    console.error('Error handling download:', error);
    // Still allow download even if tracking fails
    window.open(fileUrl, '_blank');
  }
};
