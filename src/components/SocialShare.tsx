import { Button } from "@/components/ui/button";
import { Share2, Copy, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useThumbnailGeneration } from "@/hooks/useThumbnailGeneration";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SocialShareProps {
  materialId: string;
  title: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

const SocialShare = ({ materialId, title, fileUrl, fileName, fileType }: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    generateShareableLink,
    copyToClipboard,
    shareOnWhatsApp,
    shareOnTelegram,
    shareOnTwitter,
    shareOnFacebook,
    generateThumbnail,
    isGenerating
  } = useThumbnailGeneration();

  const handleShare = async () => {
    // Generate thumbnail if not already generated
    if (fileUrl && fileName && fileType) {
      try {
        await generateThumbnail(fileUrl, fileName, fileType, materialId);
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
        // Continue with sharing even if thumbnail generation fails
      }
    }

    const shareableLink = generateShareableLink(materialId);
    return shareableLink;
  };

  const handleCopyLink = async () => {
    const link = await handleShare();
    copyToClipboard(link);
    setIsOpen(false);
  };

  const handleWhatsAppShare = async () => {
    const link = await handleShare();
    shareOnWhatsApp(link, title);
    setIsOpen(false);
  };

  const handleTelegramShare = async () => {
    const link = await handleShare();
    shareOnTelegram(link, title);
    setIsOpen(false);
  };

  const handleTwitterShare = async () => {
    const link = await handleShare();
    shareOnTwitter(link, title);
    setIsOpen(false);
  };

  const handleFacebookShare = async () => {
    const link = await handleShare();
    shareOnFacebook(link);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isGenerating}
        >
          <Share2 className="h-4 w-4" />
          {isGenerating ? 'Preparing...' : 'Share'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTelegramShare}>
          <Send className="h-4 w-4 mr-2" />
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare}>
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter/X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare}>
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;