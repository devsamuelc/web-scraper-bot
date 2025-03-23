import {
  UserRepository,
} from "../../../infra/database/repositories/user-repository";

export declare namespace IUserService {
  interface IConstructor {
    userRepository: UserRepository;
  }

  interface IUpdateParams {
    id: string;
    name?: string;
    phone?: string;
    schedule?: string;
  }

  interface IGetByIdParams {
    id: string;
  }

  interface IGetByChatIdParams {
    chatId: number;
  }

  interface IGetAllParams {
    limit: number;
    page: number;
  }

  interface IUnsubscribeParams {
    chatId: number;
  }

  interface ISubscribeParams {
    chatId: number;
  }

  interface ISoftDeleteParams {
    id: string;
  }

  interface IDeleteParams {
    id: string;
    permission: string;
  }
}

export class UserService {
  private userRepository: UserRepository;

  constructor(props: IUserService.IConstructor) {
    const { userRepository } = props;

    this.userRepository = userRepository;
  }

  async subscribe(params: IUserService.ISubscribeParams) {
    const { chatId } = params;

    await this.userRepository.create({
      chatId,
    });

    return `✅ Subscribed! You'll receive updates at the default schedules!`;
  }

  async getAllUsers(params: IUserService.IGetAllParams) {
    const { limit, page } = params;

    return await this.userRepository.getAllWithCount({ limit, page });
  }

  async unsubscribe(params: IUserService.IUnsubscribeParams) {
    const { chatId } = params;

    const user = await this.userRepository.getByChatId({ chatId });

    if (!user) throw new Error("User not found");

    await this.userRepository.delete({
      id: user.id,
      permission: "not-administrator",
    });

    return `❌ Unsubscribed! You won't receive updates anymore.`;
  }

  async update(updateData: IUserService.IUpdateParams) {
    const { id, ...rest } = updateData;

    if (Object.keys(rest).length === 0) {
      throw new Error("No fields provided to update.");
    }

    const user = await this.userRepository.getById({ id });

    if (!user) throw new Error("User not found.");

    return await this.userRepository.update({
      id,
      ...rest,
    });
  }

  async softDeleteUser(params: IUserService.ISoftDeleteParams) {
    const { id } = params;

    const user = await this.userRepository.getById({ id });

    if (!user) throw new Error("User not found.");

    await this.userRepository.softDelete({ id });

    return `User with ID ${id} has been soft deleted.`;
  }

  async getById(params: IUserService.IGetByIdParams) {
    const { id } = params;

    const user = await this.userRepository.getById({ id });

    if (!user) throw new Error("User not found.");

    return user;
  }

  async getByChatId(params: IUserService.IGetByChatIdParams) {
    const { chatId } = params;

    const user = await this.userRepository.getByChatId({ chatId });

    if (!user) throw new Error("User not found.");

    return user;
  }

  async deleteUser(params: IUserService.IDeleteParams) {
    const { id, permission } = params;

    const user = await this.userRepository.getById({ id });

    if (!user) throw new Error("User not found.");

    await this.userRepository.delete({
      id,
      permission,
    });

    return `User with ID ${id} has been deleted permanently.`;
  }
}
