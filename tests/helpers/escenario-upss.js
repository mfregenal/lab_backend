import { generarToken } from "../../src/services/tokens.service.js";

export async function crearEscenario(app, prisma) {
    const idUnico = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    
    const admin = await prisma.usuario.create({
        data: {
            email: "admin@test.com", passwordHash: "mockHash",
            rol: "ADMINISTRADOR", nombre: "Admin", apellido: "Poncho", std_usuario: true
        }
    });
    
    const artesano = await prisma.usuario.create({
        data: {
            email: "artesano@test.com", passwordHash: "mockHash",
            rol: "ARTESANO", nombre: "Arte", apellido: "Sano", std_usuario: true
        }
    });

    const tokenAdmin = generarToken(admin);
    const tokenArtesano = generarToken(artesano);

    const pabellon = await prisma.pabellon.create({
        data: { nom_pabellon: "Pabellón Base" }
    });

    const sector = await prisma.sector.create({
        data: { nom_sector: "Sector Base", pabellonId: pabellon.id_pabellon }
    });

    const stand = await prisma.stand.create({
        data: { codigo: "ST-000", sectorId: sector.id_sector, std_stand: "DISPONIBLE" }
    });

    return { admin, artesano, tokenAdmin, tokenArtesano, pabellon, sector, stand };
}