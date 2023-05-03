import { Message } from "./message";

export type MessageRepository = {
  save: (message: Message) => Promise<void>;
  saveAll: (message: Message[]) => Promise<void>;
  get: () => Promise<Message>;
  getAll: () => Promise<Message[]>;
  getById: (id: string) => Promise<Message>;
};
