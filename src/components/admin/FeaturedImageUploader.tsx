"use client";

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  uploadFeaturedImage,
  deleteFeaturedImage,
} from "@/lib/appwrite/client";

interface FeaturedImageUploaderProps {
  /** Current image URL (from existing post). */
  initialImageUrl: string | null;
  /** Existing post's featuredImageId, if any. Used to know what to delete on replace. */
  initialImageId?: string | null;
  /** Hidden input name the server action reads to get the file ID. */
  fileIdFieldName: string;
  /** Hidden input name for the "remove image" flag. */
  removeFieldName: string;
}

/** Hard cap on file size — Appwrite Cloud's default per-file limit is 50 MB. */
const MAX_BYTES = 45 * 1024 * 1024;

/**
 * Featured-image picker that uploads directly from the browser to
 * Appwrite Storage, bypassing Netlify entirely.
 *
 * Why direct upload: Netlify Functions reject any request with a body
 * over 6 MB, so going through the post's server action capped images
 * at ~5 MB. By uploading the image as a separate browser-to-Appwrite
 * request when the user picks the file, then storing only the
 * resulting file ID in a hidden form input, the post-save form
 * submission stays tiny no matter how big the image is. Limit here
 * is 45 MB (just under Appwrite's default 50 MB per-file cap, with
 * a few MB of headroom).
 *
 * UX flow:
 *   1. User clicks "Upload featured image" → file picker
 *   2. File selected → validate size, upload immediately with progress
 *   3. On success → preview shown, file ID stored in hidden input
 *   4. User can Replace (deletes old upload, uploads new)
 *   5. User can Remove (deletes upload, marks form for clearing)
 *   6. Post save form submission only carries the ID string
 */
export default function FeaturedImageUploader({
  initialImageUrl,
  initialImageId,
  fileIdFieldName,
  removeFieldName,
}: FeaturedImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [removed, setRemoved] = useState(false);
  /**
   * The currently-selected file ID:
   *   - null + initialImageId set → use the existing post's image (no change)
   *   - non-null → user uploaded a new image; pass this through to save
   *   - null + initialImageId null → no image at all
   */
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [pendingFileName, setPendingFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * On replace, delete the previously-uploaded NEW image (not the
   * existing post's image — that one's deleted server-side after save
   * succeeds). Prevents orphaned files in the bucket from cancelled
   * upload attempts.
   */
  const cleanupPriorUpload = async () => {
    if (uploadedFileId) {
      await deleteFeaturedImage(uploadedFileId);
      setUploadedFileId(null);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (file.size > MAX_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      setUploadError(
        `${file.name} is ${mb} MB — exceeds the 45 MB limit. Compress (Squoosh / TinyPNG) and try again.`
      );
      // Clear the input so re-picking the SAME file still triggers a change.
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Clean up any prior in-progress upload before starting a new one.
    await cleanupPriorUpload();

    // Show preview immediately while the upload runs.
    setPreviewUrl(URL.createObjectURL(file));
    setPendingFileName(file.name);
    setRemoved(false);
    setUploading(true);
    setUploadProgress(0);

    const result = await uploadFeaturedImage(file, (p) =>
      setUploadProgress(p)
    );

    setUploading(false);

    if (!result.ok) {
      setUploadError(result.error);
      setPreviewUrl(initialImageUrl);
      setPendingFileName(null);
      // Clear the input so the user can retry without picking a different file.
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploadedFileId(result.id);
  };

  const handleRemove = async () => {
    // Delete the just-uploaded file (if any) — frees the bucket slot.
    await cleanupPriorUpload();
    setPreviewUrl(null);
    setPendingFileName(null);
    setRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      {/* Hidden inputs the server action reads.
          - fileIdFieldName: the new file's ID (server writes this to the post)
          - removeFieldName: signals the server to clear the existing image */}
      <input
        type="hidden"
        name={fileIdFieldName}
        value={uploadedFileId || ""}
      />
      <input
        type="checkbox"
        name={removeFieldName}
        checked={removed}
        readOnly
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleFileChange}
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
          {uploading && (
            <div className="absolute inset-0 bg-white/80 rounded-lg flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="animate-spin text-black" />
              <p className="text-xs font-medium text-black">
                Uploading… {Math.round(uploadProgress)}%
              </p>
              <div className="w-2/3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          {!uploading && (
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
          )}
          {pendingFileName && !uploading && uploadedFileId && (
            <p className="text-xs text-green-700 mt-2">
              ✓ Uploaded: {pendingFileName}
            </p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-[16/9] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon size={32} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700 inline-flex items-center gap-2">
            <Upload size={14} />
            Upload featured image
          </span>
          <span className="text-xs text-gray-500">
            JPG, PNG, WEBP, AVIF, or GIF · max 45 MB
          </span>
        </button>
      )}

      {uploadError && (
        <p className="text-xs text-red-600 mt-2 leading-relaxed" role="alert">
          {uploadError}
        </p>
      )}

      {/*
        If we have an existing image but the user hasn't replaced or removed
        it, the form needs to know to keep the existing one. The hidden
        fileIdFieldName above is empty in this case — the server action
        treats empty + removeFlag=false as "keep current".
      */}
      {!uploading && !uploadedFileId && initialImageId && !removed && (
        <p className="text-[11px] text-gray-500 mt-2">
          Current image will be kept on save.
        </p>
      )}
    </div>
  );
}
