import React, { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';

interface ImageUploadProps {
  productId: number;
  currentImageUrl?: string;
  onSuccess: (imageUrl: string) => void;
  onError: (error: string) => void;
}

export default function ImageUpload({
  productId,
  currentImageUrl,
  onSuccess,
  onError
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Veuillez sélectionner une image (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('La taille du fichier ne doit pas dépasser 10MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      onError('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/produits/${productId}/upload-image`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      onSuccess(data.imageUrl);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Current Image Display */}
      {currentImageUrl && !preview && (
        <div className="relative group">
          <img
            src={currentImageUrl}
            alt="Produit"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <span className="text-white text-sm font-medium">Changer l'image</span>
          </button>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-48 object-cover rounded-lg border border-green-300 bg-green-50"
          />
          <div className="absolute inset-0 rounded-lg border-2 border-green-400 pointer-events-none" />
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!preview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <Upload size={18} />
            <span>Choisir une image</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Upload en cours...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Confirmer l'upload</span>
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </>
        )}
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-600">
        💾 Images stockées en base de données (base64) • Formats: JPG, PNG, GIF, WebP • Taille max: 10MB
      </p>
    </div>
  );
}

