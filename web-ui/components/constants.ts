/** biome-ignore-all assist/source/organizeImports: false positive */
const GITHUB_REPO = "https://github.com/drewsephski/trace";
const PURCHASE_URL = "/pay?plan=enterprise";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LOGO_SRC = "/trace.png";

const captions = [
  "Welcome to Trace — your recordings will never be the same",
  "Auto zoom follows your every move",
  "Smart captions generated on-device",
  "Smooth cursor effects, automatically",
];

const comparisonRows: [string, string, string][] = [
  ["Price", "$9 once", "$29/month"],
  ["Windows", "✓", "✗"],
  ["Linux", "✓", "✗"],
  ["macOS", "✓", "✓"],
  ["AI Auto Zoom", "✓", "✓"],
  ["AI Captions / Subtitles", "✓", "✓"],
  ["Cursor Effects", "✓ Enhanced", "Basic"],
  ["Local / On-Device AI", "✓", "✓"],
  ["Open Source", "✓ MIT", "✗ Closed"],
  ["Export 4K 60fps", "✓", "✓"],
  ["GIF Export", "✓", "✓"],
  ["Lifetime Ownership", "✓", "Subscription only"],
];

const faqItems = [
  {
    q: "How is Trace different from Screen Studio?",
    a: "Trace costs $9 once instead of $29/month. We run on Windows, macOS, and Linux — Screen Studio is macOS only. We offer AI-powered captions and enhanced cursor effects, all processed locally on your machine. Our core is MIT-licensed open source. Same professional output, radically different philosophy.",
  },
  {
    q: "Why is it only $9? What's the catch?",
    a: "No catch. Trace is indie-built with no investors, no cloud infrastructure to fund, and no sales team to pay. We sell software directly to users. $9 is a fair price for a polished app that you own forever. The open-source core is free if you want to build it yourself — $9 is for the convenience of signed builds, auto-updates, and priority support.",
  },
  {
    q: "Is it as polished as Screen Studio?",
    a: "Trace produces the same quality output — 4K 60fps, smooth auto zooms, motion blur, professional captions. Our interface is designed for speed: record, auto-enhance, and export in minutes. The best way to judge is to try it. If it doesn't meet your standards, we'll refund it.",
  },
  {
    q: "Does it work on Windows and Linux?",
    a: "Yes. Trace is built with Electron and runs natively on macOS (Intel + Apple Silicon), Windows 10+, and most Linux distributions. The same features, the same quality, on every platform. Screen Studio is macOS-only.",
  },
  {
    q: "Are future updates included?",
    a: "Yes. Your $9 purchase includes all future updates — forever. No upgrade fees, no renewal, no version 2.0 that you have to buy again. When we ship new features, you get them.",
  },
  {
    q: "Can I use it commercially?",
    a: "Absolutely. The paid version is a standard commercial license. The open-source core is MIT licensed, which permits commercial use, modification, and redistribution. Use Trace to create product demos, tutorials, social media content, client work — anything you want.",
  },
];

export { GITHUB_REPO, PURCHASE_URL, easeOut, LOGO_SRC, captions, comparisonRows, faqItems };
