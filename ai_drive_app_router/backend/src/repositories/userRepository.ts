import { prisma } from '../lib/prisma';

export const userRepository = {
  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },
};
