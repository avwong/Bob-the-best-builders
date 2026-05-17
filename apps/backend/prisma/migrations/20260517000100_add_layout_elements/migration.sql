CREATE TYPE "LayoutElementType" AS ENUM (
  'shelf',
  'freezer',
  'special_zone',
  'checkout',
  'entrance',
  'exit',
  'wall'
);

CREATE TABLE "layout_elements" (
  "id" TEXT NOT NULL,
  "supermarket_id" TEXT NOT NULL,
  "type" "LayoutElementType" NOT NULL,
  "label" TEXT,
  "category" TEXT,
  "position_x" INTEGER NOT NULL,
  "position_y" INTEGER NOT NULL,
  "width" INTEGER NOT NULL,
  "height" INTEGER NOT NULL,
  "orientation" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "layout_elements_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "layout_elements_supermarket_id_idx" ON "layout_elements"("supermarket_id");

ALTER TABLE "layout_elements"
ADD CONSTRAINT "layout_elements_supermarket_id_fkey"
FOREIGN KEY ("supermarket_id")
REFERENCES "supermarkets"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
