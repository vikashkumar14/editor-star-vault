
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, File, Image } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface FileUploadProps {
  onFileUploaded: (url: string) => void;
  accept?: string;
  bucket: string;
  maxSize?: number;
  label: string;
  currentFile?: string;
}

const FileUpload = ({ 
  onFileUploaded, 
  accept = "image/*", 
  bucket, 
  maxSize = 5 * 1024 * 1024, 
  label,
  currentFile 
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      
      if (file.size > maxSize) {
        toast.error(`File size should be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onFileUploaded(publicUrl);
      toast.success(`${label} uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Error uploading ${label.toLowerCase()}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const removeFile = () => {
    onFileUploaded('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      
      {currentFile ? (
        <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
          {bucket === 'material-thumbnails' ? (
            <Image className="w-4 h-4 text-green-500" />
          ) : (
            <File className="w-4 h-4 text-blue-500" />
          )}
          <span className="text-sm truncate flex-1">
            {currentFile.split('/').pop() || 'Uploaded file'}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-red-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Drag and drop your {label.toLowerCase()} here, or click to browse
          </p>
          <Input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${bucket}`}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById(`file-upload-${bucket}`)?.click()}
          >
            {uploading ? 'Uploading...' : `Choose ${label}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
