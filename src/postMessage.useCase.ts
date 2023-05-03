import { MessageRepository } from "./message.repository";

export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
};

type PostMessageUseCaseProps = {
  messageRepository: MessageRepository;
  dateProvider: DateProvider;
};

export type DateProvider = {
  getNow: () => Date;
};

export class MessageTooLongError extends Error {}
export class EmptyMessageError extends Error {}

export const postMessageUseCase =
  ({ messageRepository, dateProvider }: PostMessageUseCaseProps) =>
  async (postMessageCommand: PostMessageCommand) => {
    if (postMessageCommand.text.length > 280) throw new MessageTooLongError();
    if (postMessageCommand.text.trim().length === 0)
      throw new EmptyMessageError();

    await messageRepository.save({
      id: postMessageCommand.id,
      text: postMessageCommand.text,
      author: postMessageCommand.author,
      publishedAt: dateProvider.getNow(),
    });
  };
