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
      <div className="fixed inset-0 z-0 bg-black" />

      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer locale={locale} />
      <Toaster richColors position="top-center" theme="dark" duration={3000} />
    </div>
  );
}