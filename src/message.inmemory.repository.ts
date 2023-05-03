import { Message } from "./message";
import { MessageRepository } from "./message.repository";

let messages: Message[] = [];

export const messageRepository: MessageRepository = {
  save: async (msg: Message) => {
    messages = [...messages, msg];

    return Promise.resolve();
  },

  saveAll: async (msg: Message[]) => {
    messages = [...messages, ...msg];
    return Promise.resolve();
  },

  get: async () => Promise.resolve(messages[messages.length - 1]),

  getAll: async () => Promise.resolve(messages),

  getById: async (id) =>
    Promise.resolve(messages.filter((message) => message.id === id)[0]),
};
