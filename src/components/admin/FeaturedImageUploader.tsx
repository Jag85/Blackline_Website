"use client";

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface FeaturedImageUploaderProps {
  /** Current image URL (from existing post). */
  initialImageUrl: string | null;
  /** Name of the file input field — matches what the action reads. */
  fileFieldName: string;
  /** Name of the "remove image" hidden checkbox. */
  removeFieldName: string;
}

export default function FeaturedImageUploader({
  initialImageUrl,
  fileFieldName,
  removeFieldName,
}: FeaturedImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [removed, setRemoved] = useState(false);
  const [pendingFileName, setPendingFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setPendingFileName(file.name);
    setRemoved(false);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setPendingFileName(null);
    setRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        name={fileFieldName}
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="checkbox"
        name={removeFieldName}
        checked={removed}
        readOnly
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Featured image preview"
            className="w-full aspect-[16/9] object-cover rounded-lg border border-gray-200"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black text-xs font-medium px-3 py-2 rounded hover:bg-gray-100"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-white text-black text-xs font-medium px-3 py-2 rounded hover:bg-gray-100 inline-flex items-center gap-1"
            >
              <X size={12} /> Remove
            </button>
          </div>
          {pendingFileName && (
            <p className="text-xs text-gray-500 mt-2">
              New: {pendingFileName} (saves when you submit)
            </p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-[16/9] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-black hover:bg-gray-50 transition-colors"
        >
          <ImageIcon size={32} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700 inline-flex items-center gap-2">
            <Upload size={14} />
            Upload featured image
          </span>
          <span className="text-xs text-gray-500">
            JPG, PNG, WEBP, or AVIF
          </span>
        </button>
      )}
    </div>
  );
}
