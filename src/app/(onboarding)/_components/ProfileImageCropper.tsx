'use client';

import Cropper from 'react-easy-crop';
import { useCallback, useState } from 'react';
import getCroppedImg from '@/lib/cropImage';

type Props = {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
};

const ProfileImageCropper = ({ imageSrc, onCropComplete }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropDone = useCallback(async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (croppedImage) onCropComplete(croppedImage);
  }, [croppedAreaPixels]);

  return (
    <div className="relative w-full h-64 bg-black">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
      />
      <button
        onClick={onCropDone}
        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded shadow"
      >
        Crop & Upload
      </button>
    </div>
  );
};

export default ProfileImageCropper;
