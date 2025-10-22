"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Volume2 } from "lucide-react";

const carouselImagesData = [
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/image_257557-20.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_241691-1.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_254857-2.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_256685-3.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_256663-4.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_254257-5.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_250630-6.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_242016-7.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_242356-8.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_242206-9.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_241601-10.jpg?",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/icons/image_241701-11.jpg?",
];

const BannerCarousel = () => {
  const images = carouselImagesData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);
  
  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 3000);
  }, [stopAutoScroll, handleNext]);

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, [startAutoScroll, stopAutoScroll]);

  return (
    <div className="w-full">
      {/* Mobile: Single full-width banner */}
      <div className="md:hidden relative w-full aspect-[16/9] rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex]}
          alt={`Banner ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <button 
          onClick={handlePrev} 
          className="absolute top-1/2 -translate-y-1/2 left-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
          aria-label="Previous slide"
        >
          <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/arrow-left-2.svg?" alt="Previous" width={16} height={16} />
        </button>
        <button 
          onClick={handleNext} 
          className="absolute top-1/2 -translate-y-1/2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
          aria-label="Next slide"
        >
          <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/arrow-right-3.svg?" alt="Next" width={16} height={16} />
        </button>
        
        {/* Dots indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Horizontal scrolling carousel */}
      <div 
        className="hidden md:block relative mx-auto max-w-[1128px] h-[200px]"
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
      >
        <div className="overflow-hidden h-full">
          <div 
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 284}px)` }}
          >
            {images.map((src, index) => (
              <a 
                key={index} 
                href="#" 
                className="flex-shrink-0 mr-4"
                style={{ width: '268px' }}
              >
                <Image
                  src={src}
                  alt={`Banner image ${index + 1}`}
                  width={268}
                  height={200}
                  className="rounded-lg object-cover w-full h-full"
                  priority={index < 3}
                />
              </a>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handlePrev} 
          className="absolute top-1/2 -translate-y-1/2 left-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
          aria-label="Previous slide"
        >
          <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/arrow-left-2.svg?" alt="Previous" width={16} height={16} />
        </button>
        <button 
          onClick={handleNext} 
          className="absolute top-1/2 -translate-y-1/2 right-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
          aria-label="Next slide"
        >
          <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/svgs/arrow-right-3.svg?" alt="Next" width={16} height={16} />
        </button>
      </div>
      
      {/* Announcement banner */}
      <div className="bg-[#222222] mt-4">
        <div className="max-w-[1200px] mx-auto py-2 md:py-3 px-3 md:px-4 flex items-start md:items-center gap-2 md:gap-3 text-white">
          <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5 md:mt-0" />
          <p className="text-xs md:text-sm leading-relaxed">
            <span>Dear customers, please use the given link to access our website </span>
            <a href="https://baji999.in" className="text-primary hover:underline break-all">https://baji999.in</a>
            <span> and download our Apps using the link provided - </span>
            <a href="https://bjbaji7.live/download/bj/bj.apk" className="text-primary hover:underline break-all">https://bjbaji7.live/download/bj/bj.apk</a>
            <span>.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;