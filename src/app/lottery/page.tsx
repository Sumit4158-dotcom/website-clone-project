import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";

export const metadata: Metadata = {
  title: 'Lottery - BAJI Casino',
  description: 'Try your luck with exciting lottery games and mega jackpots.',
};

export default function LotteryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Lottery Games</h1>
            <p className="text-muted-foreground">Win big with our exciting lottery draws</p>
          </div>

          <section className="mb-12">
            <div className="bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg p-8 border border-primary/30">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Mega Jackpot</h2>
                <div className="text-5xl font-bold text-primary mb-4">৳12,456,789</div>
                <p className="text-muted-foreground mb-6">Next draw in: 2h 34m 12s</p>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-medium transition-colors">
                  Buy Tickets Now
                </button>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-6">Available Lotteries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Power Ball", jackpot: "5,234,567", nextDraw: "Today 9:00 PM", tickets: 1250 },
                { name: "Mega Millions", jackpot: "3,456,789", nextDraw: "Tomorrow 8:00 PM", tickets: 890 },
                { name: "Lucky 7", jackpot: "1,234,567", nextDraw: "Today 11:00 PM", tickets: 2340 },
                { name: "Super Lotto", jackpot: "2,345,678", nextDraw: "Today 10:00 PM", tickets: 1560 },
                { name: "Daily Draw", jackpot: "567,890", nextDraw: "Every Hour", tickets: 3450 },
                { name: "Instant Win", jackpot: "890,123", nextDraw: "Continuous", tickets: 4560 },
              ].map((lottery, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{lottery.name}</h3>
                      <p className="text-xs text-muted-foreground">{lottery.tickets} tickets sold</p>
                    </div>
                    <span className="text-2xl">🎟️</span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Jackpot</p>
                      <p className="text-2xl font-bold text-primary">৳{lottery.jackpot}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Next Draw</p>
                      <p className="text-sm font-medium">{lottery.nextDraw}</p>
                    </div>
                  </div>
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md font-medium transition-colors">
                    Buy Ticket
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Recent Winners</h2>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium">Winner</th>
                      <th className="text-left p-4 text-sm font-medium">Lottery</th>
                      <th className="text-left p-4 text-sm font-medium">Prize</th>
                      <th className="text-left p-4 text-sm font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 8 }, (_, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-4 text-sm font-medium">User****{5000 + i}</td>
                        <td className="p-4 text-sm">Power Ball</td>
                        <td className="p-4 text-sm font-bold text-primary">৳{(Math.random() * 100000).toFixed(2)}</td>
                        <td className="p-4 text-sm text-muted-foreground">2024-01-{15 + i}</td>
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
