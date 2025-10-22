import Image from 'next/image';

const providers = [
  { name: 'Evolution', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/vendor-evo-30.png?' },
  { name: 'Pragmatic Play', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmpp.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Sexy', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmsexy.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Playtech', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmpt.png?v=1758614201573&source=drccdnsrc' },
  { name: 'HotRoad', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmhotroad.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Winfinity', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-winfinity.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Microgaming', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-mg.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Dream Gaming', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmdg.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Big Gaming', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-bg.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Viacasino', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmvia.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Spribe', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-spribe.png?v=1758614201573&source=drccdnsrc' },
  { name: 'JILI', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmjili.png?v=1758614201573&source=drccdnsrc' },
  { name: 'JDB', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-jdb.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Fa Chai', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmfc.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Yellow Bat', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmyesbingo.png?v=1758614201573&source=drccdnsrc' },
  { name: 'PG Soft', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-pg.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Spadegaming', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmsg.png?v=1758614201573&source=drccdnsrc' },
  { name: 'NextSpin', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-nextspin.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Red Tiger', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmrt.png?v=1758614201573&source=drccdnsrc' },
  { name: 'KingMaker', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-awcmkm.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Rich88', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-rich88.png?v=1758614201573&source=drccdnsrc' },
  { name: 'CQ9', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-cq9.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Joker', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-joker.png?v=1758614201573&source=drccdnsrc' },
  { name: 'Netent', logo: 'https://img.b112j.com/bj/h5/assets/v3/images/icon-set/vendor-type/for-dark/vendor-netent.png?v=1758614201573&source=drccdnsrc' },
];

const ProviderCard = ({ name, logo }: { name: string; logo: string }) => (
  <a
    href="#"
    className="group flex h-[70px] md:h-[90px] flex-col items-center justify-start rounded p-2 md:p-3 bg-secondary transition-colors duration-200 hover:bg-neutral-700"
  >
    <div className="relative flex-grow flex w-full items-center justify-center">
      <Image
        src={logo}
        alt={name}
        fill
        sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, (max-width: 1024px) 12vw, 10vw"
        style={{ objectFit: 'contain' }}
        className="filter brightness-75 contrast-125 transition-all duration-300 group-hover:brightness-100 group-hover:contrast-100"
      />
    </div>
    <span className="mt-1 md:mt-2 text-[10px] md:text-xs text-muted-foreground whitespace-nowrap text-center overflow-hidden text-ellipsis w-full">
      {name}
    </span>
  </a>
);

const GameProviders = () => {
  return (
    <section className="w-full">
      <h3 className="mb-3 md:mb-4 text-base md:text-lg font-medium text-foreground">Provider</h3>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 md:gap-3">
        {providers.map((provider) => (
          <ProviderCard key={provider.name} name={provider.name} logo={provider.logo} />
        ))}
      </div>
    </section>
  );
};

export default GameProviders;