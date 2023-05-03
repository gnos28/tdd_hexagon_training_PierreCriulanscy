import { MessageRepository } from "./message.repository";
import { Message } from "./message";
import * as path from "path";
import * as fs from "fs";

export const fileSystemMessageRepository: MessageRepository = {
  save: async (message: Message) => {
    fs.appendFileSync(
      path.join(__dirname, "message.json"),
      JSON.stringify(message)
    );
    return Promise.resolve();
  },

  saveAll: async (messages: Message[]) => {
    messages.forEach((message) => fileSystemMessageRepository.save(message));
    return Promise.resolve();
  },

  get: async () => {
    const messages = await fileSystemMessageRepository.getAll();
    return Promise.resolve(messages[messages.length - 1]);
  },

  getAll: async () => {
    const messages = JSON.parse(
      fs.readFileSync(path.join(__dirname, "message.json"), "utf8")
    );
    return Promise.resolve(messages);
  },

  getById: async (id) => {
    const messages = await fileSystemMessageRepository.getAll();
    return messages.filter((message) => message.id === id)[0];
  },
};
