CREATE TABLE "event_execution_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"arrival_at" timestamp,
	"setup_at" timestamp,
	"actual_duration_minutes" integer,
	"onsite_contact_name" varchar(200),
	"onsite_contact_phone" varchar(50),
	"emergency_contact_name" varchar(200),
	"emergency_contact_phone" varchar(50),
	"onsite_notes" text,
	"closed_smoothly" boolean,
	"follow_up_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_execution_logs_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE TABLE "satisfaction_surveys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"source" varchar(20) NOT NULL,
	"rating" integer,
	"feedback" text,
	"low_score_flagged" boolean DEFAULT false NOT NULL,
	"sent_at" timestamp,
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "satisfaction_surveys_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN "loss_reason" varchar(30);--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN "loss_reason_notes" text;--> statement-breakpoint
ALTER TABLE "event_execution_logs" ADD CONSTRAINT "event_execution_logs_submission_id_contact_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "satisfaction_surveys" ADD CONSTRAINT "satisfaction_surveys_submission_id_contact_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;