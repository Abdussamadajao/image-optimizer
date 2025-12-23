"use client";

import * as React from "react";
import { MdDownload, MdClose, MdImage, MdDelete } from "react-icons/md";
import { DropZone } from "@/components/DropZone";
import { ImageCard } from "@/components/ImageCard";
import {
  formatFileSize,
  createImagePreview,
  isValidImageFile,
  getImageDimensions,
} from "@/lib/utils/image";
import { useImageStore, type ImageFile } from "@/lib/stores/image-store";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const images = useImageStore((state) => state.images);
  const addImages = useImageStore((state) => state.addImages);
  const removeImage = useImageStore((state) => state.removeImage);
  const removeOptimizedVersion = useImageStore(
    (state) => state.removeOptimizedVersion
  );
  const updateImage = useImageStore((state) => state.updateImage);
  const setOptimizeCallback = useImageStore(
    (state) => state.setOptimizeCallback
  );
  const {
    format,
    widths,
    customWidth,
    quality,
    preventUpscaling,
    preserveAspectRatio,
    preserveMetadata,
  } = useSidebarStore();

  const handleDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const newImages: ImageFile[] = [];

      for (const file of acceptedFiles) {
        if (!isValidImageFile(file)) continue;

        try {
          const preview = await createImagePreview(file);
          const dimensions = await getImageDimensions(file);

          newImages.push({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview,
            state: "idle",
            progress: 0,
            originalSize: file.size,
            dimensions,
          });
        } catch (error) {
          console.error("Error processing file:", error);
        }
      }

      addImages(newImages);
    },
    [addImages]
  );

  const handleOptimize = React.useCallback(async () => {
    const idleImages = images.filter((img) => img.state === "idle");
    const allWidths = [...widths, ...(customWidth ? [customWidth] : [])].sort(
      (a, b) => a - b
    );

    if (allWidths.length === 0) {
      return;
    }

    for (const image of idleImages) {
      updateImage(image.id, { state: "processing", progress: 0 });

      try {
        const optimizedVersions: Array<{
          width: number;
          dataUrl: string;
          size: number;
          format: string;
        }> = [];

        for (let i = 0; i < allWidths.length; i++) {
          const width = allWidths[i];
          const formData = new FormData();
          formData.append("file", image.file);
          formData.append("width", width.toString());
          formData.append("quality", quality.toString());
          formData.append("format", format);
          formData.append(
            "preserveAspectRatio",
            preserveAspectRatio.toString()
          );
          formData.append("preventUpscaling", preventUpscaling.toString());
          formData.append("removeMetadata", (!preserveMetadata).toString());

          const response = await fetch("/api/optimize", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Optimization failed");
          }

          const result = await response.json();

          optimizedVersions.push({
            width,
            dataUrl: result.dataUrl,
            size: result.optimizedSize,
            format: result.format,
          });

          const progress = Math.round(((i + 1) / allWidths.length) * 100);
          updateImage(image.id, {
            progress,
            optimizedVersions: [...optimizedVersions],
          });
        }

        updateImage(image.id, {
          state: "complete",
          progress: 100,
          optimizedVersions,
        });
      } catch (error) {
        console.error("Error optimizing image:", error);
        updateImage(image.id, {
          state: "error",
          progress: 0,
        });
      }
    }
  }, [
    images,
    updateImage,
    format,
    widths,
    customWidth,
    quality,
    preventUpscaling,
    preserveAspectRatio,
    preserveMetadata,
  ]);

  const handleDownload = React.useCallback(
    async (
      image: ImageFile,
      version?: { width: number; dataUrl: string; format: string }
    ) => {
      try {
        const dataUrl = version?.dataUrl || image.preview;
        const originalName = image.file.name;
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
        const extension = version?.format
          ? version.format.split("/")[1]?.split(";")[0] || "webp"
          : originalName.split(".").pop() || "jpg";
        const widthSuffix = version ? `-${version.width}w` : "";

        if (dataUrl.startsWith("data:")) {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${nameWithoutExt}${widthSuffix}-isolay.${extension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${nameWithoutExt}${widthSuffix}-isolay.${extension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    },
    []
  );

  React.useEffect(() => {
    setOptimizeCallback(handleOptimize);
  }, [handleOptimize, setOptimizeCallback]);

  return (
    <div className="flex flex-col">
      <div className="flex-1 pb-8 pt-24">
        <div className=" space-y-8 flex-1 overflow-y-auto">
          {images.length === 0 ? (
            <DropZone onDrop={handleDrop} />
          ) : (
            <>
              <div className="mb-8">
                <DropZone onDrop={handleDrop} />
              </div>

              <div className="space-y-8">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-2 truncate">
                            {image.file.name}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {image.dimensions && (
                              <span>
                                {image.dimensions.width} ×{" "}
                                {image.dimensions.height}
                              </span>
                            )}
                            <span>{formatFileSize(image.originalSize)}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImage(image.id)}
                          className="shrink-0"
                        >
                          <MdClose className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3">
                          Original Image
                        </h3>
                        <div className="max-w-md">
                          <ImageCard
                            image={{
                              src: image.preview,
                              alt: image.file.name,
                            }}
                            state={image.state}
                            progress={image.progress}
                          />
                        </div>
                      </div>

                      {image.optimizedVersions &&
                        image.optimizedVersions.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-4">
                              Optimized Versions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {image.optimizedVersions.map((version) => (
                                <div
                                  key={`${image.id}-${version.width}`}
                                  className="relative group"
                                >
                                  <ImageCard
                                    image={{
                                      src: version.dataUrl,
                                      alt: `${image.file.name} - ${version.width}w`,
                                    }}
                                    title={`${version.width}px`}
                                    metadata={
                                      <div className="space-y-1">
                                        <div className="text-success font-medium">
                                          {formatFileSize(version.size)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {Math.round(
                                            ((image.originalSize -
                                              version.size) /
                                              image.originalSize) *
                                              100
                                          )}
                                          % smaller
                                        </div>
                                      </div>
                                    }
                                    state="complete"
                                    actions={
                                      <div className="flex gap-2 w-full">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(image, version);
                                          }}
                                          className="flex-1"
                                        >
                                          <MdDownload className="h-3 w-3 mr-2" />
                                          Download
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeOptimizedVersion(
                                              image.id,
                                              version.width
                                            );
                                          }}
                                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                          <MdDelete className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {image.state === "idle" && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground text-center">
                            Click "Optimize Images" in the sidebar to generate
                            optimized versions
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card
                className="border-dashed cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.multiple = true;
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const files = Array.from(
                      (e.target as HTMLInputElement).files || []
                    );
                    handleDrop(files);
                  };
                  input.click();
                }}
              >
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                    <MdImage className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Add More Images
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click to browse or drag and drop
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
