import { PrismaClient, User, Role } from '@prisma/client';

const prisma = new PrismaClient();

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: { email: string; password: string; role?: Role }): Promise<User>;
}

export class PrismaAuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; password: string; role?: Role }): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }
}