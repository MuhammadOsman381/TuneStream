import ArtistNavBar from "@/components/ArtistNavBar";
import React, { ReactNode } from "react";
import { SearchProvider } from "../context/SearchContext";
import UserNavBar from "@/components/UserNavBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SearchProvider>
      <div className="bg-gray-200">
        <UserNavBar />
        <main className="mt-0 ">{children}</main>
      </div>
    </SearchProvider>
  );
};

export default Layout;
