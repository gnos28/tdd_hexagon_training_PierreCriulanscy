import { messageRepository } from "../message.inmemory.repository";
import {
  postMessageUseCase,
  Message,
  PostMessageCommand,
  MessageRepository,
  DateProvider,
  MessageTooLongError,
  EmptyMessageError,
} from "../postMessage.useCase";

describe("Feature : Posting a message", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: A message can contain a maximum of 280 caracters", () => {
    test("Alice can post a message on her timeline", () => {
      fixture.givenNowIs(new Date("2023-02-07T10:40:00.000Z"));
      fixture.whenUserPostAMessage({
        id: "message-id",
        text: "hello world",
        author: "Alice",
      });
      fixture.thenPostedMessageShouldBe({
        id: "message-id",
        text: "hello world",
        author: "Alice",
        publishedAt: new Date("2023-02-07T10:40:00.000Z"),
      });
    });
    test("Alice cannot post a message with more than 280 caracters", () => {
      const textWithLengthOf281 = Array(281).fill("a").join("");
      fixture.givenNowIs(new Date("2023-02-07T10:40:00.000Z"));
      fixture.whenUserPostAMessage({
        id: "message-id",
        text: textWithLengthOf281,
        author: "Alice",
      });
      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });
  describe("Rule: message cannot be empty", () => {
    test("Alice cannot post a message with an empty text", () => {
      fixture.givenNowIs(new Date("2023-02-07T10:40:00.000Z"));
      fixture.whenUserPostAMessage({
        id: "message-id",
        text: "",
        author: "Alice",
      });
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
    test("Alice cannot post a message with only spaces", () => {
      fixture.givenNowIs(new Date("2023-02-07T10:40:00.000Z"));
      fixture.whenUserPostAMessage({
        id: "message-id",
        text: "           ",
        author: "Alice",
      });
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});

const createFixture = () => {
  let thrownError: Error | undefined;
  let now: Date;

  const dateProvider: DateProvider = {
    getNow: () => now,
  };

  return {
    givenNowIs: (date: Date) => {
      now = date;
    },
    whenUserPostAMessage: (postMessageCommand: PostMessageCommand) => {
      try {
        thrownError = undefined;
        postMessageUseCase({
          messageRepository,
          dateProvider,
        }).handle(postMessageCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    thenPostedMessageShouldBe: (expectedMessage: Message) => {
      expect(expectedMessage).toEqual(messageRepository.get());
    },
    thenErrorShouldBe: (expectedError: new () => Error) => {
      expect(thrownError).toBeInstanceOf(expectedError);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
