import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  openId: text('openId').unique().notNull(),
  name: text('name'),
  email: text('email'),
  role: text('role', { enum: ['user', 'admin'] }).default('user'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  lastSignedIn: integer('lastSignedIn', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const assets = sqliteTable('assets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull(),
  location: text('location'),
  status: text('status', { enum: ['operational', 'maintenance', 'offline'] }).default('operational'),
  description: text('description'),
  maintenanceHistory: text('maintenanceHistory', { mode: 'json' }), // Storing JSON as string
  createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const documents = sqliteTable('documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assetId: integer('assetId').references(() => assets.id, { onDelete: 'set null' }),
  filename: text('filename').notNull(),
  s3Url: text('s3Url').notNull(),
  format: text('format', { enum: ['pdf', 'text'] }).notNull(),
  status: text('status', { enum: ['uploaded', 'processing', 'indexed'] }).default('uploaded'),
  contentPreview: text('contentPreview'),
  extractedEntities: text('extractedEntities', { mode: 'json' }),
  uploadDate: integer('uploadDate', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
