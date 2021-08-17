CREATE TABLE "wallet" (
    "id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "monthly_interest" INTEGER NOT NULL DEFAULT 2,
    "ownerid" INTEGER NOT NULL,
    PRIMARY KEY ("id")
  );

  CREATE TABLE "transaction_history" (
    "id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "ownerid" INTEGER NOT NULL,
    "walletid" INTEGER NOT NULL,
    "beneficialid" INTEGER NOT NULL,
    PRIMARY KEY ("id")
  );
  
  CREATE TABLE "profile" (
    "id" SERIAL,
    "bio" TEXT,
    "userid" INTEGER NOT NULL,
    PRIMARY KEY ("id")
  );
  
  CREATE TABLE "users" (
    "id" SERIAL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    PRIMARY KEY ("id")
  );

  CREATE TABLE "state_lga" (
  "id" SERIAL PRIMARY KEY,
  "lga" TEXT,
  "state" TEXT                            
);
  
  CREATE UNIQUE INDEX "profile.userId_unique" ON "profile"("userId");
  CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");
  ALTER TABLE "wallet" ADD FOREIGN KEY("ownerid")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "transaction_history" ADD FOREIGN KEY("ownerid")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "transaction_history" ADD FOREIGN KEY("walletid")REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "profile" ADD FOREIGN KEY("userid")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;