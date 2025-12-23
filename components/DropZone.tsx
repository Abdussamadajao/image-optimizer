"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { MdUpload, MdImage, MdCloudDownload } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  className?: string;
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
}

export function DropZone({
  className,
  onDrop,
  accept = {
    "image/*": [
      ".jpeg",
      ".jpg",
      ".png",
      ".webp",
      ".gif",
      ".avif",
      ".tiff",
      ".tif",
    ],
  },
  maxSize = 50 * 1024 * 1024,
  disabled = false,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled,
    noClick: true,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    onDropAccepted: () => setIsDragOver(false),
    onDropRejected: () => setIsDragOver(false),
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative",
        "border-2 border-dashed",
        "rounded-xl",
        "p-6 sm:p-12",
        "bg-card/50",
        "border-border",
        "transition-colors duration-200",
        isDragActive && "border-primary bg-primary-light",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-muted">
          {isDragActive ? (
            <MdUpload className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
          ) : (
            <MdCloudDownload className="h-8 w-8 sm:h-12 sm:w-12 text-secondary" />
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            {isDragActive
              ? "Drop images here"
              : "Drop images or click to browse"}
          </h3>
          <p className="text-xs sm:text-sm text-secondary">
            Supports JPEG, PNG, WebP, AVIF, GIF, TIFF up to 50MB
          </p>
        </div>
        <Button
          type="button"
          onClick={open}
          disabled={disabled}
          className="font-bold shadow-primary-glow text-sm sm:text-base"
        >
          Select Files
        </Button>
      </div>
    </div>
  );
}
