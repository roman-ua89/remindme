import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ROLES = [
    { code: 'user', name: 'Regular user', description: 'Default on registration' },
    { code: 'admin', name: 'Admin user', description: 'Platform administration' },
] as const;

const PERMISSIONS = [
    {
        code: 'content:manage_own',
        name: 'Manage own content',
        description: 'Create/update/delete own categories, topics, entities',
    },
    {
        code: 'content:manage_any',
        name: 'Manage any content',
        description: 'Manage any user content (admin)',
    },
    {
        code: 'users:manage',
        name: 'Manage users',
        description: 'List, activate/deactivate, assign roles',
    },
] as const;

const ROLE_PERMISSIONS: Record<string, string[]> = {
    user: ['content:manage_own'],
    admin: ['content:manage_own', 'content:manage_any', 'users:manage'],
};

async function main() {
    for (const permission of PERMISSIONS) {
        await prisma.permission.upsert({
            where: { code: permission.code },
            update: {
                name: permission.name,
                description: permission.description,
            },
            create: permission,
        });
    }

    for (const role of ROLES) {
        await prisma.role.upsert({
            where: { code: role.code },
            update: {
                name: role.name,
                description: role.description,
            },
            create: role,
        });
    }

    const roles = await prisma.role.findMany();
    const permissions = await prisma.permission.findMany();

    for (const role of roles) {
        const permissionCodes = ROLE_PERMISSIONS[role.code] ?? [];
        for (const permissionCode of permissionCodes) {
            const permission = permissions.find((item) => item.code === permissionCode);
            if (!permission) continue;

            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: role.id,
                    permissionId: permission.id,
                },
            });
        }
    }

    console.log('Base seed completed');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
