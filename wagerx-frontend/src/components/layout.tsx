import { Navbar } from "@/components/navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#140C1F] ">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}
