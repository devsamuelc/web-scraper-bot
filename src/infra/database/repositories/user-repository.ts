import { User } from "../../../application/user/entities/user";

export declare namespace IUserRepository {
  interface ICreateParams {
    name?: string;
    phone?: string;
    chatId: number;
    queries?: string[];
    websites?: string[];
    schedules?: string[];
  }

  interface IUpdateParams {
    id: string;
    name?: string;
    phone?: string;
    chatId?: string;
    queries?: string[];
    websites?: string[];
    schedules?: string[];
  }
  interface IGetByChatIdParams {
    chatId: number;
  }

  interface IGetAllParams {
    limit: number;
    page: number;
  }

  interface IGetByIdParams {
    id: string;
  }

  interface IGetAllWithCountParams {
    limit: number;
    page: number;
  }

  interface ISoftDeleteParams {
    id: string;
  }

  interface IDeleteParams {
    id: string;
    permission: string;
  }
}

export abstract class UserRepository {
  public abstract create(params: IUserRepository.ICreateParams): Promise<User>
  public abstract update(params: IUserRepository.IUpdateParams): Promise<User>
  public abstract getById(params: IUserRepository.IGetByIdParams): Promise<User | null>;
  public abstract getByChatId(params: IUserRepository.IGetByChatIdParams): Promise<User | null>;
  public abstract getAll(params: IUserRepository.IGetAllParams): Promise<User[]>;
  public abstract getAllWithCount(params: IUserRepository.IGetAllWithCountParams): Promise<{ users: User[], total: number }>;
  public abstract softDelete(params: IUserRepository.ISoftDeleteParams): Promise<void>;
  public abstract delete(params: IUserRepository.IDeleteParams): Promise<void>;
}