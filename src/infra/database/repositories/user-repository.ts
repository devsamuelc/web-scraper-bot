import { User } from "../../../application/user/entities/user";
import { prisma } from "../database";


export interface IUserRepository {
  createOrUpdateUser(
    chatId: number,
    schedule: string,
  ): Promise<User>;

  getUsers(): Promise<User[]>;

  deleteUser(chatId: number): Promise<void>;
}

export class UserRepository implements IUserRepository {
  async createOrUpdateUser(
    chatId: number,
    schedule: string,
  ): Promise<User> {
    return await prisma.user.upsert({
      where: { chatId },
      update: { schedule },
      create: { chatId, schedule },
    });
  }

  async getUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async deleteUser(chatId: number): Promise<void> {
    await prisma.user.delete({ where: { chatId } });
  }
}
