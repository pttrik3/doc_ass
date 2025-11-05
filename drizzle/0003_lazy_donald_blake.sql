ALTER TABLE `forms` MODIFY COLUMN `status` enum('draft','pending','completed','failed') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `forms` ADD `writingStyleExample` text;