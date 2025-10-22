import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Slots',
            slug: 'slots',
            iconUrl: '/icons/slots.svg',
            displayOrder: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Live Casino',
            slug: 'live-casino',
            iconUrl: '/icons/live-casino.svg',
            displayOrder: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Sports Betting',
            slug: 'sports-betting',
            iconUrl: '/icons/sports-betting.svg',
            displayOrder: 2,
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Crash Games',
            slug: 'crash-games',
            iconUrl: '/icons/crash-games.svg',
            displayOrder: 3,
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Table Games',
            slug: 'table-games',
            iconUrl: '/icons/table-games.svg',
            displayOrder: 4,
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Fishing Games',
            slug: 'fishing-games',
            iconUrl: '/icons/fishing-games.svg',
            displayOrder: 5,
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Arcade',
            slug: 'arcade',
            iconUrl: '/icons/arcade.svg',
            displayOrder: 6,
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Lottery',
            slug: 'lottery',
            iconUrl: '/icons/lottery.svg',
            displayOrder: 7,
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Card Games',
            slug: 'card-games',
            iconUrl: '/icons/card-games.svg',
            displayOrder: 8,
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Roulette',
            slug: 'roulette',
            iconUrl: '/icons/roulette.svg',
            displayOrder: 9,
            isActive: true,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});