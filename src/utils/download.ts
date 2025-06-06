
import { supabase } from '@/integrations/supabase/client';

export const handleMaterialDownload = async (materialId: string, fileUrl: string, fileName: string) => {
  try {
    // Track the download
    await supabase.from('downloads').insert({
      content_id: materialId,
      user_ip: 'unknown',
      user_agent: navigator.userAgent
    });

    // Increment download count
    await supabase.rpc('increment_download_count', { content_uuid: materialId });

    // Direct download without opening new pages
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL
    window.URL.revokeObjectURL(downloadUrl);

    console.log('Download completed for:', fileName);
  } catch (error) {
    console.error('Error handling download:', error);
    // Fallback to direct link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
