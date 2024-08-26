import { useProfileStore } from "@/app/stores/ProfileStore";
import "cropperjs/dist/cropper.css";
import React, { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";

interface cropperProps{
    imagePreview:string,
}

export const PhotoCropper: React.FC<cropperProps> = ({imagePreview}:cropperProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const setCropper = useProfileStore((state)=>state.setCropper)
 
  return (
    <div className="max-w-[200px] min-h-[200px]">
    <Cropper
      src={imagePreview}
      style={{ height: 200, width: '100%' }}
      // Cropper.js options
      initialAspectRatio={1}
      aspectRatio={1}
      preview='.img-preview'
      guides={false}
      ref={cropperRef}
      viewMode={1}
      autoCropArea={1}
      background={false}
      onInitialized={cropper=>setCropper(cropper)}
    />
    </div>
  );
};