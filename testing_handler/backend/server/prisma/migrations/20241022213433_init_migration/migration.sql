-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "testFileUrl" TEXT NOT NULL,
    "envs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "testId" TEXT NOT NULL,
    "timeTaken" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);
