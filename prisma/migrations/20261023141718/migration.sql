/*
  Warnings:

  - Made the column `std_usuario` on table `Usuario` required. Existing NULL values are converted to false to preserve the prior inactive-account behavior.

*/
-- AlterTable
UPDATE "Usuario" SET "std_usuario" = false WHERE "std_usuario" IS NULL;
ALTER TABLE "Usuario" ALTER COLUMN "std_usuario" SET NOT NULL;
