-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "httpUrl" TEXT NOT NULL,
    "wsUrl" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);
