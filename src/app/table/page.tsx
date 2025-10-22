import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";

export const metadata: Metadata = {
  title: 'Table Games - BAJI Casino',
  description: 'Classic casino table games including Blackjack, Roulette, Baccarat and more.',
};

export default function TablePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Table Games</h1>
            <p className="text-muted-foreground">Classic casino table games for every player</p>
          </div>
          
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                { name: "Blackjack", icon: "🃏", tables: 45, minBet: "10" },
                { name: "Roulette", icon: "🎡", tables: 32, minBet: "5" },
                { name: "Baccarat", icon: "🎴", tables: 28, minBet: "20" },
                { name: "Poker", icon: "♠️", tables: 18, minBet: "15" },
                { name: "Dragon Tiger", icon: "🐉", tables: 12, minBet: "10" },
                { name: "Sic Bo", icon: "🎲", tables: 8, minBet: "5" },
                { name: "Andar Bahar", icon: "🎰", tables: 15, minBet: "10" },
                { name: "Teen Patti", icon: "🃏", tables: 10, minBet: "20" },
              ].map((game, i) => (
                <div key={i} className="group relative rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all cursor-pointer">
                  <div className="p-6">
                    <div className="text-5xl mb-4">{game.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <p>{game.tables} tables available</p>
                      <p>Min bet: ৳{game.minBet}</p>
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md font-medium transition-colors">
                      Play Now
                    </button>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Game Rules & Strategies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Blackjack Basics", desc: "Learn the fundamental rules and strategies" },
                { title: "Roulette Betting", desc: "Understanding odds and bet types" },
                { title: "Baccarat Guide", desc: "Master the game of baccarat" },
                { title: "Poker Hands", desc: "Ranking and probabilities explained" },
              ].map((guide, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{guide.desc}</p>
                  <button className="text-sm text-primary hover:underline">Read more →</button>
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
