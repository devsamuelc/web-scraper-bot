import { prisma } from "../database/database";
import { UserPostgresRepository } from "./user-postgres-repository";
import { describe, beforeAll, it, expect, afterAll } from 'vitest';

describe("UserPostgresRepository Test", () => {
  let userRepository: UserPostgresRepository;

  beforeAll(async () => {
    userRepository = new UserPostgresRepository();
  });

  it("should create a new user", async () => {
    const newUser = await userRepository.create({
      chatId: 12345,
      name: "John Doe",
    });

    expect(newUser).toHaveProperty("id");
    expect(newUser.name).toBe("John Doe");
    expect(newUser.chatId).toBe(12345);
  });

  it("should retrieve all users", async () => {
    const users = await userRepository.getAll({ limit: 10, page: 1 });

    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);
  });

  it("should soft delete a user", async () => {
    const user = await userRepository.create({
      chatId: 67890,
      name: "Jane Doe",
    });

    await userRepository.softDelete({ id: user.id });

    const deletedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(deletedUser?.deletedAt).toBeDefined();
  });

    afterAll(async () => {
      await prisma.user.deleteMany();
    });

});
