
import { useState, useCallback } from 'react';

interface UseImageUploadReturn {
  images: string[];
  uploading: boolean;
  error: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  removeImage: (index: number) => void;
  resetImages: () => void;
}

export function useImageUpload(maxImages = 10): UseImageUploadReturn {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = useCallback((files: FileList) => {
    setUploading(true);
    setError(null);
    
    // Check if adding these images would exceed the maximum
    if (images.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images.`);
      setUploading(false);
      return;
    }
    
    const newImagesPromises = Array.from(files).map(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload image files only.');
        return Promise.resolve(null);
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Images must be less than 5MB in size.');
        return Promise.resolve(null);
      }
      
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            resolve('');
          }
        };
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(newImagesPromises).then(newImages => {
      const validImages = newImages.filter(img => img !== null) as string[];
      setImages(prev => [...prev, ...validImages]);
      setUploading(false);
    });
  }, [images.length, maxImages]);
  
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      processFiles(event.target.files);
    }
  }, [processFiles]);
  
  const handleImageDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFiles(event.dataTransfer.files);
    }
  }, [processFiles]);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);
  
  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const resetImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);
  
  return {
    images,
    uploading,
    error,
    handleImageUpload,
    handleImageDrop,
    handleDragOver,
    removeImage,
    resetImages
  };
}
