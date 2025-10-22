import { db } from '@/db';
import { bonuses } from '@/db/schema';

async function main() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const oneEightyDaysFromNow = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const sampleBonuses = [
        {
            name: 'Welcome Bonus 100%',
            code: 'WELCOME100',
            type: 'welcome',
            amount: 0,
            percentage: 100,
            maxAmount: 500.00,
            wageringRequirement: 35,
            validFrom: thirtyDaysAgo.toISOString(),
            validUntil: ninetyDaysFromNow.toISOString(),
            isActive: true,
            description: 'Get 100% match bonus up to $500 on your first deposit',
            createdAt: thirtyDaysAgo.toISOString(),
        },
        {
            name: 'Daily Cashback 10%',
            code: 'DAILY10',
            type: 'cashback',
            amount: 0,
            percentage: 10,
            maxAmount: 100.00,
            wageringRequirement: 5,
            validFrom: thirtyDaysAgo.toISOString(),
            validUntil: ninetyDaysFromNow.toISOString(),
            isActive: true,
            description: 'Get 10% cashback on your daily losses',
            createdAt: thirtyDaysAgo.toISOString(),
        },
        {
            name: 'Weekend Reload 50%',
            code: 'WEEKEND50',
            type: 'deposit',
            amount: 0,
            percentage: 50,
            maxAmount: 300.00,
            wageringRequirement: 25,
            validFrom: thirtyDaysAgo.toISOString(),
            validUntil: ninetyDaysFromNow.toISOString(),
            isActive: true,
            description: '50% reload bonus every weekend up to $300',
            createdAt: thirtyDaysAgo.toISOString(),
        },
        {
            name: '50 Free Spins',
            code: 'FREESPINS50',
            type: 'free_spins',
            amount: 50.00,
            percentage: 0,
            maxAmount: 50.00,
            wageringRequirement: 40,
            validFrom: thirtyDaysAgo.toISOString(),
            validUntil: ninetyDaysFromNow.toISOString(),
            isActive: true,
            description: 'Get 50 free spins on selected slots',
            createdAt: thirtyDaysAgo.toISOString(),
        },
        {
            name: 'Refer a Friend $25',
            code: 'REFER25',
            type: 'referral',
            amount: 25.00,
            percentage: 0,
            maxAmount: 25.00,
            wageringRequirement: 10,
            validFrom: thirtyDaysAgo.toISOString(),
            validUntil: oneEightyDaysFromNow.toISOString(),
            isActive: true,
            description: 'Get $25 bonus for each friend you refer',
            createdAt: thirtyDaysAgo.toISOString(),
        },
        {
            name: 'VIP Cashback 20%',
            code: 'VIP20EXPIRED',
            type: 'cashback',
            amount: 0,
            percentage: 20,
            maxAmount: 500.00,
            wageringRequirement: 3,
            validFrom: ninetyDaysAgo.toISOString(),
            validUntil: sevenDaysAgo.toISOString(),
            isActive: false,
            description: 'Exclusive VIP cashback - expired',
            createdAt: ninetyDaysAgo.toISOString(),
        },
    ];

    await db.insert(bonuses).values(sampleBonuses);
    
    console.log('✅ Bonuses seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});