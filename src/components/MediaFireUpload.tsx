
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Link as LinkIcon, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface MediaFireUploadProps {
  onLinkAdded: (url: string) => void;
  label: string;
  description?: string;
  currentUrl?: string;
}

const MediaFireUpload = ({ 
  onLinkAdded, 
  label, 
  description = "Enter MediaFire download link for easy user access",
  currentUrl 
}: MediaFireUploadProps) => {
  const [url, setUrl] = useState(currentUrl || '');
  const [isValidating, setIsValidating] = useState(false);

  const validateMediaFireUrl = (url: string): boolean => {
    // Check if it's a valid MediaFire URL
    const mediaFirePattern = /^https?:\/\/(www\.)?mediafire\.com\/(file|download)\/[a-zA-Z0-9]+/;
    return mediaFirePattern.test(url) || url.includes('mediafire.com');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
  };

  const handleAddLink = async () => {
    if (!url.trim()) {
      toast.error("Please enter a MediaFire URL");
      return;
    }

    setIsValidating(true);
    
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL");
      setIsValidating(false);
      return;
    }

    // Check if it's a MediaFire URL
    if (!validateMediaFireUrl(url)) {
      toast.error("Please use a MediaFire download link for better reliability");
      setIsValidating(false);
      return;
    }

    onLinkAdded(url);
    toast.success(`${label} link added successfully!`);
    setIsValidating(false);
  };

  const handleTestLink = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const clearLink = () => {
    setUrl('');
    onLinkAdded('');
    toast.info(`${label} link cleared`);
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LinkIcon className="w-5 h-5 text-blue-500" />
          <span>{label}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mediafire-url">MediaFire Download Link</Label>
          <div className="flex space-x-2">
            <Input
              id="mediafire-url"
              type="url"
              placeholder="https://www.mediafire.com/file/example/filename.zip"
              value={url}
              onChange={handleUrlChange}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleTestLink}
              disabled={!url}
              title="Test link"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {url && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            {validateMediaFireUrl(url) ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
              {url}
            </span>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            type="button"
            onClick={handleAddLink}
            disabled={!url || isValidating}
            className="flex-1"
          >
            {isValidating ? 'Validating...' : 'Add Link'}
          </Button>
          {url && (
            <Button
              type="button"
              variant="outline"
              onClick={clearLink}
            >
              Clear
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• Upload your file to MediaFire for reliable downloads</p>
          <p>• Supports all file types: ZIP, PDF, PSD, AI, MP4, etc.</p>
          <p>• Users can download directly without registration</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaFireUpload;
