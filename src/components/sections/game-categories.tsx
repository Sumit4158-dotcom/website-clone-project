"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const categoryData = [
  {
    id: 'exclusive',
    label: 'Exclusive',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-exclusive-13.png?',
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-sport-14.png?',
  },
  {
    id: 'casino',
    label: 'Casino',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-casino-29.png?',
  },
  {
    id: 'slots',
    label: 'Slots',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-slot-10.png?',
  },
  {
    id: 'crash',
    label: 'Crash',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-crash-15.png?',
  },
  {
    id: 'table',
    label: 'Table',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-table-16.png?',
  },
  {
    id: 'fishing',
    label: 'Fishing',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-fish-17.png?',
  },
  {
    id: 'arcade',
    label: 'Arcade',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-arcade-18.png?',
  },
  {
    id: 'lottery',
    label: 'Lottery',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/icon-lottery-19.png?',
  },
];

type Category = (typeof categoryData)[0];

const GameCategoryItem = ({
  category,
  isActive,
  onClick,
}: {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'flex h-[70px] md:h-[80px] w-full flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      isActive ? 'bg-primary' : 'hover:bg-secondary'
    )}
  >
    <div className="relative h-8 w-8 md:h-10 md:w-10">
      <Image
        src={category.icon}
        alt={`${category.label} icon`}
        fill
        sizes="(max-width: 768px) 8vw, 40px"
        className="object-contain"
      />
    </div>
    <span
      className={cn(
        'text-[11px] md:text-xs font-normal leading-tight',
        isActive ? 'text-primary-foreground' : 'text-foreground'
      )}
    >
      {category.label}
    </span>
  </button>
);

const GameCategories = () => {
  const [activeCategory, setActiveCategory] = useState(categoryData[0].id);

  return (
    <section aria-label="Game Categories" className="w-full py-3 md:py-4">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:flex md:flex-wrap md:justify-center md:gap-2">
          {categoryData.map((category) => (
            <GameCategoryItem
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameCategories;