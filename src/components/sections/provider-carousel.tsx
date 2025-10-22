"use client";

import React from 'react';
import Image from 'next/image';

const providers = [
  { name: 'Spribe', logoUrl: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-spribe.png?v=1758614201573&source=drccdnsrc' },
  { name: 'JILI', logoUrl: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmjili.png?v=1758614201573&source=drccdnsrc' },
  { name: 'EVO', logoUrl: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-evo.png?v=1758614201573&source=drccdnsrc' },
  { name: 'PP', logoUrl: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmpp.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Sexy', logoUrl: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmsexy.png?v=1758614201573&source=drccdnsrc' },
  { name: 'JDB', logoUrl: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-jdb.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Fa Chai', logoUrl: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmfc.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Yellow Bat', logoUrl: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmyesbingo.png?v=1758614201573&source=drccdnsrc' },
];

const ProviderItem = ({ provider, index }: { provider: { name: string; logoUrl: string }, index: number }) => (
  <li key={index} className="flex flex-col items-center justify-center bg-card rounded-lg p-4 mx-2 w-[104px] h-[104px] flex-shrink-0">
    <Image
      src={provider.logoUrl}
      alt={`${provider.name} logo`}
      width={72}
      height={40}
      className="object-contain"
    />
    <p className="text-muted-foreground text-xs mt-2">{provider.name}</p>
  </li>
);

const ProviderCarousel = () => {
  return (
    <>
      <style>
        {`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}
      </style>
      <section 
        className="w-full py-6 bg-background group"
        role="marquee"
        aria-label="Featured game providers"
      >
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start flex-shrink-0 animate-[scroll_30s_linear_infinite] group-hover:[animation-play-state:paused]">
            {providers.map((provider, index) => (
              <ProviderItem key={`first-${index}`} provider={provider} index={index}/>
            ))}
          </ul>
          <ul className="flex items-center justify-center md:justify-start flex-shrink-0 animate-[scroll_30s_linear_infinite] group-hover:[animation-play-state:paused]" aria-hidden="true">
            {providers.map((provider, index) => (
              <ProviderItem key={`second-${index}`} provider={provider} index={index}/>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default ProviderCarousel;