import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer/footer";
import { Toaster } from "sonner";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/30 relative overflow-hidden">
      {/* Cinematic Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505533054827-1cb0ce115393?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]"></div>
      </div>

      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer locale={locale} />
      <Toaster richColors position="top-center" theme="dark" duration={3000} />
    </div>
  );
}