import { prisma } from "@/database/prisma";
import bcrypt from "bcrypt";

async function main() {
  const passwordHash = await bcrypt.hash("senha123", 10);

  await prisma.$transaction(async (db) => {
    const company = await db.company.upsert({
      where: { email: "company@email.com" },
      update: {},
      create: {
        name: "Orise",
        email: "company@email.com",
        cnpj: "0000000000000",
      },
    });

    const user = await db.user.upsert({
      where: { email: "admin@email.com" },
      update: {},
      create: {
        name: "Admin",
        email: "admin@email.com",
        password: passwordHash,
        company_id: company.id,
      },
    });

    const module = await db.module.upsert({
      where: { slug: "admin" },
      update: {},
      create: {
        slug: "global.admin",
        name: "Administração Global",
        description: "Módulo responsável pelo gerenciamento global da plataforma e configurações administrativas.",
      },
    });

    await db.companyModule.upsert({
      where: {
        company_id_module_id: {
          company_id: company.id,
          module_id: module.id,
        },
      },
      update: {},
      create: {
        company_id: company.id,
        module_id: module.id,
      },
    });

    const permission = await db.permission.upsert({
      where: { slug: "system.full_access" },
      update: {},
      create: {
        slug: "system.full_access",
        name: "Acesso Total",
        description:
          "Concede acesso completo a todas as funcionalidades do sistema.",
        module_id: module.id,
      },
    });

    const role = await db.role.upsert({
      where: {
        company_id_name: {
          company_id: company.id,
          name: "Super Administrador",
        },
      },
      update: {},
      create: {
        company_id: company.id,
        name: "Super Administrador",
        description:
          "Possui acesso total ao sistema, incluindo gerenciamento global, permissões e empresas.",
      },
    });

    await db.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: role.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: role.id,
        permission_id: permission.id,
      },
    });

    await db.userRole.upsert({
      where: {
        role_id_user_id: {
          role_id: role.id,
          user_id: user.id,
        },
      },
      update: {},
      create: {
        role_id: role.id,
        user_id: user.id,
      },
    });
  });
}

main()
  .then(() => {
    console.log("Seed concluído com sucesso!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  });
