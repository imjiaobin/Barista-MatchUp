-- contact_submissions had 0 rows at the time of this change, so we drop and
-- recreate rather than writing a column-by-column ALTER migration.
DROP TABLE "contact_submissions";
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_name" varchar(200) NOT NULL,
	"contact_phone" varchar(50) NOT NULL,
	"contact_email" varchar(320) NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"event_city" varchar(20) NOT NULL,
	"event_address" varchar(300) NOT NULL,
	"venue_type" varchar(20) NOT NULL,
	"event_start_at" timestamp NOT NULL,
	"event_end_at" timestamp NOT NULL,
	"cup_count" integer NOT NULL,
	"drink_types" text[] NOT NULL,
	"dessert_needed" boolean DEFAULT false NOT NULL,
	"dessert_notes" text,
	"power_supply" varchar(50),
	"water_source" varchar(50),
	"budget_range" varchar(50),
	"notes" text,
	"preferred_contact_method" varchar(20),
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
