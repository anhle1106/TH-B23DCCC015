import { create } from 'zustand';

/**
 * ============================================================================
 * PHẦN A: QUẢN LÝ STATE - GHIM BÀI TẬP BẰNG ZUSTAND
 * ============================================================================
 * - pinnedIds: danh sách ID bài tập được ghim lên đầu
 * - togglePin(id): ghim hoặc bỏ ghim bài tập
 * - isPinned(id): kiểm tra xem bài tập có đang được ghim hay không
 * Không đưa state này vào Redux vì đây là UI state đơn giản, cục bộ.
 */

export interface PinState {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
  clearPins: () => void;
}

export const usePinStore = create<PinState>((set, get) => ({
  pinnedIds: [],
  togglePin: (id: string) => {
    set((state) => {
      const alreadyPinned = state.pinnedIds.includes(id);
      return {
        pinnedIds: alreadyPinned
          ? state.pinnedIds.filter((pinnedId) => pinnedId !== id)
          : [id, ...state.pinnedIds],
      };
    });
  },
  isPinned: (id: string) => get().pinnedIds.includes(id),
  clearPins: () => set({ pinnedIds: [] }),
}));
