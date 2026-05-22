CREATE TABLE `translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studyId` int NOT NULL,
	`language` varchar(5) NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `options` MODIFY COLUMN `status` enum('idea','in_progress','to_review','in_retard','abandoned','terminated','favorable','risky','blocked') NOT NULL DEFAULT 'idea';--> statement-breakpoint
ALTER TABLE `risks` MODIFY COLUMN `postId` int;--> statement-breakpoint
ALTER TABLE `actionDependencies` ADD `lagDays` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `aiAnalyses` ADD `confidence` decimal(3,2) DEFAULT '0.5';--> statement-breakpoint
ALTER TABLE `aiAnalyses` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `options` ADD `costScore` decimal(5,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `options` ADD `delayScore` decimal(5,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `options` ADD `feasibilityScore` decimal(5,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `options` ADD `totalCost` decimal(12,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `options` ADD `totalDays` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `risks` ADD `studyId` int;--> statement-breakpoint
CREATE INDEX `translations_studyId_idx` ON `translations` (`studyId`);--> statement-breakpoint
CREATE INDEX `translations_language_idx` ON `translations` (`language`);--> statement-breakpoint
CREATE INDEX `risks_studyId_idx` ON `risks` (`studyId`);