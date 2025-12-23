"use client";

import * as React from "react";
import Image from "next/image";
import { MdCheckCircle, MdError } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ImageCardState = "idle" | "processing" | "complete" | "error";
export type ImageCardVariant = "default" | "processing" | "add-more";

interface ImageCardProps {
  className?: string;
  variant?: ImageCardVariant;
  state?: ImageCardState;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  title?: string;
  metadata?: React.ReactNode;
  actions?: React.ReactNode;
  progress?: number;
  onClick?: () => void;
}

export function ImageCard({
  className,
  variant = "default",
  state = "idle",
  image,
  title,
  metadata,
  actions,
  progress,
  onClick,
}: ImageCardProps) {
  const isProcessing = state === "processing";
  const isComplete = state === "complete";
  const isError = state === "error";
  const isAddMore = variant === "add-more";

  return (
    <Card
      className={cn(
        "group relative",
        "gap-0",
        "transition-colors duration-200",
        "hover:border-primary/50",
        isAddMore ? "border-dashed cursor-pointer p-0" : "p-3",
        className
      )}
      onClick={onClick}
    >
      {isAddMore ? (
        <CardContent className="flex flex-col items-center justify-center aspect-4/3 gap-2 text-secondary p-6 w-full h-full">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <span className="text-2xl">+</span>
          </div>
          <span className="text-sm font-medium">Add More</span>
        </CardContent>
      ) : (
        <>
          {image && (
            <CardContent className="relative aspect-4/3 w-full overflow-hidden rounded-lg mb-3 p-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-[2px]">
                  <FaSpinner className="h-6 w-6 animate-spin text-white" />
                  <span className="text-sm font-medium text-white">
                    Processing...
                  </span>
                </div>
              )}
              {isComplete && (
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-success">
                  <MdCheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
              {isError && (
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
                  <MdError className="h-4 w-4 text-white" />
                </div>
              )}
            </CardContent>
          )}

          {(title || metadata) && (
            <CardHeader className="p-0 pb-2">
              {title && (
                <CardTitle className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                  {title}
                </CardTitle>
              )}
              {metadata && (
                <div className="text-xs text-secondary">{metadata}</div>
              )}
            </CardHeader>
          )}

          {isProcessing && progress !== undefined && (
            <CardContent className="p-0 pb-2">
              <Progress value={progress} className="h-1.5" />
            </CardContent>
          )}

          {actions && (
            <CardFooter className="p-0 pt-2 flex items-center gap-2">
              {actions}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}
