CREATE TABLE `actionDependencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actionId` int NOT NULL,
	`dependsOnActionId` int NOT NULL,
	`dependencyType` enum('finish_to_start','start_to_start','finish_to_finish','start_to_finish') NOT NULL DEFAULT 'finish_to_start',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `actionDependencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`status` enum('idea','in_progress','to_review','in_retard','abandoned','terminated') NOT NULL DEFAULT 'idea',
	`advancement` decimal(5,2) DEFAULT '0',
	`startDate` timestamp,
	`endDate` timestamp,
	`estimatedDays` int DEFAULT 0,
	`actualDays` int,
	`cost` decimal(12,2) DEFAULT '0',
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiAnalyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studyId` int NOT NULL,
	`type` enum('executive_summary','best_option_suggestion','risk_detection','full_analysis') NOT NULL,
	`content` text NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiAnalyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alertThresholds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('cost','delay','score','advancement') NOT NULL,
	`operator` enum('<','>','<=','>=','=','!=') NOT NULL,
	`threshold` decimal(12,2) NOT NULL,
	`severity` enum('info','warning','critical') NOT NULL DEFAULT 'warning',
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alertThresholds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studyId` int NOT NULL,
	`thresholdId` int,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','warning','critical') NOT NULL DEFAULT 'warning',
	`relatedEntityType` enum('option','post','action') NOT NULL,
	`relatedEntityId` int NOT NULL,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluationCriteria` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`weight` decimal(5,2) DEFAULT '1',
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluationCriteria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`dueDate` timestamp NOT NULL,
	`status` enum('planned','in_progress','completed','delayed') NOT NULL DEFAULT 'planned',
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `optionScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`optionId` int NOT NULL,
	`criteriaId` int NOT NULL,
	`score` decimal(5,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `optionScores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`globalScore` decimal(5,2) DEFAULT '0',
	`globalAdvancement` decimal(5,2) DEFAULT '0',
	`status` enum('idea','in_progress','to_review','in_retard','abandoned','terminated') NOT NULL DEFAULT 'idea',
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`optionId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`globalScore` decimal(5,2) DEFAULT '0',
	`advancement` decimal(5,2) DEFAULT '0',
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `risks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`probability` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`impact` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`actionPlan` text,
	`owner` varchar(255),
	`status` enum('identified','mitigating','mitigated','closed') NOT NULL DEFAULT 'identified',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `risks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `statusRules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`conditions` json NOT NULL,
	`resultStatus` enum('idea','in_progress','to_review','in_retard','abandoned','terminated') NOT NULL,
	`isActive` boolean DEFAULT true,
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `statusRules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('draft','in_progress','completed','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `actionDependencies_actionId_idx` ON `actionDependencies` (`actionId`);--> statement-breakpoint
CREATE INDEX `actionDependencies_dependsOnActionId_idx` ON `actionDependencies` (`dependsOnActionId`);--> statement-breakpoint
CREATE INDEX `actions_postId_idx` ON `actions` (`postId`);--> statement-breakpoint
CREATE INDEX `aiAnalyses_studyId_idx` ON `aiAnalyses` (`studyId`);--> statement-breakpoint
CREATE INDEX `alertThresholds_studyId_idx` ON `alertThresholds` (`studyId`);--> statement-breakpoint
CREATE INDEX `alerts_studyId_idx` ON `alerts` (`studyId`);--> statement-breakpoint
CREATE INDEX `alerts_thresholdId_idx` ON `alerts` (`thresholdId`);--> statement-breakpoint
CREATE INDEX `evaluationCriteria_studyId_idx` ON `evaluationCriteria` (`studyId`);--> statement-breakpoint
CREATE INDEX `milestones_studyId_idx` ON `milestones` (`studyId`);--> statement-breakpoint
CREATE INDEX `optionScores_optionId_idx` ON `optionScores` (`optionId`);--> statement-breakpoint
CREATE INDEX `optionScores_criteriaId_idx` ON `optionScores` (`criteriaId`);--> statement-breakpoint
CREATE INDEX `options_studyId_idx` ON `options` (`studyId`);--> statement-breakpoint
CREATE INDEX `posts_optionId_idx` ON `posts` (`optionId`);--> statement-breakpoint
CREATE INDEX `risks_postId_idx` ON `risks` (`postId`);--> statement-breakpoint
CREATE INDEX `statusRules_studyId_idx` ON `statusRules` (`studyId`);--> statement-breakpoint
CREATE INDEX `studies_userId_idx` ON `studies` (`userId`);