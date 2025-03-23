import { Prisma, User as PrismaUser } from "@prisma/client";
import { z } from "zod";
import {
  IUserRepository,
  UserRepository,
} from "../database/repositories/user-repository";
import { User } from "../../application/user/entities/user";
import { prisma } from "../database/database";
import { parseJsonArray } from "../../utils/parse-json-array";

export class UserPostgresRepository implements UserRepository {
  private toDatabase(user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      chatId: user.chatId,
      queries: user.queries,
      websites: user.websites,
      schedules: user.schedules,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
  private toApplication(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      name: prismaUser.name,
      phone: prismaUser.phone,
      chatId: prismaUser.chatId,
      queries: parseJsonArray(prismaUser.queries),
      websites: parseJsonArray(prismaUser.websites),
      schedules: parseJsonArray(prismaUser.schedules),
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      deletedAt: prismaUser.deletedAt,
    });
  }

  async create(params: IUserRepository.ICreateParams): Promise<User> {
    const { chatId } = params;

    const user = new User({
      chatId,
    });

    const prismaUser = await prisma.user.create({
      data: user,
    });

    return this.toApplication(prismaUser);
  }

  public async getById(params: IUserRepository.IGetByIdParams): Promise<User | null> {
    const { id } = params;

    const prismaUser = await prisma.user.findFirst({
      where: { id },
    });

    if(!prismaUser) return null;

    return this.toApplication(prismaUser);
  }

  async update(params: IUserRepository.IUpdateParams): Promise<User> {
    const { id, ...updateData } = params;

    const updateSchema = z.object({
      name: z.string().optional(),
      phone: z.string().nullable().optional(),
      queries: z.array(z.string()).optional(),
      websites: z.array(z.string()).optional(),
      schedules: z.array(z.string()).optional(),
    });

    const parsedUpdateData = updateSchema.parse(updateData);

    if (Object.keys(parsedUpdateData).length === 0) {
      throw new Error("No fields provided to update.");
    }

    const prismaUser = await prisma.user.update({
      where: { id },
      data: parsedUpdateData,
    });

    return this.toApplication(prismaUser);
  }

  async getByChatId(
    params: IUserRepository.IGetByChatIdParams,
  ): Promise<User | null> {
    const { chatId } = params;

    const prismaUser = await prisma.user.findFirst({
      where: { chatId },
    });

    if (!prismaUser) {
      return null;
    }

    return this.toApplication(prismaUser);
  }

  async getAll(params: IUserRepository.IGetAllParams): Promise<User[]> {
    const { limit, page } = params;

    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return users.map(this.toApplication);
  }

  async softDelete(params: IUserRepository.ISoftDeleteParams): Promise<void> {
    const { id } = params;

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async delete(params: IUserRepository.IDeleteParams): Promise<void> {
    const { id, permission } = params;

    if (permission !== "administrator")
      throw new Error("You don't have the permission to do this!");

    await prisma.user.delete({
      where: { id },
    });
  }

  async getAllWithCount(
    params: IUserRepository.IGetAllWithCountParams,
  ): Promise<{ users: User[]; total: number }> {
    const { limit, page } = params;

    const paginationSchema = z.object({
      page: z.number().min(1, "Page must be greater than 0."),
      limit: z.number().min(1, "Limit must be greater than 0."),
    });

    paginationSchema.parse({ page, limit });

    const skip = (page - 1) * limit;

    const [snapshot, total] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    const users = snapshot.map((user) => this.toApplication(user));

    return { users, total };
  }
}
