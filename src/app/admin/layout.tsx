// src/app/admin/layout.tsx

import { Header } from "@/components/Layouts/header";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-full bg-gray-2 dark:bg-gradient-to-t from-[#2C2C2C] to-[#181A20]">
        <Header />
        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

