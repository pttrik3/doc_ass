CREATE TABLE `commonTopics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`modality` varchar(50) NOT NULL,
	`topic` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `commonTopics_id` PRIMARY KEY(`id`)
);
