CREATE TABLE `assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`location` text,
	`status` text DEFAULT 'operational',
	`description` text,
	`maintenanceHistory` text,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assetId` integer,
	`filename` text NOT NULL,
	`s3Url` text NOT NULL,
	`format` text NOT NULL,
	`status` text DEFAULT 'uploaded',
	`contentPreview` text,
	`extractedEntities` text,
	`uploadDate` integer,
	FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`role` text DEFAULT 'user',
	`createdAt` integer,
	`updatedAt` integer,
	`lastSignedIn` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);