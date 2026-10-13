CREATE TABLE `responses` (
	`person` text PRIMARY KEY NOT NULL,
	`votes` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
