import { create } from "zustand";
import type { ImageCardState } from "@/components/ImageCard";

export interface OptimizedVersion {
  width: number;
  dataUrl: string;
  size: number;
  format: string;
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  state: ImageCardState;
  progress: number;
  originalSize: number;
  optimizedVersions?: OptimizedVersion[];
  dimensions?: { width: number; height: number };
}

interface ImageState {
  images: ImageFile[];
  optimizeCallback: (() => void) | null;
  addImages: (images: ImageFile[]) => void;
  removeImage: (id: string) => void;
  removeOptimizedVersion: (imageId: string, width: number) => void;
  updateImage: (id: string, updates: Partial<ImageFile>) => void;
  setOptimizeCallback: (callback: () => void) => void;
  optimize: () => void;
  clearImages: () => void;
}

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  optimizeCallback: null,
  addImages: (newImages) =>
    set((state) => ({
      images: [...state.images, ...newImages],
    })),
  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),
  removeOptimizedVersion: (imageId, width) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId
          ? {
              ...img,
              optimizedVersions: img.optimizedVersions?.filter(
                (v) => v.width !== width
              ),
            }
          : img
      ),
    })),
  updateImage: (id, updates) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    })),
  setOptimizeCallback: (callback) => set({ optimizeCallback: callback }),
  optimize: () => {
    const { optimizeCallback } = get();
    optimizeCallback?.();
  },
  clearImages: () => set({ images: [] }),
}));


