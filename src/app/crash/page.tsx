import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";

export const metadata: Metadata = {
  title: 'Crash Games - BAJI Casino',
  description: 'Experience thrilling crash games with multipliers and instant wins.',
};

export default function CrashPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Crash Games</h1>
            <p className="text-muted-foreground">Fast-paced multiplier games with instant results</p>
          </div>
          
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Aviator", multiplier: "2.45x", color: "from-red-500/20 to-orange-500/20" },
                { name: "JetX", multiplier: "1.89x", color: "from-blue-500/20 to-cyan-500/20" },
                { name: "Spaceman", multiplier: "3.12x", color: "from-purple-500/20 to-pink-500/20" },
                { name: "Rocket", multiplier: "4.56x", color: "from-green-500/20 to-emerald-500/20" },
                { name: "Crash X", multiplier: "1.23x", color: "from-yellow-500/20 to-amber-500/20" },
                { name: "Sky High", multiplier: "5.67x", color: "from-indigo-500/20 to-blue-500/20" },
              ].map((game, i) => (
                <div key={i} className="group relative rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color}`} />
                  <div className="relative p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">{game.name}</h3>
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">LIVE</span>
                    </div>
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-primary mb-2">{game.multiplier}</div>
                      <p className="text-sm text-muted-foreground">Current multiplier</p>
                    </div>
                    <div className="space-y-2">
                      <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-md font-medium transition-colors">
                        Play Now
                      </button>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>🔥 {100 + i * 10} playing</span>
                        <span>•</span>
                        <span>Max: {(i + 5) * 10}x</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Recent Wins</h2>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium">Player</th>
                      <th className="text-left p-4 text-sm font-medium">Game</th>
                      <th className="text-left p-4 text-sm font-medium">Multiplier</th>
                      <th className="text-left p-4 text-sm font-medium">Win</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 10 }, (_, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-4 text-sm">Player****{1000 + i}</td>
                        <td className="p-4 text-sm">Aviator</td>
                        <td className="p-4 text-sm text-primary font-medium">{(1 + Math.random() * 5).toFixed(2)}x</td>
                        <td className="p-4 text-sm font-medium">৳{(Math.random() * 10000).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
