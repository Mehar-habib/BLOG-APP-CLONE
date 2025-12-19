"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AddCoverProps {
  setUploadedCover: (cover: string) => void;
  replaceUrl?: string;
}
export default function AddCover({
  setUploadedCover,
  replaceUrl,
}: AddCoverProps) {
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { edgestore } = useEdgeStore();

  const handleButtonClick = () => imgInputRef.current?.click();
  // useEffect(() => {
  //   let isMounted = true;
  //   const uploadImage = async () => {
  //     if (!file) return setIsUploading(true);
  //     try {
  //       const res = await edgestore.publicFiles.upload({
  //         file,
  //         options: replaceUrl ? { replaceTargetUrl: replaceUrl } : undefined,
  //       });
  //       if (isMounted && res.url) {
  //         setUploadedCover(res.url);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       if (isMounted) {
  //         setIsUploading(false);
  //       }
  //     }
  //   };
  //   uploadImage();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [file]);

  useEffect(() => {
    if (!file) return;

    let isMounted = true;

    const uploadImage = async () => {
      setIsUploading(true);
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options: replaceUrl ? { replaceTargetUrl: replaceUrl } : undefined,
        });

        if (isMounted && res.url) {
          setUploadedCover(res.url);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsUploading(false);
        }
      }
    };

    uploadImage();

    return () => {
      isMounted = false;
    };
  }, [file, replaceUrl, edgestore]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          e.currentTarget.value = "";
        }}
        ref={imgInputRef}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center gap-2"
      >
        <ImageIcon size={20} />
        <span>{!!replaceUrl ? "Change Cover" : "Add cover"}</span>
      </button>
      {isUploading && <p className="text-green-500">Uploading...</p>}
    </div>
  );
}
