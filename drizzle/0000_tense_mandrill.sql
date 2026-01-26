CREATE TABLE "departments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "departments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"department_id" integer NOT NULL,
	"name" varchar(250) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE restrict ON UPDATE no action;