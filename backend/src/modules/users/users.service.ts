import type { AdminUser, UpdateUserInput } from '@remindme/contracts/users';

import { prisma } from '../../lib/prisma.js';
import { badRequest, notFound } from '../../lib/errors.js';

function toAdminUserDto(user: {
    id: string;
    email: string;
    displayName: string | null;
    isActive: boolean;
    createdAt: Date;
    userRoles: Array<{ role: { code: string } }>;
}): AdminUser {
    return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isActive: user.isActive,
        roles: user.userRoles.map((userRole) => userRole.role.code),
        createdAt: user.createdAt.toISOString(),
    };
}

export async function listUsers(): Promise<AdminUser[]> {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            userRoles: {
                include: { role: true },
            },
        },
    });

    return users.map(toAdminUserDto);
}

export async function getUser(userId: string): Promise<AdminUser> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userRoles: {
                include: { role: true },
            },
        },
    });

    if (!user) {
        throw notFound('User not found');
    }

    return toAdminUserDto(user);
}

export async function updateUser(userId: string, input: UpdateUserInput): Promise<AdminUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw notFound('User not found');
    }

    await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: userId },
            data: {
                ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
                ...(input.displayName !== undefined ? { displayName: input.displayName } : {}),
            },
        });

        if (input.roleCodes) {
            const roles = await tx.role.findMany({
                where: { code: { in: input.roleCodes } },
            });

            if (roles.length !== input.roleCodes.length) {
                throw badRequest('One or more roles are invalid');
            }

            await tx.userRole.deleteMany({ where: { userId } });
            await tx.userRole.createMany({
                data: roles.map((role) => ({
                    userId,
                    roleId: role.id,
                })),
            });
        }
    });

    return getUser(userId);
}
