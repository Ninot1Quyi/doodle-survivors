CREATE TABLE `game_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`active_ms` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `game_totals` (
	`id` integer PRIMARY KEY NOT NULL,
	`runs` integer DEFAULT 0 NOT NULL,
	`active_ms` integer DEFAULT 0 NOT NULL,
	`since` integer NOT NULL
);
--> statement-breakpoint
CREATE TRIGGER game_runs_count_insert AFTER INSERT ON game_runs BEGIN
  INSERT INTO game_totals (id, runs, active_ms, since) VALUES (1, 1, NEW.active_ms, NEW.created_at)
  ON CONFLICT(id) DO UPDATE SET runs = runs + 1, active_ms = active_ms + NEW.active_ms;
END;
--> statement-breakpoint
CREATE TRIGGER game_runs_time_update AFTER UPDATE OF active_ms ON game_runs BEGIN
  UPDATE game_totals SET active_ms = active_ms + NEW.active_ms - OLD.active_ms WHERE id = 1;
END;
