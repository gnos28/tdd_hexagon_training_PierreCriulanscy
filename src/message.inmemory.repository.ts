import { Message, MessageRepository } from "./postMessage.useCase";

let message: Message;

export const messageRepository: MessageRepository = {
  save: (msg: Message) => {
    message = msg;
  },
  get: () => message
};
