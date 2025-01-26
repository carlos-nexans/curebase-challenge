-- CreateTable
CREATE TABLE "Trial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "height" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "hasDiabetes" BOOLEAN NOT NULL,
    "hadCovid" BOOLEAN NOT NULL,
    "trialId" INTEGER NOT NULL,
    FOREIGN KEY ("trialId") REFERENCES "Trial"("id")
);
