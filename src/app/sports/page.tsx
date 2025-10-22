import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";
import SportsProviders from "@/components/sections/sports-providers";

export const metadata: Metadata = {
  title: 'Sports Betting - BAJI Casino',
  description: 'Bet on your favorite sports with top providers including Exchange, I-Sports, SBO Sports and more.',
};

export default function SportsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Sports Betting</h1>
            <p className="text-muted-foreground">Choose from our premium sports betting providers</p>
          </div>
          
          <section>
            <SportsProviders />
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Live Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">LIVE</span>
                    <span className="text-xs text-muted-foreground">Football</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Team A</span>
                      <span className="text-2xl font-bold text-primary">{i}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Team B</span>
                      <span className="text-2xl font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded text-sm font-medium transition-colors">
                        1.{85 + i}
                      </button>
                      <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded text-sm font-medium transition-colors">
                        X 3.{20 + i}
                      </button>
                      <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded text-sm font-medium transition-colors">
                        2.{10 + i}
                      </button>
                    </div>
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
