-- CreateTable
CREATE TABLE "ad_views" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adType" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rewardClaimed" BOOLEAN NOT NULL DEFAULT false,
    "rewardAmount" INTEGER NOT NULL DEFAULT 0,
    "validationToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_configs" (
    "id" TEXT NOT NULL,
    "adType" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "rewardAmount" INTEGER NOT NULL,
    "dailyLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ad_views_userId_idx" ON "ad_views"("userId");

-- CreateIndex
CREATE INDEX "ad_views_viewedAt_idx" ON "ad_views"("viewedAt");

-- CreateIndex
CREATE INDEX "ad_views_adType_idx" ON "ad_views"("adType");

-- CreateIndex
CREATE UNIQUE INDEX "ad_configs_adType_key" ON "ad_configs"("adType");

-- AddForeignKey
ALTER TABLE "ad_views" ADD CONSTRAINT "ad_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
