-- CreateTable
CREATE TABLE "Trial" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "height" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "hasDiabetes" BOOLEAN NOT NULL,
    "hadCovid" BOOLEAN NOT NULL,
    "trialId" INTEGER NOT NULL,
    "enrolledAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Participant_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "Trial"("id")
);
