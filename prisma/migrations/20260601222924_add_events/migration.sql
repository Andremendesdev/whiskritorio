-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "band" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "ticketUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_active_idx" ON "events"("active");

-- CreateIndex
CREATE INDEX "events_startsAt_idx" ON "events"("startsAt");
