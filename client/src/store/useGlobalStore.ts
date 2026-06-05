import { create } from "zustand";

interface GlobalStoreState {
  searchInput: string;
  setSearchInput: (searchValue: string) => void;
}

export const useGlobalStore = create<GlobalStoreState>((set) => ({
  searchInput: "",

  setSearchInput: (searchValue: string) => {
    set({ searchInput: searchValue });
  },
}));
