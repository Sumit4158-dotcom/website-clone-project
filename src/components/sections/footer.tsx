"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

type LinkItem = {
  href: string;
  label: string;
};

type LinkColumnProps = {
  title: string;
  links: LinkItem[];
};

type InfoCardProps = {
  href: string;
  imgSrc: string;
  title: string;
  subtitle: string;
  isSvg?: boolean;
};

const FooterLinkColumn: React.FC<LinkColumnProps> = ({ title, links }) => (
  <div className="flex flex-col gap-3 md:gap-4">
    <h3 className="text-xs md:text-sm font-medium text-white">{title}</h3>
    <ul className="flex flex-col gap-2 md:gap-3">
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} className="text-xs md:text-sm text-muted-foreground hover:text-white transition-colors">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const InfoCard: React.FC<InfoCardProps> = ({ href, imgSrc, title, subtitle, isSvg = false }) => (
  <a href={href} className="block bg-card p-2 md:p-3 rounded-lg text-center flex flex-col items-center justify-start h-full">
    <div className="relative h-8 md:h-10 w-full mb-1 md:mb-2 flex items-center justify-center">
      <Image 
        src={imgSrc} 
        alt={title} 
        width={isSvg ? 80 : 60} 
        height={40} 
        className="object-contain h-8 md:h-10" 
      />
    </div>
    <p className="text-[10px] md:text-xs font-medium text-white leading-tight">{title}</p>
    <p className="text-[9px] md:text-[11px] text-muted-foreground leading-tight mt-0.5 md:mt-1">{subtitle}</p>
  </a>
);

const linkColumnsData: LinkColumnProps[] = [
  {
    title: "Gaming",
    links: [
      { href: "/bd/casino", label: "Casino" },
      { href: "/bd/slot", label: "Slots" },
      { href: "/bd/crash", label: "Crash" },
      { href: "/bd/table", label: "Table" },
      { href: "/bd/fishing", label: "Fishing" },
      { href: "/bd/arcade", label: "Arcade" },
      { href: "/bd/lottery", label: "Lottery" },
    ],
  },
  {
    title: "About Baji",
    links: [
      { href: "https://www.helpbaji.live/", label: "About Us" },
      { href: "https://www.helpbaji.live/privacy-policy/", label: "Privacy Policy" },
      { href: "https://www.helpbaji.live/terms-and-conditions/", label: "Terms & Conditions" },
      { href: "https://www.helpbaji.live/responsible-gaming/", label: "Responsible Gaming" },
      { href: "https://www.helpbaji.live/kyc/", label: "KYC" },
    ],
  },
  {
    title: "Features",
    links: [
      { href: "/bd/promotion", label: "Promotions" },
      { href: "/bd/vip", label: "VIP Club" },
      { href: "/bd/referral", label: "Referral" },
      { href: "/bd/ambassador", label: "Brand Ambassadors" },
      { href: "/bd/download", label: "APP Download" },
    ],
  },
  {
    title: "Help",
    links: [{ href: "https://www.bj88forum.com/", label: "BJ Forum" }],
  },
];

