import { create } from "zustand";
import type { ImageFormat } from "@/components/Sidebar";

interface SidebarState {
  format: ImageFormat;
  widths: number[];
  customWidth: number | null;
  quality: number;
  preventUpscaling: boolean;
  preserveAspectRatio: boolean;
  preserveMetadata: boolean;
  isMobileOpen: boolean;
  setFormat: (format: ImageFormat) => void;
  toggleWidth: (width: number) => void;
  setCustomWidth: (width: number | null) => void;
  setQuality: (quality: number) => void;
  setPreventUpscaling: (prevent: boolean) => void;
  setPreserveAspectRatio: (preserve: boolean) => void;
  setPreserveMetadata: (preserve: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  reset: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  format: "jpeg",
  widths: [400, 800],
  customWidth: null,
  quality: 80,
  preventUpscaling: true,
  preserveAspectRatio: true,
  preserveMetadata: false,
  isMobileOpen: false,
  setFormat: (format) => set({ format }),
  toggleWidth: (width) =>
    set((state) => ({
      widths: state.widths.includes(width)
        ? state.widths.filter((w) => w !== width)
        : [...state.widths, width].sort((a, b) => a - b),
    })),
  setCustomWidth: (width) => set({ customWidth: width }),
  setQuality: (quality) => set({ quality }),
  setPreventUpscaling: (prevent) => set({ preventUpscaling: prevent }),
  setPreserveAspectRatio: (preserve) => set({ preserveAspectRatio: preserve }),
  setPreserveMetadata: (preserve) => set({ preserveMetadata: preserve }),
  setMobileOpen: (open) => set({ isMobileOpen: open }),
  reset: () =>
    set({
      format: "jpeg",
      widths: [400, 800],
      customWidth: null,
      quality: 80,
      preventUpscaling: true,
      preserveAspectRatio: true,
      preserveMetadata: false,
    }),
}));
