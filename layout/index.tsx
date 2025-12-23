"use client";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useImageStore } from "@/lib/stores/image-store";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    format,
    setFormat,
    widths,
    toggleWidth,
    customWidth,
    setCustomWidth,
    quality,
    setQuality,
    preventUpscaling,
    setPreventUpscaling,
    preserveAspectRatio,
    setPreserveAspectRatio,
    preserveMetadata,
    setPreserveMetadata,
    isMobileOpen,
    setMobileOpen,
    reset,
  } = useSidebarStore();

  const optimize = useImageStore((state) => state.optimize);
  const images = useImageStore((state) => state.images);

  const sidebarContent = (
    <Sidebar
      format={format}
      onFormatChange={setFormat}
      widths={widths}
      onWidthToggle={toggleWidth}
      customWidth={customWidth}
      onCustomWidthChange={setCustomWidth}
      quality={quality}
      onQualityChange={setQuality}
      preventUpscaling={preventUpscaling}
      onPreventUpscalingChange={setPreventUpscaling}
      preserveAspectRatio={preserveAspectRatio}
      onPreserveAspectRatioChange={setPreserveAspectRatio}
      preserveMetadata={preserveMetadata}
      onPreserveMetadataChange={setPreserveMetadata}
      onOptimize={() => {
        optimize();
        setMobileOpen(false);
      }}
      onReset={reset}
      hasImages={images.length > 0}
    />
  );

  return (
    <div className="flex h-screen bg-primary-background overflow-hidden">
      <div
        className={cn(
          "flex flex-col flex-1 min-h-screen transition-all duration-300 overflow-x-hidden",
          "lg:mr-[360px]"
        )}
      >
        <Header />
        <main className="overflow-y-auto px-4 md:px-11 pb-4 md:pb-6 pt-2">
          {children}
        </main>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed right-0 top-0 h-screen w-[360px] z-10">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full sm:w-[360px] p-0">
          <SheetTitle className="sr-only">Optimization Settings</SheetTitle>
          <div className="h-full">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Layout;
