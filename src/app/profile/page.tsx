import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Sidebar from "@/components/sections/sidebar";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/sections/floating-chat";
import BottomNav from "@/components/sections/bottom-nav";

export const metadata: Metadata = {
  title: 'My Account - BAJI Casino',
  description: 'Manage your account, view transactions and update your profile.',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      
      <main className="md:ml-16 pt-[60px] pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your profile and account settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-20">
                <nav className="space-y-1">
                  {[
                    { label: "Profile", icon: "👤" },
                    { label: "Balance", icon: "💰" },
                    { label: "Transactions", icon: "📊" },
                    { label: "Bonuses", icon: "🎁" },
                    { label: "Betting History", icon: "📜" },
                    { label: "Settings", icon: "⚙️" },
                    { label: "Security", icon: "🔒" },
                    { label: "Logout", icon: "🚪" },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${
                        i === 0 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Username</label>
                    <input 
                      type="text" 
                      defaultValue="player****1234" 
                      className="w-full bg-background border border-border rounded-md px-4 py-2"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                    <input 
                      type="email" 
                      defaultValue="player@example.com" 
                      className="w-full bg-background border border-border rounded-md px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Phone Number</label>
                    <input 
                      type="tel" 
                      defaultValue="+880 1XXX-XXXXXX" 
                      className="w-full bg-background border border-border rounded-md px-4 py-2"
                    />
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-md font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Balance Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Main Balance</p>
                  <p className="text-2xl font-bold text-primary">৳12,345.67</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Bonus Balance</p>
                  <p className="text-2xl font-bold">৳1,234.56</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Wagered</p>
                  <p className="text-2xl font-bold">৳45,678.90</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Deposit", icon: "💳" },
                    { label: "Withdraw", icon: "🏦" },
                    { label: "Transfer", icon: "↔️" },
                    { label: "History", icon: "📋" },
                  ].map((action, i) => (
                    <button
                      key={i}
                      className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                    >
                      <span className="text-3xl">{action.icon}</span>
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {["🎰", "💳", "🎁", "🏆", "💰"][i]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {["Slot Win", "Deposit", "Bonus Claimed", "Tournament Entry", "Withdrawal"][i]}
                          </p>
                          <p className="text-xs text-muted-foreground">2024-01-{20 + i} 14:3{i}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${i === 0 || i === 2 ? "text-primary" : ""}`}>
                        {i === 0 ? "+" : i === 1 || i === 3 ? "" : "-"}৳{(Math.random() * 5000).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <FloatingChat />
      <BottomNav />
    </div>
  );
}
