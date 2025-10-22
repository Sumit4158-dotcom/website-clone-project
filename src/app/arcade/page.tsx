import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";

export const metadata: Metadata = {
  title: 'Arcade Games - BAJI Casino',
  description: 'Fun and exciting arcade games with instant wins and prizes.',
};

export default function ArcadePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Arcade Games</h1>
            <p className="text-muted-foreground">Quick games, instant fun, big wins</p>
          </div>
          
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[
                { name: "Plinko", emoji: "🎯", color: "from-purple-500/20" },
                { name: "Mines", emoji: "💣", color: "from-red-500/20" },
                { name: "Wheel", emoji: "🎡", color: "from-blue-500/20" },
                { name: "Dice", emoji: "🎲", color: "from-green-500/20" },
                { name: "Limbo", emoji: "🎪", color: "from-yellow-500/20" },
                { name: "Keno", emoji: "🎱", color: "from-pink-500/20" },
                { name: "Hilo", emoji: "📊", color: "from-indigo-500/20" },
                { name: "Tower", emoji: "🗼", color: "from-orange-500/20" },
                { name: "Coin Flip", emoji: "🪙", color: "from-cyan-500/20" },
                { name: "Scratch", emoji: "🎫", color: "from-teal-500/20" },
                { name: "Video Poker", emoji: "🃏", color: "from-violet-500/20" },
                { name: "Bingo", emoji: "🎰", color: "from-rose-500/20" },
              ].map((game, i) => (
                <div key={i} className="group relative aspect-square rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} to-transparent`} />
                  <div className="relative h-full flex flex-col items-center justify-center p-4">
                    <div className="text-4xl mb-2">{game.emoji}</div>
                    <h3 className="font-semibold text-sm text-center">{game.name}</h3>
                  </div>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Featured Arcade</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Plinko Master", desc: "Drop the ball and watch it multiply", multi: "1000x" },
                { name: "Mines Adventure", desc: "Avoid the mines, collect the gems", multi: "500x" },
                { name: "Lucky Wheel", desc: "Spin the wheel for instant prizes", multi: "250x" },
              ].map((game, i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center text-6xl">
                    {["🎯", "💎", "🎡"][i]}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{game.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{game.desc}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Max win</span>
                      <span className="text-lg font-bold text-primary">{game.multi}</span>
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md font-medium transition-colors">
                      Play Now
                    </button>
                  </div>
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
