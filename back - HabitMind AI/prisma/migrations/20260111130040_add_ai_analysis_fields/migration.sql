-- AlterTable
ALTER TABLE "ai_insights" ADD COLUMN     "impact" TEXT,
ADD COLUMN     "insights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[];
