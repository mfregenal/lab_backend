-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ARTESANO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "EstadoPostulacion" AS ENUM ('PENDIENTE', 'EN_REVISION', 'REVISION_REQUERIDA', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "EstadoStand" AS ENUM ('DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'ARTESANO',
    "std_usuario" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Rubro" (
    "id_rubro" SERIAL NOT NULL,
    "nom_rubro" TEXT NOT NULL,
    "desc_rubro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rubro_pkey" PRIMARY KEY ("id_rubro")
);

-- CreateTable
CREATE TABLE "Postulacion" (
    "id_postulacion" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "nom_emprend" TEXT NOT NULL,
    "desc_emprend" TEXT NOT NULL,
    "trayectoria" TEXT,
    "std_postulacion" "EstadoPostulacion" NOT NULL DEFAULT 'PENDIENTE',
    "observacion" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "adminId" INTEGER,
    "rubroId" INTEGER NOT NULL,

    CONSTRAINT "Postulacion_pkey" PRIMARY KEY ("id_postulacion")
);

-- CreateTable
CREATE TABLE "Artesano" (
    "id_artesano" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "postulacionId" INTEGER NOT NULL,
    "standId" INTEGER,

    CONSTRAINT "Artesano_pkey" PRIMARY KEY ("id_artesano")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id_producto" SERIAL NOT NULL,
    "nom_producto" TEXT NOT NULL,
    "desc_producto" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "std_producto" BOOLEAN NOT NULL DEFAULT true,
    "artesanoId" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "Pabellon" (
    "id_pabellon" SERIAL NOT NULL,
    "nom_pabellon" TEXT NOT NULL,
    "desc_pabellon" TEXT,

    CONSTRAINT "Pabellon_pkey" PRIMARY KEY ("id_pabellon")
);

-- CreateTable
CREATE TABLE "Sector" (
    "id_sector" SERIAL NOT NULL,
    "nom_sector" TEXT NOT NULL,
    "pabellonId" INTEGER NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id_sector")
);

-- CreateTable
CREATE TABLE "Stand" (
    "id_stand" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "latitud" DECIMAL(10,6),
    "longitud" DECIMAL(10,6),
    "std_stand" "EstadoStand" NOT NULL DEFAULT 'MANTENIMIENTO',
    "sectorId" INTEGER NOT NULL,

    CONSTRAINT "Stand_pkey" PRIMARY KEY ("id_stand")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id_consulta" SERIAL NOT NULL,
    "metodo" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "query" JSONB,
    "params" JSONB,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id_consulta")
);

-- CreateTable
CREATE TABLE "TokenRevocado" (
    "jti" TEXT NOT NULL,
    "venceEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenRevocado_pkey" PRIMARY KEY ("jti")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Postulacion_dni_key" ON "Postulacion"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Postulacion_usuarioId_key" ON "Postulacion"("usuarioId");

-- CreateIndex
CREATE INDEX "Postulacion_rubroId_idx" ON "Postulacion"("rubroId");

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_usuarioId_key" ON "Artesano"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_postulacionId_key" ON "Artesano"("postulacionId");

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_standId_key" ON "Artesano"("standId");

-- CreateIndex
CREATE INDEX "Producto_artesanoId_idx" ON "Producto"("artesanoId");

-- CreateIndex
CREATE UNIQUE INDEX "Stand_codigo_key" ON "Stand"("codigo");

-- CreateIndex
CREATE INDEX "Consulta_createAt_idx" ON "Consulta"("createAt");

-- CreateIndex
CREATE INDEX "TokenRevocado_venceEn_idx" ON "TokenRevocado"("venceEn");

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id_rubro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_postulacionId_fkey" FOREIGN KEY ("postulacionId") REFERENCES "Postulacion"("id_postulacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_standId_fkey" FOREIGN KEY ("standId") REFERENCES "Stand"("id_stand") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id_artesano") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_pabellonId_fkey" FOREIGN KEY ("pabellonId") REFERENCES "Pabellon"("id_pabellon") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id_sector") ON DELETE CASCADE ON UPDATE CASCADE;