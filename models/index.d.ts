import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize
} from "sequelize";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id: string;
    username: string;
    discriminator: string;
    displayColor: number;
    avatarFilename?: CreationOptional<string>;

    Messages?: NonAttribute<Array<Message>>;
}

export class Channel extends Model<InferAttributes<Channel>, InferCreationAttributes<Channel>> {
    id: string;
    name: string;
    order: number;
    hidden: CreationOptional<boolean>;

    Messages?: NonAttribute<Array<Message>>;
}

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    id: string;
    name: string;
}

export class Emoji extends Model<InferAttributes<Emoji>, InferCreationAttributes<Emoji>> {
    id: string;
    name: string;
    filename: string;
}

export class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
    id: string;
    content: string;
    createdAt: Date;
    break: CreationOptional<boolean>;

    UserId: ForeignKey<User["id"]>;
    User?: NonAttribute<User>;
    ChannelId: ForeignKey<Channel["id"]>;
    Channel?: NonAttribute<Channel>;
    Attachments?: NonAttribute<Array<Attachment>>;
}

export class Attachment extends Model<InferAttributes<Attachment>, InferCreationAttributes<Attachment>> {
    filename: string;
    original: string;

    MessageId: ForeignKey<Message["id"]>;
    Message?: NonAttribute<Message>;
}

export const sequelize: Sequelize;
export { Sequelize } from "sequelize";