const sponsorsData: InfoCardProps[] = [
    { href: "/bd/en/sponsor?index=0", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/sponsor/afc-bournemouth.png?v=1758614201573&source=drccdnsrc", title: "AFC Bournemouth", subtitle: "Front of Shirt Partner 2024 - 2025" },
    { href: "/bd/en/sponsor?index=1", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/sponsor/bologna-fc-1909.png?v=1758614201573&source=drccdnsrc", title: "Bologna FC 1909", subtitle: "Betting Partner 2023 - 2024" },
    { href: "/bd/en/sponsor?index=2", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/sponsor/quetta-gladiators.png?v=1758614201573&source=drccdnsrc", title: "Quetta Gladiators", subtitle: "Titanium Sponsor 2023" },
    { href: "/bd/en/sponsor?index=3", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/sponsor/sunrisers-eastern-cape.png?v=1758614201573&source=drccdnsrc", title: "Sunrisers Eastern Cape", subtitle: "Title Sponsor 2023 - 2024" },
    { href: "/bd/en/sponsor?index=4", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/sponsor/deccan-gladiators.png?v=1758614201573&source=drccdnsrc", title: "Deccan Gladiators", subtitle: "Title Sponsor 2023 - 2024" },
    { href: "/bd/en/sponsor?index=6", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/sponsor/st-kitts-and-nevis-patriots.png?v=1758614201573&source=drccdnsrc", title: "St Kitts & Nevis Patriots", subtitle: "Principle Sponsor 2024 - 2025" },
    { href: "/bd/en/sponsor?index=7", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/sponsor/biratnagar-kings.png?v=1758614201573&source=drccdnsrc", title: "Biratnagar Kings", subtitle: "Back of Jersey Sponsor 2024 - 2025" },
];

const ambassadorsData: InfoCardProps[] = [
    { href: "/bd/en/ambassador?index=0", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/ambassador/mia-k.png?v=1758614201573&source=drccdnsrc", title: "Mia Khalifa", subtitle: "2024" },
    { href: "/bd/en/ambassador?index=1", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/ambassador/kevin-pietersen.png?v=1758614201573&source=drccdnsrc", title: "Kevin Pietersen", subtitle: "2024 - 2026" },
    { href: "/bd/en/ambassador?index=2", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/ambassador/amy-jacson.png?v=1758614201573&source=drccdnsrc", title: "Amy Jackson", subtitle: "2023 - 2024" },
    { href: "/bd/en/ambassador?index=3", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/ambassador/hansika.png?v=1758614201573&source=drccdnsrc", title: "Hansika Motwani", subtitle: "2023 - 2024" },
    { href: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/wasim-s-14.svg?", imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/wasim-s-14.svg?", title: "Wasim Akram", subtitle: "2024 - 2025", isSvg: true },
    { href: "/bd/en/ambassador?index=6", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/ambassador/chan-samart.png?v=1758614201573&source=drccdnsrc", title: "Chan Samart", subtitle: "2024 - 2025" },
    { href: "/bd/en/ambassador?index=7", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/ambassador/keya-akter-payel.png?v=1758614201573&source=drccdnsrc", title: "Keya Akter Payel", subtitle: "2025" },
    { href: "/bd/en/ambassador?index=8", imgSrc: "https://img.b112j.com/bj/h5/assets/v3/images/ambassador/yesha-sagar.png?v=1758614201573&source=drccdnsrc", title: "Yesha Sagar", subtitle: "2025 - 2026" },
];


export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState("96px");

  useEffect(() => {
    if (contentRef.current) {
        setContentHeight(isExpanded ? `${contentRef.current.scrollHeight}px`: `96px`);
    }
  }, [isExpanded]);


  return (
    <footer className="bg-[#252525] text-white pt-6 md:pt-10 pb-20 md:pb-6">
      <div className="container mx-auto px-3 md:px-4">
        <div className="pb-6 md:pb-8 mb-6 md:mb-8 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-6 md:gap-y-8">
            <div className="md:col-span-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
                {linkColumnsData.map((col) => (
                  <FooterLinkColumn key={col.title} title={col.title} links={col.links} />
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xs md:text-sm font-medium text-white mb-3 md:mb-4">Sponsorships</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4">
                {sponsorsData.map((sponsor) => (
                    <InfoCard key={sponsor.title} {...sponsor} />
                ))}
              </div>
            </div>
            <div className="md:col-start-5 md:col-span-2">
              <h3 className="text-xs md:text-sm font-medium text-white mb-3 md:mb-4">Brand Ambassadors</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4">
                {ambassadorsData.map((ambassador) => (
                    <InfoCard key={ambassador.title} {...ambassador} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 md:py-6 my-4 md:my-6 border-b border-border flex flex-col md:flex-row md:justify-between gap-6 md:gap-8">
          <div>
            <h3 className="text-xs md:text-sm font-medium text-white mb-3 md:mb-4">Official Brand Partner</h3>
            <a href="https://www.cazvip.com/">
              <Image src="https://img.b112j.com/bj/h5/assets/v3/images/icon-set/official-brand-partner-type/cazvip.png?v=1758614201573&source=drccdnsrc" alt="Cazvip" width={90} height={40} className="h-8 md:h-10 w-auto"/>
            </a>
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-medium text-white mb-3 md:mb-4">Gaming License</h3>
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                <Image src="https://img.b112j.com/bj/h5/assets/images/footer/gaming_license.png?v=1758614201573&source=drccdnsrc" alt="Gaming Curacao" width={71} height={40} className="h-8 md:h-10 w-auto"/>
                <Image src="https://img.b112j.com/bj/h5/assets/images/footer/anjouan_license.png?v=1758614201573&source=drccdnsrc" alt="Anjouan License" width={113} height={40} className="h-8 md:h-10 w-auto"/>
                <Image src="https://img.b112j.com/bj/h5/assets/images/footer/montenegro_license.png?v=1758614201573&source=drccdnsrc" alt="Montenegro License" width={89} height={40} className="h-8 md:h-10 w-auto"/>
            </div>
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-medium text-white mb-3 md:mb-4">Responsible Gaming</h3>
             <div className="flex items-center gap-3 md:gap-4">
                <a href="/bd/en/terms"><Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/regulations-15.svg?" alt="Regulations" width={40} height={40} className="h-8 md:h-10 w-auto"/></a>
                <a href="/bd/en/terms"><Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/gamcare-16.svg?" alt="GamCare" width={107} height={40} className="h-8 md:h-10 w-auto"/></a>
                <a href="/bd/en/terms"><Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/age-limit-17.svg?" alt="18+ Age Limit" width={40} height={40} className="h-8 md:h-10 w-auto"/></a>
             </div>
          </div>
        </div>
        
        <div className="text-[11px] md:text-xs text-muted-foreground space-y-3 md:space-y-4">
            <h3 className="text-xs md:text-sm font-semibold text-white">Baji Bangladesh - Leading Online Gaming and Betting Platform in Bangladesh</h3>
            <div 
                ref={contentRef}
                style={{ maxHeight: contentHeight }}
                className="overflow-hidden transition-all duration-500 ease-in-out"
            >
                <div className="space-y-3 md:space-y-4">
                    <p>In recent years, the online gaming and betting industry in Bangladesh has seen exponential growth, attracting players who seek excitement and rewarding experiences. As more people embrace digital platforms, the demand for reliable and diverse gaming options has surged. Our platform stands out as a top choice, offering an extensive range of games and betting opportunities from renowned providers worldwide.</p>
                    <p>With online betting becoming a mainstream entertainment choice, players now rely on platforms that offer both trust and variety. Among the most established names are Baji, Jeetbuzz, Six6s, Badsha, Bagh, and Citinow. These platforms deliver premium sports and casino betting experiences, featuring a broad spectrum of options including spreads, parlays, live bets, teasers, and prop wagers to satisfy every betting style.</p>
                </div>
            </div>
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-primary font-semibold text-xs md:text-sm hover:underline">
                {isExpanded ? "Show less" : "Show more"}
            </button>
        </div>

        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border text-[10px] md:text-xs text-[#808080] space-y-3 md:space-y-4">
            <p className="text-xs md:text-sm font-semibold text-white">Win Like A King</p>
            <p>© 2025 Baji Copyrights. All Rights Reserved</p>
            <p>Baji.com is owned and operated by BJ88 Holdings Limited. registration number: 15839, registered address: Hamchhako, Mutsamudu, Autonomous Island of Anjouan, Union of Comoros.</p>
            <p>Contact us <a href="mailto:bj88holdingslimited@gmail.com" className="text-primary hover:underline">bj88holdingslimited@gmail.com</a>.</p>
            <p>Baji.com is licensed and regulated by the Government of the Autonomous Island of Anjouan, Union of Comoros and operates under License No. ALSI-202410030-FI1. Baji.com has passed all regulatory compliance and is legally authorized to conduct gaming operations for any and all games of chance and wagering.</p>
        </div>
      </div>
    </footer>
  );
}