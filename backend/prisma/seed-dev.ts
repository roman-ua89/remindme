import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to run the dev seed: NODE_ENV is production.');
    process.exit(1);
}

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@remindme.local';
const ADMIN_PASSWORD = 'admin12345';

async function main() {
    const adminRole = await prisma.role.findUnique({
        where: { code: 'admin' },
    });

    if (!adminRole) {
        throw new Error('Role "admin" is missing. Run "npm run db:seed:base -w backend" first.');
    }

    const existingAdmin = await prisma.user.findUnique({
        where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
        console.log(`Dev admin already exists: ${existingAdmin.email}`);
    } else {
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        const adminUser = await prisma.user.create({
            data: {
                email: ADMIN_EMAIL,
                passwordHash,
                displayName: 'Admin',
                userRoles: {
                    create: { roleId: adminRole.id },
                },
            },
        });
        console.log(`Seeded admin user: ${adminUser.email}`);
    }

    console.log('Dev seed completed');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
