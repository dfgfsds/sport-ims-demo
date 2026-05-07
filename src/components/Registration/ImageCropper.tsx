import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, Crop as CropIcon, RotateCcw, Check, X } from 'lucide-react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
  title?: string;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  title = 'Crop Image'
}) => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const blobUrlRef = useRef('');

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspectRatio) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspectRatio))
    }
  }

  const generateDownload = useCallback(
    (canvas: HTMLCanvasElement, crop: PixelCrop) => {
      if (!crop || !canvas) {
        return
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Failed to create blob')
            return
          }
          if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current)
          }
          blobUrlRef.current = URL.createObjectURL(blob)
          onCropComplete(blobUrlRef.current);
        },
        'image/jpeg',
        0.9,
      )
    },
    [onCropComplete],
  )

  function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist')
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob')
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
      blobUrlRef.current = URL.createObjectURL(blob)
      
      if (hiddenAnchorRef.current) {
        hiddenAnchorRef.current.href = blobUrlRef.current
        hiddenAnchorRef.current.click()
      }
    })
  }

  React.useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate,
      )
    }
  }, [completedCrop, scale, rotate])

  const handleCropComplete = () => {
    if (completedCrop && previewCanvasRef.current) {
      generateDownload(previewCanvasRef.current, completedCrop);
      onClose();
    }
  };

  const handleReset = () => {
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    setRotate(0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="2xl">
      <div className="space-y-6">
        {/* File Upload */}
        {!imgSrc && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="text-lg font-medium text-gray-900">Upload an image</span>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
              />
            </label>
            <Button className="mt-4">
              <Upload size={16} className="mr-2" />
              Choose File
            </Button>
          </div>
        )}

        {/* Image Cropper */}
        {imgSrc && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Crop Your Image</h3>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="secondary" onClick={handleReset}>
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale: {scale}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rotate: {rotate}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotate}
                  onChange={(e) => setRotate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Crop Area */}
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                minWidth={100}
                minHeight={100}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                  className="max-h-96"
                />
              </ReactCrop>
            </div>

            {/* Preview */}
            {completedCrop && (
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <canvas
                  ref={previewCanvasRef}
                  className="border border-gray-300 rounded-lg mx-auto"
                  style={{
                    objectFit: 'contain',
                    width: 150,
                    height: 150,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            <X size={16} className="mr-2" />
            Cancel
          </Button>
          {imgSrc && completedCrop && (
            <Button onClick={handleCropComplete}>
              <Check size={16} className="mr-2" />
              Use This Image
            </Button>
          )}
        </div>

        {/* Hidden anchor for download */}
        <a
          ref={hiddenAnchorRef}
          download
          style={{
            position: 'absolute',
            top: '-200vh',
            visibility: 'hidden',
          }}
        >
          Hidden download
        </a>
      </div>
    </Modal>
  );
};

// Canvas preview function
function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0,
) {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  const rotateRads = rotate * (Math.PI / 180)
  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  ctx.save()

  ctx.translate(-cropX, -cropY)
  ctx.translate(centerX, centerY)
  ctx.rotate(rotateRads)
  ctx.scale(scale, scale)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  )

  ctx.restore()
}

export default ImageCropper;