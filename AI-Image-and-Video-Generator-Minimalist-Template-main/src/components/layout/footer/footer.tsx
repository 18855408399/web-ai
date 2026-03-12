import { getDomain } from "@/config/domain";
import { Globe, Shield } from "lucide-react";

export default function Footer({ locale }: { locale: string }) {
  const domain = getDomain();

  return (
    <footer className="relative z-10 bg-black/80 backdrop-blur-2xl border-t border-white/10 pt-12 md:pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="text-2xl font-black tracking-tighter text-white drop-shadow-md">
              A<span className="text-white/70">I</span>O
            </div>
            <p className="text-white/50 mt-4 text-sm leading-relaxed max-w-sm">
              Make AI SaaS in days, simply and effortlessly. Powered by the
              latest generation models.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  href={`/${locale}#features`}
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}#pricing`}
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}#faq`}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  href={`/${locale}/text-to-image`}
                  className="hover:text-white transition-colors"
                >
                  AI Image Generator
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/dashboard`}
                  className="hover:text-white transition-colors"
                >
                  My Workspace
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  href="/legal/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/legal/terms-of-service"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 text-center md:text-left">
          <p>Copyright © 2025 AIO. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <a
              href={`mailto:support@${domain.replace("https://", "")}`}
              className="hover:text-white transition-colors"
            >
              support@{domain.replace("https://", "")}
            </a>
            <div className="flex gap-3 mt-2 sm:mt-0">
              <Globe className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
              <Shield className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}