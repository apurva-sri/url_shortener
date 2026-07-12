export const LANDING_STATS = [
  { value: "10,547,000+", label: "Links Shortened" },
  { value: "542,900+", label: "Total Redirects" },
  { value: "15,400+", label: "Active Creators" },
];

export const LANDING_FAQS = [
  {
    q: "How does the short link redirection work?",
    a: "When a visitor opens a LinkPilot short link, our fast caching layer resolves the destination URL from our database. If the link is active and open, the visitor is redirected immediately. If it's password protected, they are prompted to verify first.",
  },
  {
    q: "Can I customize the QR code with my branding?",
    a: "Yes! Our built-in QR Code Generator allows you to choose foreground and background colors, apply design shapes, and overlay the signature LinkPilot paper-plane logo in the center. You can download the result in high-quality PNG or SVG vector formats.",
  },
  {
    q: "Is password protection secure?",
    a: "Extremely secure. Passwords are salted and hashed on our backend using bcrypt. Redirections are only unlocked after successful verification, and we log click metrics for analytics securely.",
  },
  {
    q: "What is the difference between Free and Pro plans?",
    a: "Our Free plan includes basic URL shortening and standard QR codes. The Pro plan unlocks custom aliases, password-protected links, personalized branded QR codes, and deep analytics (such as browser, device, and visitor logs).",
  },
];
