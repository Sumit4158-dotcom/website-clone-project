import React from 'react';
import Image from 'next/image';

const sportsProvidersData = [
  { name: 'Exchange', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-exchange-4.svg?' },
  { name: 'I-Sports', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-sportbook-5.svg?' },
  { name: 'SBO Sports', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-sbov2-6.svg?' },
  { name: 'Horsebook', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-horsebook-7.svg?' },
  { name: 'BTi Sports', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-sbtech-8.svg?' },
  { name: 'UG Sports', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-ugv3-9.svg?' },
  { name: 'CMD Sports', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-cmd-10.svg?' },
  { name: 'E-Sports', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-awcme1sport-11.svg?' },
  { name: 'Pinnacle', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-awcmpinnacle-12.svg?' },
  { name: 'RWB', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/icon-rwb-13.svg?' },
];

interface ProviderItemProps {
  name: string;
  icon: string;
}

const ProviderItem = ({ name, icon }: ProviderItemProps) => (
  <a href="#" className="flex flex-col items-center justify-start text-center cursor-pointer group py-2 md:py-3 transition-opacity duration-200 ease-in-out hover:opacity-80">
    <div className="h-10 md:h-12 w-full flex items-center justify-center">
      <Image
        src={icon}
        alt={name}
        width={48}
        height={48}
        className="max-h-full w-auto"
      />
    </div>
    <span className="mt-1 text-[10px] md:text-xs text-white">
      {name}
    </span>
  </a>
);

const SportsProviders = () => {
  return (
    <section className="bg-secondary py-2 md:py-0">
      <div className="grid grid-cols-5 md:grid-cols-10">
        {sportsProvidersData.map((provider) => (
          <ProviderItem key={provider.name} name={provider.name} icon={provider.icon} />
        ))}
      </div>
    </section>
  );
};

export default SportsProviders;