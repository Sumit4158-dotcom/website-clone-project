import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const games = [
  {
    name: 'Chicken Dash',
    provider: 'JILI',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/exclusive-chicken-dash-21.png?',
  },
  {
    name: 'Money Wheel',
    provider: 'JILI',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/exclusive-money-wheel-22.png?',
  },
  {
    name: 'Fortune Gems',
    provider: 'JILI',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/exclusive-fortune-gems-23.png?',
  },
  {
    name: 'Big Bass Halloween',
    provider: 'PP',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/exclusive-big-bass-halloween-3-24.png?',
  },
  {
    name: 'Cyber God of Fortune',
    provider: 'FA CHAI',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/exclusive-cyber-god-of-fortune-25.png?',
  },
  {
    name: 'Divas Ace',
    provider: 'JILI',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/exclusive-divas-ace-26.png?',
  },
  {
    name: 'Super Elements',
    provider: 'FA CHAI',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/exclusive-super-elements-27.png?',
  },
  {
    name: 'The Kings Ace',
    provider: 'JILI',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/exclusive-the-kings-ace-28.png?',
  },
];

interface Game {
  name: string;
  provider: string;
  image: string;
}

const GameCard = ({ game }: { game: Game }) => (
  <a href="#" className="block group">
    <div className="relative w-full aspect-[132/178] rounded-lg overflow-hidden bg-card">
      <Image
        src={game.image}
        alt={game.name}
        fill
        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 132px"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 pointer-events-none">
        <span className="text-white text-[10px] font-bold uppercase">{game.provider}</span>
      </div>
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2 md:gap-3">
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-semibold rounded-full w-full py-1.5 transition-colors">
          Play
        </button>
        <button className="bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm font-semibold rounded-full w-full py-1.5 transition-colors">
          Demo
        </button>
      </div>
    </div>
  </a>
);

const MoreCard = () => (
  <a href="#" className="block group">
    <div className="w-full aspect-[132/178] bg-card rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-border transition-colors">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-border group-hover:bg-primary/50 flex items-center justify-center mb-2 md:mb-3 transition-colors">
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>
      <span className="font-semibold text-xs md:text-sm text-white">More</span>
    </div>
  </a>
);

const ExclusiveGames = () => {
  return (
    <section className="py-4 md:py-6">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4">
        {games.map((game) => (
          <GameCard key={game.name} game={game} />
        ))}
        <MoreCard />
      </div>
    </section>
  );
};

export default ExclusiveGames;