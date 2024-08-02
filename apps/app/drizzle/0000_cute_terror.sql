CREATE TABLE IF NOT EXISTS "credentials" (
	"address" varchar(256) PRIMARY KEY NOT NULL,
	"data" json,
	CONSTRAINT "credentials_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"address" varchar(256) PRIMARY KEY NOT NULL,
	"pubkey" text NOT NULL,
	"password_encr" text,
	"passkey_encr" text,
	"created_at" date DEFAULT 'NOW()',
	CONSTRAINT "users_address_unique" UNIQUE("address")
);
