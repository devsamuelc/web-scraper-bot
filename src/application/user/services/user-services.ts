import { IUserRepository } from "../../../infra/database/repositories/user-repository";


export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async subscribeUser(chatId: number, schedule: string) {
    await this.userRepository.createOrUpdateUser(chatId, schedule);

    return `✅ Subscribed! You'll receive updates at ${schedule}`;
  }

  async getAllUsers() {
    return await this.userRepository.getUsers();
  }

  async unsubscribeUser(chatId: number) {
    await this.userRepository.deleteUser(chatId);

    return `❌ Unsubscribed! You won't receive updates anymore.`;
  }
}
