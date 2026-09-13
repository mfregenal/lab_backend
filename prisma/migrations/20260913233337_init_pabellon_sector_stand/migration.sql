-- CreateTable
CREATE TABLE "pabellones" (
    "id_pabellon" SERIAL NOT NULL,
    "nom_pabellon" TEXT NOT NULL,
    "desc_pabellon" TEXT,

    CONSTRAINT "pabellones_pkey" PRIMARY KEY ("id_pabellon")
);

-- CreateTable
CREATE TABLE "sectores" (
    "id_sector" SERIAL NOT NULL,
    "nom_sector" TEXT NOT NULL,
    "id_pabellon" INTEGER NOT NULL,

    CONSTRAINT "sectores_pkey" PRIMARY KEY ("id_sector")
);

-- CreateTable
CREATE TABLE "stands" (
    "id_stand" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "coordenada" TEXT NOT NULL,
    "std_stand" TEXT NOT NULL DEFAULT 'En preparación',
    "id_sector" INTEGER NOT NULL,

    CONSTRAINT "stands_pkey" PRIMARY KEY ("id_stand")
);

-- CreateIndex
CREATE UNIQUE INDEX "stands_codigo_key" ON "stands"("codigo");

-- AddForeignKey
ALTER TABLE "sectores" ADD CONSTRAINT "sectores_id_pabellon_fkey" FOREIGN KEY ("id_pabellon") REFERENCES "pabellones"("id_pabellon") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stands" ADD CONSTRAINT "stands_id_sector_fkey" FOREIGN KEY ("id_sector") REFERENCES "sectores"("id_sector") ON DELETE RESTRICT ON UPDATE CASCADE;
