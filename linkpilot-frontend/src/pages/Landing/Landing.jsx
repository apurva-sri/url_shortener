import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Link2,
  Lock,
  QrCode,
  BarChart3,
  Globe,
  Check,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
  Code,
  CheckCircle,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar/Navbar.jsx";
import Hero from "../../components/landing/Hero/Hero.jsx";
import Marquee from "../../components/landing/Marquee/Marquee.jsx";
import Button from "../../components/common/Button/Button.jsx";

// Import landing configuration stats and FAQs
import { LANDING_STATS, LANDING_FAQS } from "../../config/landing.config.js";

export default function Landing() {
  const [billingPeriod, setBillingPeriod] = useState("monthly"); // monthly or annual
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="bg-paper min-h-screen text-ink overflow-x-hidden font-display">
      <Navbar />
      <Hero />
      <Marquee />

      {/* Features Grid Section - Styled exactly like the Realrun mockup */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-50 px-3 py-1 rounded-full">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mt-4 tracking-tight">
            Built for Professional Link Management
          </h2>
          <p className="text-slate text-sm sm:text-base mt-2.5">
            Everything you need to pilot your marketing campaigns with absolute confidence.
          </p>
        </div>

        {/* 6-Card Grid Layout matching mockup layout */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Custom Aliases */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition min-h-[220px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-50 text-accent">
                  <Link2 size={16} />
                </div>
                <h3 className="font-display font-bold text-sm text-ink">Custom Branding & Aliases</h3>
              </div>
              <p className="text-xs text-slate leading-relaxed max-w-md">
                Create highly recognizable short URLs. Replace random character strings with clean, custom branding keywords.
              </p>
            </div>
            
            {/* Visual Mockup */}
            <div className="mt-4 rounded-xl border border-line bg-mist/40 p-4 space-y-2 select-none">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate">
                <span>DESTINATION</span>
                <span>SHORTCODE</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs font-semibold text-ink">
                <span className="truncate max-w-[200px] text-slate font-medium">github.com/apurva-sri/url_shortener</span>
                <span className="text-accent bg-accent-50 border border-accent/20 px-2 py-0.5 rounded font-mono">/lp-repo</span>
              </div>
            </div>
          </div>

          {/* Card 2: Password Protection */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition min-h-[220px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-50 text-accent">
                  <Shield size={16} />
                </div>
                <h3 className="font-display font-bold text-sm text-ink">Password Lock Access</h3>
              </div>
              <p className="text-xs text-slate leading-relaxed max-w-md">
                Lock your campaigns. Protect files and restricted redirect endpoints behind dynamic password verification forms.
              </p>
            </div>

            {/* Visual Mockup */}
            <div className="mt-4 rounded-xl border border-line bg-white p-4 flex items-center justify-between shadow-xs select-none">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={18} />
                <span className="text-xs font-bold text-ink">Security Protocol</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                Active BCrypt Hashing
              </span>
            </div>
          </div>

          {/* Card 3: Real-Time Analytics */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition min-h-[220px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-50 text-accent">
                  <BarChart3 size={16} />
                </div>
                <h3 className="font-display font-bold text-sm text-ink">Audience Insights</h3>
              </div>
              <p className="text-xs text-slate leading-relaxed max-w-md">
                Track visitor count, browsers, and location metrics. Know who clicked and when with detailed access logs.
              </p>
            </div>

            {/* Visual Mockup */}
            <div className="mt-4 rounded-xl border border-line bg-white p-4 space-y-2 select-none">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate">
                <span>DAILY TREND</span>
                <span className="text-emerald-600 font-semibold bg-emerald-50 px-1 rounded">+18.8%</span>
              </div>
              <div className="flex items-end gap-1.5 h-10 pt-1.5">
                <div className="w-full bg-accent/25 rounded-t h-4" />
                <div className="w-full bg-accent/40 rounded-t h-7" />
                <div className="w-full bg-accent/30 rounded-t h-5" />
                <div className="w-full bg-accent rounded-t h-9" />
                <div className="w-full bg-accent/65 rounded-t h-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Branded QR Codes */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition min-h-[220px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-50 text-accent">
                  <QrCode size={16} />
                </div>
                <h3 className="font-display font-bold text-sm text-ink">Branded QR Code Creator</h3>
              </div>
              <p className="text-xs text-slate leading-relaxed max-w-md">
                Generate high-quality vector QR codes. Add custom colors, dot presets, and display branding center logos.
              </p>
            </div>

            {/* Visual Mockup */}
            <div className="mt-4 rounded-xl border border-line bg-mist/30 p-3 flex items-center justify-between select-none">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate block">COLOR PALETTE</span>
                <div className="flex gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-ink border border-line" />
                  <span className="w-3.5 h-3.5 rounded-full bg-accent border border-line" />
                  <span className="w-3.5 h-3.5 rounded-full bg-white border border-line" />
                </div>
              </div>
              <div className="h-10 w-10 bg-white border border-line rounded flex items-center justify-center relative shadow-xxs">
                <div className="grid grid-cols-4 gap-0.5 p-0.5 w-full h-full opacity-60">
                  {[...Array(16)].map((_, i) => (
                    <span key={i} className={`rounded-sm ${(i * 3) % 2 === 0 ? "bg-ink" : "bg-transparent"}`} />
                  ))}
                </div>
                <img src="/logo/linkpilot-mark.svg" className="absolute w-2.5 h-2.5 bg-white p-0.5 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Card 5: Developer API Key */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition min-h-[220px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-50 text-accent">
                  <Code size={16} />
                </div>
                <h3 className="font-display font-bold text-sm text-ink">Developer API Gate</h3>
              </div>
              <p className="text-xs text-slate leading-relaxed max-w-md">
                Deploy fast integrations. Create link assets and retrieve statistics programmatically via dynamic token keys.
              </p>
            </div>

            {/* Visual Mockup */}
            <div className="mt-4 rounded-xl border border-line bg-ink p-3.5 font-mono text-[10px] text-zinc-300 select-none">
              <div className="text-zinc-500 font-semibold">// POST /api/url</div>
              <div><span className="text-emerald-400">"alias"</span>: <span className="text-amber-300">"lp-dev"</span>,</div>
              <div><span className="text-emerald-400">"destination"</span>: <span className="text-amber-300">"linkpilot.to"</span></div>
            </div>
          </div>

          {/* Card 6: Custom Domain Verify */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition min-h-[220px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-50 text-accent">
                  <Globe size={16} />
                </div>
                <h3 className="font-display font-bold text-sm text-ink">Branded Domains</h3>
              </div>
              <p className="text-xs text-slate leading-relaxed max-w-md">
                Route short codes through your own custom domains. Point your CNAME record to LinkPilot to unify branding.
              </p>
            </div>

            {/* Visual Mockup */}
            <div className="mt-4 rounded-xl border border-line bg-white p-3 shadow-xs space-y-1.5 select-none text-[10px]">
              <div className="flex justify-between border-b border-line pb-1 font-bold text-slate">
                <span>RECORD TYPE</span>
                <span>TARGET HOST</span>
              </div>
              <div className="flex justify-between font-mono text-ink">
                <span>CNAME</span>
                <span className="font-semibold text-accent">cname.linkpilot.to</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Styled matching "Realrun by the Numbers" */}
      <section className="bg-white border-t border-b border-line py-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight uppercase">
            LinkPilot by the Numbers
          </h2>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            {LANDING_STATS.map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-slate font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-50 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mt-4 tracking-tight">
            Plans built for creators of all sizes.
          </h2>
          
          {/* Billing Switcher */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingPeriod === "monthly" ? "text-ink" : "text-slate"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none bg-ink"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  billingPeriod === "annual" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingPeriod === "annual" ? "text-ink" : "text-slate"}`}>
              Annually <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Free Plan */}
          <PricingCard
            title="Free Plan"
            price="0"
            description="Perfect for starting out and basic shortening needs."
            features={[
              "Unlimited shortened links",
              "Standard black & white QR codes",
              "Basic redirection logs",
              "1 active project",
            ]}
            ctaText="Start for free"
            ctaLink="/register"
            billingPeriod={billingPeriod}
          />

          {/* Pro Plan */}
          <PricingCard
            title="Pro Plan"
            price={billingPeriod === "monthly" ? "19" : "15"}
            description="For growing brands who need advanced tracking & design."
            features={[
              "Custom aliases & tags",
              "Password protection on links",
              "Branded customized QR codes",
              "Deep device/visitor analytics",
              "Custom domains integration",
            ]}
            ctaText="Upgrade to Pro"
            ctaLink="/register"
            popular={true}
            billingPeriod={billingPeriod}
          />

          {/* Enterprise */}
          <PricingCard
            title="Enterprise"
            price="Custom"
            description="For businesses requiring absolute scale and SLAs."
            features={[
              "High volume click capacity",
              "Dedicated API access key",
              "SSO & advanced security settings",
              "Custom contracts & SLAs",
              "24/7 dedicated support",
            ]}
            ctaText="Contact sales"
            ctaLink="mailto:support@linkpilot.to"
            billingPeriod={billingPeriod}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white border-t border-b border-line">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-ink text-center tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate text-sm text-center mt-2">
            Got questions? We have answers.
          </p>

          <div className="mt-12 divide-y divide-line">
            {LANDING_FAQS.map((faq, i) => (
              <div key={i} className="py-4 font-display">
                <button
                  onClick={() => toggleFaq(i)}
                  className="flex w-full items-center justify-between text-left font-semibold text-ink hover:text-accent transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate transition-transform duration-200 ${
                      activeFaq === i ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                {activeFaq === i && (
                  <p className="mt-2.5 text-sm text-slate leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 max-w-7xl mx-auto font-display text-sm text-slate">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-line pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/logo/linkpilot-mark.svg" alt="LinkPilot" className="h-7 w-7" />
              <span className="font-display text-lg font-bold text-ink">LinkPilot</span>
            </div>
            <p className="text-xs leading-relaxed max-w-[200px]">
              Shorter links. Smarter growth. Branded QR assets & analytics.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-accent">Features</a></li>
              <li><a href="#pricing" className="hover:text-accent">Pricing</a></li>
              <li><Link to="/register" className="hover:text-accent">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-accent">Blog</a></li>
              <li><a href="#" className="hover:text-accent">Documentation</a></li>
              <li><a href="#" className="hover:text-accent">Redirection API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-3">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-accent">About Us</a></li>
              <li><a href="#" className="hover:text-accent">Careers</a></li>
              <li><a href="#" className="hover:text-accent">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} LinkPilot. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent-50 text-accent mb-4">
        <Icon size={18} />
      </div>
      <h3 className="font-display text-sm font-bold text-ink">{title}</h3>
      <p className="text-xs text-slate mt-2 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, description, features, ctaText, ctaLink, popular = false, billingPeriod }) {
  return (
    <div
      className={`rounded-2xl border p-8 shadow-sm flex flex-col relative ${
        popular ? "border-accent bg-white ring-1 ring-accent" : "border-line bg-white"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
          Most Popular
        </span>
      )}
      <h3 className="font-display text-base font-bold text-ink">{title}</h3>
      <p className="mt-2 text-xs text-slate leading-relaxed min-h-[40px]">{description}</p>

      <div className="mt-5 flex items-baseline text-ink">
        <span className="text-2xl font-black">{price !== "Custom" ? "$" : ""}</span>
        <span className="text-4xl font-black tracking-tight">{price}</span>
        <span className="ml-1 text-xs text-slate font-medium">
          {price === "Custom" ? "" : billingPeriod === "monthly" ? "/mo" : "/mo, billed annually"}
        </span>
      </div>

      <div className="mt-6 flex-1">
        <ul className="space-y-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate">
              <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        {ctaLink.startsWith("mailto:") ? (
          <a href={ctaLink}>
            <Button variant={popular ? "default" : "outline"} className="w-full">
              {ctaText}
            </Button>
          </a>
        ) : (
          <Link to={ctaLink}>
            <Button variant={popular ? "default" : "outline"} className="w-full">
              {ctaText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
