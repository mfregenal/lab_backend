import request from "supertest";
import { generarToken } from "../../src/services/tokens.service.js"; 

export async function crearEscenario(app, prisma) {
    
    const rubroTest = await prisma.rubro.create({
        data: { nom_rubro: "Artesanías Generales" }
    });

    const usuarioCreado = await prisma.usuario.create({
        data: { 
            nombre: "Juan", 
            apellido: "Perez",
            email: "artesano@test.com", 
            passwordHash: "123", 
            rol: "ARTESANO",
            std_usuario: true 
        } 
    });
    
    const tokenArtesano = generarToken(usuarioCreado);
    
    const perfilArtesano = await prisma.artesano.create({
        data: { 
            usuario: {
                connect: { id_usuario: usuarioCreado.id_usuario }
            },
            postulacion: {
                create: {
                    dni: "12345678",
                    celular: "3834123456",
                    nom_emprend: "Artesanías del Valle",
                    desc_emprend: "Fabricación de piezas únicas en arcilla y madera.",
                    trayectoria: "5 años de experiencia",
                    provincia: "Catamarca",
                    localidad: "BELEN",
                    std_postulacion: "APROBADA",
                    rubro: {
                        connect: { id_rubro: rubroTest.id_rubro } 
                    },
                    usuario: {
                        connect: { id_usuario: usuarioCreado.id_usuario }
                    }
                }
            }
        }
    });

    const adminCreado = await prisma.usuario.create({
        data: { 
            nombre: "Jefe", 
            apellido: "Admin",
            email: "admin@test.com", 
            passwordHash: "123", 
            rol: "ADMINISTRADOR",
            std_usuario: true 
        } 
    });
    const tokenAdmin = generarToken(adminCreado);

    return { artesano: perfilArtesano, tokenArtesano, tokenAdmin, rubro: rubroTest };
}