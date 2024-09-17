"use client";
import { createContext, useState, useContext, ReactNode } from "react";

interface SearchContextType {
  search: string;
  setSearch: (search: string) => void;
  isLikedOrDislikeState: Boolean;
  setIsLikedOrDislikeState: (search: Boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [search, setSearch] = useState<string>("");
  const [isLikedOrDislikeState, setIsLikedOrDislikeState] =
    useState<Boolean>(false);

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        isLikedOrDislikeState,
        setIsLikedOrDislikeState,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
