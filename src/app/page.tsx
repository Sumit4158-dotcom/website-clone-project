import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import BannerCarousel from "@/components/sections/banner-carousel";
import GameCategories from "@/components/sections/game-categories";
import ExclusiveGames from "@/components/sections/exclusive-games";
import SportsProviders from "@/components/sections/sports-providers";
import GameProviders from "@/components/sections/game-providers";
import ProviderCarousel from "@/components/sections/provider-carousel";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";

export const metadata: Metadata = {
  title: 'BAJI Casino - Leading Online Gaming Platform',
  description: 'Experience the ultimate online gaming platform with slots, casino games, sports betting, and more from top providers worldwide.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-3 md:px-4 space-y-6 md:space-y-8">
          <section className="pt-4 md:pt-6">
            <BannerCarousel />
          </section>
          
          <section>
            <GameCategories />
          </section>
          
          <section>
            <ExclusiveGames />
          </section>
          
          <section>
            <SportsProviders />
          </section>
          
          <section>
            <GameProviders />
          </section>
          
          <section>
            <ProviderCarousel />
          </section>
        </div>
      </main>
      
      <Footer />
      <FloatingChat />
      <BottomNav />
    </div>
  );
}