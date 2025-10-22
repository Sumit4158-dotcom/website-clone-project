import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";
import GameProviders from "@/components/sections/game-providers";

export const metadata: Metadata = {
  title: 'Live Casino - BAJI Casino',
  description: 'Experience live casino games with real dealers from top providers like Evolution, Pragmatic Play, and more.',
};

export default function CasinoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Live Casino</h1>
            <p className="text-muted-foreground">Play with real dealers in real-time</p>
          </div>
          
          <section className="mb-12">
            <GameProviders />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-6">Popular Live Tables</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[
                "Roulette", "Blackjack", "Baccarat", "Poker", "Dragon Tiger",
                "Andar Bahar", "Teen Patti", "Lightning Roulette", "Mega Ball", "Crazy Time"
              ].map((game, i) => (
                <div key={i} className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">🎰</span>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{game}</h3>
                      <span className="text-xs text-primary">● LIVE</span>
                    </div>
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
