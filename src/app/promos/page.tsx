import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";

export const metadata: Metadata = {
  title: 'Promotions - BAJI Casino',
  description: 'Exclusive bonuses, promotions and rewards for BAJI players.',
};

export default function PromosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Promotions & Bonuses</h1>
            <p className="text-muted-foreground">Exclusive offers and rewards for our players</p>
          </div>

          <section className="mb-12">
            <div className="bg-gradient-to-r from-primary/30 via-blue-500/20 to-purple-500/20 rounded-lg p-8 md:p-12 border border-primary/50">
              <div className="max-w-2xl">
                <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4">
                  NEW PLAYER BONUS
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome Bonus</h2>
                <p className="text-xl mb-2">Get up to <span className="text-primary font-bold">৳25,000</span></p>
                <p className="text-muted-foreground mb-6">+ 100 Free Spins on your first deposit</p>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-medium transition-colors">
                  Claim Now
                </button>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-6">Active Promotions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: "Daily Cashback", 
                  badge: "DAILY",
                  desc: "Get 10% cashback on all losses",
                  bonus: "Up to ৳5,000",
                  color: "from-green-500/20"
                },
                { 
                  title: "Weekend Reload", 
                  badge: "WEEKEND",
                  desc: "50% bonus on weekend deposits",
                  bonus: "Up to ৳10,000",
                  color: "from-blue-500/20"
                },
                { 
                  title: "Slot Tournament", 
                  badge: "TOURNAMENT",
                  desc: "Compete for huge prize pools",
                  bonus: "৳50,000 Pool",
                  color: "from-purple-500/20"
                },
                { 
                  title: "Refer a Friend", 
                  badge: "REFERRAL",
                  desc: "Earn rewards for each referral",
                  bonus: "৳500 per Friend",
                  color: "from-orange-500/20"
                },
                { 
                  title: "VIP Rewards", 
                  badge: "VIP",
                  desc: "Exclusive bonuses for VIP members",
                  bonus: "Custom Offers",
                  color: "from-yellow-500/20"
                },
                { 
                  title: "Birthday Bonus", 
                  badge: "SPECIAL",
                  desc: "Special gift on your birthday",
                  bonus: "Surprise Bonus",
                  color: "from-pink-500/20"
                },
              ].map((promo, i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group cursor-pointer">
                  <div className={`h-32 bg-gradient-to-br ${promo.color} to-transparent relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">
                      {["💰", "🎁", "🏆", "👥", "⭐", "🎂"][i]}
                    </div>
                    <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                      {promo.badge}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{promo.desc}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-primary font-bold">{promo.bonus}</span>
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md font-medium transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Terms & Conditions</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• All bonuses are subject to wagering requirements</li>
                <li>• Minimum deposit amount applies for bonus eligibility</li>
                <li>• Bonuses must be claimed within the specified time period</li>
                <li>• Maximum bet limits apply when playing with bonus funds</li>
                <li>• Full terms and conditions apply - click to read more</li>
              </ul>
              <button className="mt-4 text-sm text-primary hover:underline">
                View Full Terms & Conditions →
              </button>
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
