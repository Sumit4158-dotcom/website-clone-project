import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";

export const metadata: Metadata = {
  title: 'Fishing Games - BAJI Casino',
  description: 'Exciting fishing arcade games with multipliers and jackpots.',
};

export default function FishingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Fishing Games</h1>
            <p className="text-muted-foreground">Catch big wins in our exciting fishing arcade games</p>
          </div>
          
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Fish Hunter", jackpot: "128,450", players: 234 },
                { name: "Boom Legend", jackpot: "95,320", players: 189 },
                { name: "Ocean King", jackpot: "156,780", players: 312 },
                { name: "Phoenix Realm", jackpot: "87,650", players: 156 },
                { name: "Dragon Fortune", jackpot: "198,920", players: 278 },
                { name: "Fishing War", jackpot: "72,340", players: 145 },
              ].map((game, i) => (
                <div key={i} className="group relative rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-cyan-500/10 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      🐟
                    </div>
                    <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                      {game.players} playing
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-3">{game.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Jackpot</span>
                        <span className="text-primary font-bold">৳{game.jackpot}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${60 + (i * 5)}%` }}></div>
                      </div>
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md font-medium transition-colors">
                      Play Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-6">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Choose Your Gun", desc: "Select your weapon and bet amount" },
                { step: "2", title: "Aim & Shoot", desc: "Target fish to capture them" },
                { step: "3", title: "Catch Fish", desc: "Different fish have different values" },
                { step: "4", title: "Win Prizes", desc: "Collect coins and trigger bonuses" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
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
