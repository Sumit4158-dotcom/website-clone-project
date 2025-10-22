import { db } from '@/db';
import { providers } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const sampleProviders = [
        {
            name: 'Pragmatic Play',
            slug: 'pragmatic-play',
            logoUrl: '/logos/pragmatic-play.png',
            isActive: true,
            gameCount: 120,
            createdAt: currentTimestamp,
        },
        {
            name: 'Evolution Gaming',
            slug: 'evolution-gaming',
            logoUrl: '/logos/evolution-gaming.png',
            isActive: true,
            gameCount: 85,
            createdAt: currentTimestamp,
        },
        {
            name: 'JILI',
            slug: 'jili',
            logoUrl: '/logos/jili.png',
            isActive: true,
            gameCount: 95,
            createdAt: currentTimestamp,
        },
        {
            name: 'Spribe',
            slug: 'spribe',
            logoUrl: '/logos/spribe.png',
            isActive: true,
            gameCount: 12,
            createdAt: currentTimestamp,
        },
        {
            name: "Play'n GO",
            slug: 'playn-go',
            logoUrl: '/logos/playn-go.png',
            isActive: true,
            gameCount: 110,
            createdAt: currentTimestamp,
        },
        {
            name: 'NetEnt',
            slug: 'netent',
            logoUrl: '/logos/netent.png',
            isActive: true,
            gameCount: 80,
            createdAt: currentTimestamp,
        },
        {
            name: 'Microgaming',
            slug: 'microgaming',
            logoUrl: '/logos/microgaming.png',
            isActive: true,
            gameCount: 150,
            createdAt: currentTimestamp,
        },
        {
            name: 'Yggdrasil',
            slug: 'yggdrasil',
            logoUrl: '/logos/yggdrasil.png',
            isActive: true,
            gameCount: 65,
            createdAt: currentTimestamp,
        },
        {
            name: 'Red Tiger',
            slug: 'red-tiger',
            logoUrl: '/logos/red-tiger.png',
            isActive: true,
            gameCount: 75,
            createdAt: currentTimestamp,
        },
        {
            name: 'Push Gaming',
            slug: 'push-gaming',
            logoUrl: '/logos/push-gaming.png',
            isActive: true,
            gameCount: 45,
            createdAt: currentTimestamp,
        },
        {
            name: 'Nolimit City',
            slug: 'nolimit-city',
            logoUrl: '/logos/nolimit-city.png',
            isActive: true,
            gameCount: 35,
            createdAt: currentTimestamp,
        },
        {
            name: 'Hacksaw Gaming',
            slug: 'hacksaw-gaming',
            logoUrl: '/logos/hacksaw-gaming.png',
            isActive: true,
            gameCount: 42,
            createdAt: currentTimestamp,
        },
    ];

    await db.insert(providers).values(sampleProviders);
    
    console.log('✅ Providers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});