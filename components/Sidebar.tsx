"use client";

import * as React from "react";
import { MdAdd } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ImageFormat = "jpeg" | "png" | "webp" | "avif" | "gif" | "tiff";

interface SidebarProps {
  className?: string;
  format?: ImageFormat;
  onFormatChange?: (format: ImageFormat) => void;
  widths?: number[];
  onWidthToggle?: (width: number) => void;
  customWidth?: number | null;
  onCustomWidthChange?: (width: number | null) => void;
  quality?: number;
  onQualityChange?: (quality: number) => void;
  preventUpscaling?: boolean;
  onPreventUpscalingChange?: (prevent: boolean) => void;
  preserveAspectRatio?: boolean;
  onPreserveAspectRatioChange?: (preserve: boolean) => void;
  preserveMetadata?: boolean;
  onPreserveMetadataChange?: (preserve: boolean) => void;
  onOptimize?: () => void;
  onReset?: () => void;
  hasImages?: boolean;
}

export function Sidebar({
  className,
  format = "jpeg",
  onFormatChange,
  widths = [400, 800],
  onWidthToggle,
  customWidth = null,
  onCustomWidthChange,
  quality = 80,
  onQualityChange,
  preventUpscaling = true,
  onPreventUpscalingChange,
  preserveAspectRatio = true,
  onPreserveAspectRatioChange,
  preserveMetadata = false,
  onPreserveMetadataChange,
  onOptimize,
  onReset,
  hasImages = false,
}: SidebarProps) {
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customWidthValue, setCustomWidthValue] = React.useState("");

  const predefinedWidths = [400, 800, 1200, 1600];

  const handleCustomWidthSubmit = () => {
    const width = parseInt(customWidthValue);
    if (width > 0) {
      onCustomWidthChange?.(width);
      setShowCustomInput(false);
      setCustomWidthValue("");
    }
  };

  const handleRemoveCustomWidth = () => {
    onCustomWidthChange?.(null);
    setShowCustomInput(false);
    setCustomWidthValue("");
  };
  return (
    <aside
      className={cn(
        "w-full  h-full",
        "bg-card",
        "flex flex-col pt-14",
        className
      )}
    >
      <div className="border-b border-input px-4 sm:px-5 py-4 sm:py-5 pt-14 lg:pt-5">
        <h2 className="text-lg font-semibold text-foreground">
          Optimization Settings
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5 space-y-6 sm:space-y-8">
        <div className="space-y-3">
          <Label htmlFor="format">Output Format</Label>
          <div className="flex gap-2 flex-wrap">
            {(
              ["jpeg", "png", "webp", "avif", "gif", "tiff"] as ImageFormat[]
            ).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => onFormatChange?.(fmt)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-full border transition-colors",
                  format === fmt
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-transparent border-input text-secondary hover:border-primary/50"
                )}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Resize Widths (px)</Label>
          <div className="flex gap-2 flex-wrap">
            {predefinedWidths.map((width) => (
              <button
                key={width}
                type="button"
                onClick={() => onWidthToggle?.(width)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-full border transition-colors",
                  widths.includes(width)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-transparent border-input text-secondary hover:border-primary/50"
                )}
              >
                {width}
              </button>
            ))}
            {customWidth ? (
              <button
                type="button"
                onClick={handleRemoveCustomWidth}
                className="px-3 py-1.5 text-xs font-bold rounded-full border border-primary bg-primary text-primary-foreground"
              >
                {customWidth}
              </button>
            ) : showCustomInput ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={customWidthValue}
                  onChange={(e) => setCustomWidthValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCustomWidthSubmit();
                    } else if (e.key === "Escape") {
                      setShowCustomInput(false);
                      setCustomWidthValue("");
                    }
                  }}
                  className="w-20 h-8 text-xs"
                  placeholder="px"
                  autoFocus
                  min={1}
                  max={10000}
                />
                <Button
                  size="sm"
                  onClick={handleCustomWidthSubmit}
                  className="h-8 px-2 text-xs"
                >
                  Add
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-dashed border-input text-secondary hover:border-primary/50 flex items-center gap-1"
              >
                <MdAdd className="h-3 w-3" />
                Custom
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="quality">Quality: {quality}%</Label>
          </div>
          <Slider
            id="quality"
            min={1}
            max={100}
            value={[quality]}
            onValueChange={(value) => onQualityChange?.(value[0])}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="prevent-upscaling"
                  className="text-sm font-semibold"
                >
                  Prevent Upscaling
                </Label>
                <p className="text-xs text-muted-foreground">
                  Do not enlarge smaller images
                </p>
              </div>
              <Switch
                id="prevent-upscaling"
                checked={preventUpscaling}
                onCheckedChange={onPreventUpscalingChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="preserve-aspect"
                  className="text-sm font-semibold"
                >
                  Keep Aspect Ratio
                </Label>
                <p className="text-xs text-muted-foreground">
                  Maintain original proportions
                </p>
              </div>
              <Switch
                id="preserve-aspect"
                checked={preserveAspectRatio}
                onCheckedChange={onPreserveAspectRatioChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="preserve-metadata"
                  className="text-sm font-semibold"
                >
                  Preserve Metadata
                </Label>
                <p className="text-xs text-muted-foreground">
                  Keep EXIF and copyright data
                </p>
              </div>
              <Switch
                id="preserve-metadata"
                checked={preserveMetadata}
                onCheckedChange={onPreserveMetadataChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-input px-4 sm:px-5 py-4 sm:py-5 space-y-2">
        <Button
          onClick={onOptimize}
          disabled={!hasImages}
          className="w-full font-bold"
        >
          Optimize Images
        </Button>
        <Button variant="outline" onClick={onReset} className="w-full">
          Reset Settings
        </Button>
      </div>
    </aside>
  );
}
