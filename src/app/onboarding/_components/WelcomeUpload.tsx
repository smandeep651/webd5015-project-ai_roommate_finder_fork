'use client';

import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

type Props = {
  onImageUpload: (url: string) => void;
};

const WelcomeUpload = ({ onImageUpload }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const cloudinaryUrl = await uploadToCloudinary(file);
    if (cloudinaryUrl) {
      setUploadedUrl(cloudinaryUrl);
      onImageUpload(cloudinaryUrl);
    }

    setUploading(false);
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold">Welcome to Roommate Finder 🎉</h2>
      <p className="text-gray-600">
        Let’s start by uploading your profile picture.
      </p>

      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Profile Preview"
            className="w-32 h-32 object-cover rounded-full border-2 mx-auto shadow"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
        className="block mx-auto"
      />

      {uploading && <p className="text-blue-500 text-sm mt-2">Uploading...</p>}
      {uploadedUrl && (
        <p className="text-green-600 text-sm mt-2">
           Uploaded successfully!
        </p>
      )}
    </div>
  );
};

export default WelcomeUpload;
