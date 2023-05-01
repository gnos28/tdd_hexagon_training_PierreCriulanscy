export type Message = {
  id: string;
  author: string;
  text: string;
  publishedAt: Date;
};
export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
};

type PostMessageUseCaseProps = {
  messageRepository: MessageRepository;
  dateProvider: DateProvider;
};

export type MessageRepository = {
  save: (message: Message) => void;
  get: () => Message
};

export type DateProvider = {
  getNow: () => Date;
};

export class MessageTooLongError extends Error {}
export class EmptyMessageError extends Error {}

export const postMessageUseCase = ({
  messageRepository,
  dateProvider,
}: PostMessageUseCaseProps) => ({
  handle: (postMessageCommand: PostMessageCommand) => {
    if (postMessageCommand.text.length > 280) throw new MessageTooLongError();
    if (postMessageCommand.text.trim().length === 0) throw new EmptyMessageError();

    messageRepository.save({
      id: postMessageCommand.id,
      text: postMessageCommand.text,
      author: postMessageCommand.author,
      publishedAt: dateProvider.getNow(),
    });
  },
});
