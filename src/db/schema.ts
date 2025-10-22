import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  phone: text('phone'),
  fullName: text('full_name').notNull(),
  balance: real('balance').notNull().default(0),
  bonusBalance: real('bonus_balance').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  lastLogin: text('last_login'),
  status: text('status').notNull().default('active'), // active, suspended, banned
  kycVerified: integer('kyc_verified', { mode: 'boolean' }).notNull().default(false),
});

// Categories table
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  iconUrl: text('icon_url'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});

// Providers table
export const providers = sqliteTable('providers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  gameCount: integer('game_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

// Games table
export const games = sqliteTable('games', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: integer('category_id').references(() => categories.id),
  provider: text('provider').notNull(),
  imageUrl: text('image_url'),
  thumbnailUrl: text('thumbnail_url'),
  description: text('description'),
  minBet: real('min_bet').notNull().default(0.10),
  maxBet: real('max_bet').notNull().default(1000.00),
  rtp: real('rtp').notNull().default(96.00),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  playCount: integer('play_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Transactions table
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  type: text('type').notNull(), // deposit, withdrawal, bet, win, bonus, refund
  amount: real('amount').notNull(),
  balanceBefore: real('balance_before').notNull(),
  balanceAfter: real('balance_after').notNull(),
  status: text('status').notNull().default('pending'), // pending, completed, failed, cancelled
  paymentMethod: text('payment_method'),
  transactionRef: text('transaction_ref'),
  description: text('description'),
  createdAt: text('created_at').notNull(),
  completedAt: text('completed_at'),
});

// Bets table
export const bets = sqliteTable('bets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  gameId: integer('game_id').references(() => games.id),
  betAmount: real('bet_amount').notNull(),
  winAmount: real('win_amount').notNull().default(0),
  multiplier: real('multiplier').notNull().default(0),
  status: text('status').notNull(), // pending, win, loss
  betData: text('bet_data'),
  createdAt: text('created_at').notNull(),
  settledAt: text('settled_at'),
});

// Bonuses table
export const bonuses = sqliteTable('bonuses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  type: text('type').notNull(), // welcome, deposit, cashback, free_spins, referral
  amount: real('amount').notNull().default(0),
  percentage: integer('percentage').notNull().default(0),
  maxAmount: real('max_amount').notNull().default(0),
  wageringRequirement: integer('wagering_requirement').notNull().default(0),
  validFrom: text('valid_from').notNull(),
  validUntil: text('valid_until').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  description: text('description'),
  createdAt: text('created_at').notNull(),
});

// User Bonuses table
export const userBonuses = sqliteTable('user_bonuses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  bonusId: integer('bonus_id').references(() => bonuses.id),
  amount: real('amount').notNull(),
  wageredAmount: real('wagered_amount').notNull().default(0),
  status: text('status').notNull().default('active'), // active, completed, expired, cancelled
  claimedAt: text('claimed_at').notNull(),
  expiresAt: text('expires_at').notNull(),
  completedAt: text('completed_at'),
});

// Admin Logs table
export const adminLogs = sqliteTable('admin_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  adminId: integer('admin_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: integer('entity_id'),
  oldData: text('old_data'),
  newData: text('new_data'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: text('created_at').notNull(),
});