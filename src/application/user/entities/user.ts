import { v4 as uuid } from 'uuid';

export declare namespace IUser {
  interface IProps {
    id: string;
    name: string;
    phone: string | null;
    chatId: number;
    queries: string[];
    websites: string[];
    schedules: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }

  interface IConstructor {
    id?: IUser.IProps['id'];
    name: IUser.IProps['name'];
    phone?: IUser.IProps['phone'];
    chatId: IUser.IProps['chatId'];
    queries: IUser.IProps['queries'];
    websites: IUser.IProps['websites'];
    schedules?: IUser.IProps['schedules'];
    createdAt?: IUser.IProps['createdAt'];
    updatedAt?: IUser.IProps['updatedAt'];
    deletedAt?: IUser.IProps['deletedAt'];
  }
}

export class User {
  protected props: IUser.IProps;

  public constructor(props: IUser.IConstructor) {
    this.props = {
      ...props,
      id: props.id || uuid(),
      phone: props.phone || null,
      schedules: props.schedules || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
      deletedAt: props.deletedAt || null,
    };
  }

  public addQuery(query: string) {
    this.props.queries.push(query);

    this.update()
  }

  public addWebsite(website: string) {
    this.props.websites.push(website);

    this.update()
  }

  public get id(): IUser.IProps['id'] {
    return this.props.id;
  };

  public get name(): IUser.IProps['name'] {
      return this.props.name;
  };

  public get phone(): IUser.IProps['phone'] {
    return this.props.phone;
  };

  public get chatId(): IUser.IProps['chatId'] {
    return this.props.chatId;
  };

  public get queries(): IUser.IProps['queries'] {
    return this.props.queries;
  };

  public get websites(): IUser.IProps['websites'] {
    return this.props.websites;
  };

  public get createdAt(): IUser.IProps['createdAt'] {
    return this.props.createdAt;
  };

  public get updatedAt(): IUser.IProps['updatedAt'] {
    return this.props.updatedAt;
  };

  public get deletedAt(): IUser.IProps['deletedAt'] {
    return this.props.deletedAt;
  };

  public update(): void {
    this.props.updatedAt = new Date()
  }

  public delete(): void {
    if(this.props.deletedAt) return;

    this.props.deletedAt = new Date()

    this.props.updatedAt = new Date();
  }
}