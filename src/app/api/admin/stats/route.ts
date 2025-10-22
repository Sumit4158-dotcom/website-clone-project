import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, games, transactions, bets, bonuses, categories, providers } from '@/db/schema';
import { eq, and, sum, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get total users count
    const totalUsersResult = await db.select({ count: count() })
      .from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get total active users count
    const activeUsersResult = await db.select({ count: count() })
      .from(users)
      .where(eq(users.status, 'active'));
    const totalActiveUsers = activeUsersResult[0]?.count || 0;

    // Get total games count
    const totalGamesResult = await db.select({ count: count() })
      .from(games);
    const totalGames = totalGamesResult[0]?.count || 0;

    // Get total active games count
    const activeGamesResult = await db.select({ count: count() })
      .from(games)
      .where(eq(games.isActive, true));
    const totalActiveGames = activeGamesResult[0]?.count || 0;

    // Get total transactions count
    const totalTransactionsResult = await db.select({ count: count() })
      .from(transactions);
    const totalTransactions = totalTransactionsResult[0]?.count || 0;

    // Get total completed transactions count
    const completedTransactionsResult = await db.select({ count: count() })
      .from(transactions)
      .where(eq(transactions.status, 'completed'));
    const totalCompletedTransactions = completedTransactionsResult[0]?.count || 0;

    // Get total revenue (sum of completed deposit transactions)
    const revenueResult = await db.select({ 
      total: sum(transactions.amount) 
    })
      .from(transactions)
      .where(and(
        eq(transactions.type, 'deposit'),
        eq(transactions.status, 'completed')
      ));
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get total withdrawals (sum of completed withdrawal transactions)
    const withdrawalsResult = await db.select({ 
      total: sum(transactions.amount) 
    })
      .from(transactions)
      .where(and(
        eq(transactions.type, 'withdrawal'),
        eq(transactions.status, 'completed')
      ));
    const totalWithdrawals = withdrawalsResult[0]?.total || 0;

    // Get total bets count
    const totalBetsResult = await db.select({ count: count() })
      .from(bets);
    const totalBets = totalBetsResult[0]?.count || 0;

    // Get total bets amount (sum of all bet amounts)
    const totalBetsAmountResult = await db.select({ 
      total: sum(bets.betAmount) 
    })
      .from(bets);
    const totalBetsAmount = totalBetsAmountResult[0]?.total || 0;

    // Get total wins amount (sum of all win amounts)
    const totalWinsAmountResult = await db.select({ 
      total: sum(bets.winAmount) 
    })
      .from(bets);
    const totalWinsAmount = totalWinsAmountResult[0]?.total || 0;

    // Get total bonuses count
    const totalBonusesResult = await db.select({ count: count() })
      .from(bonuses);
    const totalBonuses = totalBonusesResult[0]?.count || 0;

    // Get total active bonuses count
    const activeBonusesResult = await db.select({ count: count() })
      .from(bonuses)
      .where(eq(bonuses.isActive, true));
    const totalActiveBonuses = activeBonusesResult[0]?.count || 0;

    // Get total categories count
    const totalCategoriesResult = await db.select({ count: count() })
      .from(categories);
    const totalCategories = totalCategoriesResult[0]?.count || 0;

    // Get total providers count
    const totalProvidersResult = await db.select({ count: count() })
      .from(providers);
    const totalProviders = totalProvidersResult[0]?.count || 0;

    // Return comprehensive statistics
    return NextResponse.json({
      users: {
        total: totalUsers,
        active: totalActiveUsers
      },
      games: {
        total: totalGames,
        active: totalActiveGames
      },
      transactions: {
        total: totalTransactions,
        completed: totalCompletedTransactions,
        revenue: parseFloat(totalRevenue?.toString() || '0'),
        withdrawals: parseFloat(totalWithdrawals?.toString() || '0')
      },
      bets: {
        total: totalBets,
        totalAmount: parseFloat(totalBetsAmount?.toString() || '0'),
        totalWins: parseFloat(totalWinsAmount?.toString() || '0')
      },
      bonuses: {
        total: totalBonuses,
        active: totalActiveBonuses
      },
      categories: {
        total: totalCategories
      },
      providers: {
        total: totalProviders
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}