export type SubService = {
  id: string;
  label: string;
  defaultDescription: string;
};

export type CoreService = {
  id: string;
  title: string;
  items: SubService[];
};

export const SERVICES_DATA: CoreService[] = [
  {
    id: "logo-identity",
    title: "Logo & Identity",
    items: [
      { id: "logo-concepts", label: "Concepts", defaultDescription: "Initial creative concepts and directions for the logo." },
      { id: "logo-color", label: "Color Palette", defaultDescription: "Carefully selected colors that align with brand values." },
      { id: "logo-typography", label: "Typography", defaultDescription: "Primary and secondary font selections for all communications." },
      { id: "logo-guidelines", label: "Logo Usage Guidelines", defaultDescription: "Comprehensive rules for logo application and spacing." }
    ]
  },
  {
    id: "branding",
    title: "Branding (Stationery & Print)",
    items: [
      { id: "brand-cards", label: "Business Cards", defaultDescription: "Custom designed double-sided business cards." },
      { id: "brand-letterhead", label: "Letterhead", defaultDescription: "Corporate letterhead design for official documents." },
      { id: "brand-envelope", label: "Envelope design", defaultDescription: "Matching envelope designs." },
      { id: "brand-flyer", label: "Flyer design", defaultDescription: "Promotional flyer design." },
      { id: "brand-brochure", label: "Brochure (Bi-fold/Tri-fold)", defaultDescription: "Informative high-quality brochure design." },
      { id: "brand-ppt", label: "Presentation Template (PPT/Keynote)", defaultDescription: "Branded slide templates for presentations." }
    ]
  },
  {
    id: "visual-social",
    title: "Visual Social Media",
    items: [
      { id: "social-profile", label: "Profile Kit (DP & Banners)", defaultDescription: "Profile pictures and cover banners for all platforms." },
      { id: "social-ig-post", label: "Instagram Post Templates", defaultDescription: "Reusable post templates for Instagram." },
      { id: "social-ig-story", label: "Story Templates", defaultDescription: "Engaging templates for Instagram and Facebook Stories." },
      { id: "social-highlights", label: "Highlight Covers", defaultDescription: "Custom icons for Instagram highlights." },
      { id: "social-linkedin", label: "LinkedIn Banner", defaultDescription: "Professional background banner for LinkedIn." }
    ]
  },
  {
    id: "illustrations",
    title: "Illustrations & Graphics",
    items: [
      { id: "illus-custom", label: "Custom Illustrations", defaultDescription: "Unique illustrations tailored to your brand style." },
      { id: "illus-icons", label: "Illustrated Icons", defaultDescription: "Custom illustrated icon sets for digital or print use." },
      { id: "illus-infographics", label: "Infographics", defaultDescription: "Visually engaging data storytelling graphics." },
      { id: "illus-characters", label: "Character Design", defaultDescription: "Brand mascots or character illustrations." },
      { id: "illus-lottie", label: "Lottie Animations", defaultDescription: "Lightweight animations for apps and websites." }
    ]
  },
  {
    id: "packaging",
    title: "Packaging",
    items: [
      { id: "pack-box", label: "Product Box Design", defaultDescription: "Custom box packaging design for products." },
      { id: "pack-label", label: "Label Design", defaultDescription: "Product labels with crucial information and branding." },
      { id: "pack-tags", label: "Hang-tags", defaultDescription: "Retail hang-tag designs." },
      { id: "pack-tissue", label: "Tissue Paper/Pattern Design", defaultDescription: "Custom repeating pattern for packaging tissue." },
      { id: "pack-thanks", label: "Thank You Cards", defaultDescription: "Inserts expressing gratitude to customers." }
    ]
  },
  {
    id: "merchandise",
    title: "Brand Merchandise",
    items: [
      { id: "merch-tshirt", label: "T-shirt design", defaultDescription: "Branded apparel design." },
      { id: "merch-tote", label: "Tote Bags", defaultDescription: "Eco-friendly tote bag graphics." },
      { id: "merch-mugs", label: "Mugs", defaultDescription: "Custom mug prints." },
      { id: "merch-cap", label: "Cap Design", defaultDescription: "Embroidered or printed cap designs." },
      { id: "merch-stickers", label: "Stickers", defaultDescription: "Die-cut promotional stickers." }
    ]
  },
  {
    id: "ux-ui",
    title: "UX/UI & Product Design",
    items: [
      { id: "ux-research", label: "User Research/Personas", defaultDescription: "In-depth user analysis and persona creation." },
      { id: "ux-wireframes", label: "Wireframes (Low-fidelity)", defaultDescription: "Structural layout planning without styling." },
      { id: "ux-mockups", label: "High-fidelity Mockups", defaultDescription: "Detailed visual representations of the final product." },
      { id: "ux-prototype", label: "Clickable Prototype", defaultDescription: "Interactive simulation of the user flow." },
      { id: "ux-icons", label: "Iconography", defaultDescription: "Custom icon sets for the digital interface." },
      { id: "app-system", label: "Design System/Style Guide", defaultDescription: "Comprehensive component library for developers." },
    ]
  },
  {
    id: "website",
    title: "Website Design",
    items: [
      { id: "web-landing", label: "Landing Page", defaultDescription: "High-converting single-page design." },
      { id: "web-interior", label: "Multiple Interior Pages", defaultDescription: "Design for About, Services, Contact, etc." },
      { id: "web-responsive", label: "Mobile Responsive Layouts", defaultDescription: "Optimized designs for tablets and mobile devices." },
      { id: "web-cms", label: "Blog/CMS Layouts", defaultDescription: "Template designs for content management systems." }
    ]
  },
  {
    id: "web-dev",
    title: "Web Application & SaaS Development",
    items: [
      { id: "web-frontend", label: "Frontend Development", defaultDescription: "Modern UI development using React, Vue or similar frameworks." },
      { id: "web-backend", label: "Backend Development", defaultDescription: "Robust server-side architecture and APIs." },
      { id: "web-saas", label: "SaaS Platform Development", defaultDescription: "End-to-end SaaS product development." },
      { id: "web-dashboard", label: "Admin Dashboard", defaultDescription: "Custom dashboards for analytics and control." },
      { id: "web-api", label: "API Development & Integration", defaultDescription: "Secure and scalable API services." },
      { id: "web-auth", label: "Authentication Systems", defaultDescription: "Login, roles, permissions, and security layers." }
    ]
  },
  {
    id: "ecommerce",
    title: "eCommerce Development",
    items: [
      { id: "ecom-store", label: "Online Store Development", defaultDescription: "Custom or Shopify/WooCommerce stores." },
      { id: "ecom-product", label: "Product Page Design", defaultDescription: "High-converting product layouts." },
      { id: "ecom-cart", label: "Cart & Checkout Flow", defaultDescription: "Optimized checkout experience." },
      { id: "ecom-payment", label: "Payment Gateway Integration", defaultDescription: "Secure payment integrations (Stripe, Razorpay, etc.)." },
      { id: "ecom-analytics", label: "eCommerce Analytics", defaultDescription: "Tracking performance and conversions." }
    ]
  },
  {
    id: "integrations",
    title: "Integrations & Automation",
    items: [
      { id: "int-analytics", label: "Google Analytics Integration", defaultDescription: "Setup and tracking configuration." },
      { id: "int-crm", label: "CRM Integration", defaultDescription: "HubSpot, Salesforce, or custom CRM integration." },
      { id: "int-payment", label: "Payment Integration", defaultDescription: "Stripe, Razorpay, PayPal integrations." },
      { id: "int-email", label: "Email Automation", defaultDescription: "Email workflows and marketing automation." },
      { id: "int-zapier", label: "Zapier/Automation Tools", defaultDescription: "Connecting apps and automating workflows." }
    ]
  },
  {
    id: "mobile-app",
    title: "Mobile Application",
    items: [
      { id: "app-ios", label: "iOS/Android UI Screens", defaultDescription: "Native app screen designs for both platforms." },
      { id: "app-store", label: "App Store Screenshots", defaultDescription: "Promotional graphics for the App Store and Google Play." },
      { id: "app-flutter", label: "Flutter App Development", defaultDescription: "Cross-platform apps using Flutter framework." },
      { id: "app-native", label: "Native iOS/Android Development", defaultDescription: "High-performance native mobile applications." },
      { id: "app-api", label: "API Integration", defaultDescription: "Seamless integration with backend services." },
      { id: "app-push", label: "Push Notifications", defaultDescription: "Real-time notifications and engagement systems." },
      { id: "app-deploy", label: "App Store Deployment", defaultDescription: "Publishing apps on App Store and Play Store." }
    ]
  }
];
