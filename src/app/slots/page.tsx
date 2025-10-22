import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";
import ExclusiveGames from "@/components/sections/exclusive-games";

export const metadata: Metadata = {
  title: 'Slots - BAJI Casino',
  description: 'Spin and win with thousands of slot games from top providers worldwide.',
};

export default function SlotsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Slot Games</h1>
            <p className="text-muted-foreground">Thousands of exciting slot games to choose from</p>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {["All", "Popular", "New", "Jackpot", "Megaways", "Feature Buy"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-md bg-card border border-border hover:border-primary hover:bg-primary/10 text-sm font-medium whitespace-nowrap transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Featured Slots</h2>
            <ExclusiveGames />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-6">All Slot Games</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                    HOT
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-semibold text-sm mb-1 truncate">Slot Game {i + 1}</h3>
                    <p className="text-xs text-muted-foreground">Provider {(i % 5) + 1}</p>
                  </div>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
      <FloatingChat />
      <BottomNav />
    </div>
  );
}
