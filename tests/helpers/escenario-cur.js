import request from "supertest";
import bcrypt from "bcrypt";

// Prepara el administrador de pruebas (definido en .env.test), un rubro y dos artesanos: Ana y Bruno.
export async function crearEscenario(app, prisma) {
  const password = "ClaveDePrueba2026!";

  // Se asegura que el administrador exista, esté activo y use la contraseña de .env.test.
  const emailAdmin = process.env.ADMIN_TEST_EMAIL;
  const passwordAdmin = process.env.ADMIN_TEST_PASSWORD;
  const passwordHash = await bcrypt.hash(passwordAdmin, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: emailAdmin },
    update: { passwordHash, rol: "ADMINISTRADOR", std_usuario: true },
    create: { nombre: "Admin", apellido: "Test", email: emailAdmin, passwordHash, rol: "ADMINISTRADOR" }
  });
  
  // Inicia sesión como administrador para obtener el token de autenticación.
  const { body: sesionAdmin } = await request(app)
    .post("/usuarios/login")
    .send({ email: emailAdmin, contrasena: passwordAdmin }).expect(200);

  const tokenAdmin = sesionAdmin.token;

  const rubro = await prisma.rubro.create({ data: { nom_rubro: "Textiles" } });

  const registrar = async (nombre, orden) => {
    const email = `${nombre.toLowerCase()}@pruebas.test`;

    const { body: usuario } = await request(app)
      .post("/usuarios")
      .send({
        nombre,
        apellido: "Prueba",
        email,
        contrasena: password,
        postulacion: {
          dni: String(30000000 + orden),
          celular: "3834123456",
          nom_emprend: `Emprendimiento de ${nombre}`,
          desc_emprend: "Artesanías tejidas a mano",
          rubroId: rubro.id_rubro,
          provincia: "Catamarca",
          localidad: "HUAYCAMA"
        }
      }).expect(201);
      
    const { body: sesion } = await request(app)
      .post("/usuarios/login")
      .send({ email, contrasena: password }).expect(200);
    return { usuario, token: sesion.token };
  };

  const { usuario: ana, token: tokenAna } = await registrar("Ana", 0);
  const { usuario: bruno, token: tokenBruno } = await registrar("Bruno", 1);

  return { admin, tokenAdmin, rubro, ana, tokenAna, bruno, tokenBruno };
}