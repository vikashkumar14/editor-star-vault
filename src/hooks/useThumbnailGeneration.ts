import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Edge function URL for OG meta tags
const OG_FUNCTION_URL = 'https://vueagetqayqfyakhmolh.supabase.co/functions/v1/og-image';

export const useThumbnailGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateThumbnail = async (
    fileUrl: string,
    fileName: string,
    fileType: string,
    materialId: string
  ) => {
    setIsGenerating(true);
    try {
      console.log('Calling generate-thumbnail function...');
      
      const { data, error } = await supabase.functions.invoke('generate-thumbnail', {
        body: {
          fileUrl,
          fileName,
          fileType,
          materialId
        }
      });

      if (error) {
        console.error('Error calling function:', error);
        throw error;
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      console.log('Thumbnail generated successfully:', data);
      toast.success('Thumbnail generated successfully!');
      
      return data.thumbnailUrl;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      toast.error('Failed to generate thumbnail');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate shareable link that uses OG edge function for proper social media previews
  const generateShareableLink = (materialId: string) => {
    // Use the OG edge function URL - this will show proper thumbnails on social media
    return `${OG_FUNCTION_URL}?id=${materialId}`;
  };

  // Generate direct link to the material page (for copy to clipboard)
  const generateDirectLink = (materialId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/material/${materialId}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  const shareOnWhatsApp = (shareableLink: string, title: string) => {
    const message = `Check out: ${title}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + shareableLink)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnTelegram = (shareableLink: string, title: string) => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent(title)}`;
    window.open(telegramUrl, '_blank');
  };

  const shareOnTwitter = (shareableLink: string, title: string) => {
    const message = `Check out: ${title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareableLink)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnFacebook = (shareableLink: string) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`;
    window.open(facebookUrl, '_blank');
  };

  return {
    generateThumbnail,
    generateShareableLink,
    generateDirectLink,
    copyToClipboard,
    shareOnWhatsApp,
    shareOnTelegram,
    shareOnTwitter,
    shareOnFacebook,
    isGenerating
  };
};
