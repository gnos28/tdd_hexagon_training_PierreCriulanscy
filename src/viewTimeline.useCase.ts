import { Message, TimeLineMessage } from "./message";
import { MessageRepository } from "./message.repository";
import { DateProvider } from "./postMessage.useCase";

type ViewTimelineQuery = {
  user: string;
};

type SortBy = <T>(
  fieldName: keyof Pick<
    T,
    { [K in keyof T]: T[K] extends number ? K : never }[keyof T]
  >
) => (itemA: T, itemB: T) => number;

type GenObj = { [key: string]: unknown };

const sortBy: SortBy =
  <GenObj>(fieldName) =>
  (itemA, itemB) =>
    itemA[fieldName] - itemB[fieldName];

const getPublicationTime = (publicationMinutes: number) => {
  if (publicationMinutes > 1) return `${publicationMinutes} minutes ago`;
  if (publicationMinutes === 1) return "1 minute ago";
  return "less than 1 minute ago";
};

type MessageToTimelineMessage = (nowTime: number) => (
  message: Message & {
    publishedAtTime: number;
  }
) => TimeLineMessage;

const messageToTimelineMessage: MessageToTimelineMessage =
  (nowTime) => (message) => {
    const publicationMinutes = Math.floor(
      (nowTime - message.publishedAtTime) / (60 * 1000)
    );

    const publicationTime = getPublicationTime(publicationMinutes);

    return {
      author: message.author,
      text: message.text,
      publicationTime,
    };
  };

type ViewTimelineUseCase = (injection: {
  messageRepository: MessageRepository;
  dateProvider: DateProvider;
}) => (query: ViewTimelineQuery) => Promise<TimeLineMessage[]>;

export const viewTimelineUseCase: ViewTimelineUseCase =
  ({ messageRepository, dateProvider }) =>
  async (query) => {
    const messages = await messageRepository.getAll();
    const nowTime = dateProvider.getNow().getTime();

    return messages
      .filter((message) => message.author === query.user)
      .map((message) => ({
        ...message,
        publishedAtTime: message.publishedAt.getTime(),
      }))
      .sort(sortBy("publishedAtTime"))
      .reverse()
      .map(messageToTimelineMessage(nowTime));
  };

// type Test = {
//   [key: string]: number;
// };

// type FilterConditionally<Source, Condition> = Pick<
//   Source,
//   { [K in keyof Source]: Source[K] extends Condition ? K : never }[keyof Source]
// >;

// type SortBy2 = <T>(
//   fieldName: keyof FilterConditionally<T, number>
// ) => (itemA: T, itemB: T) => number;

// type MessageKeyWithNumberValue = {
//   [K in keyof GenObj]: GenObj[K] extends number ? K : never;
// }[keyof GenObj];

// type SortBy3<T extends GenObj> = (
//   key: MessageKeyWithNumberValue
// ) => (itemA: T, itemB: T) => number;
