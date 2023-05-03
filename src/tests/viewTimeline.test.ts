import { Message, TimeLineMessage } from "../message";
import { messageRepository } from "../message.inmemory.repository";
import { DateProvider } from "../postMessage.useCase";
import { viewTimelineUseCase } from "../viewTimeline.useCase";

const aliceMessage1: Message = {
  author: "Alice",
  text: "My first message",
  id: "message_1",
  publishedAt: new Date("2023-02-07T16:00:00.000Z"),
};
const aliceMessage2: Message = {
  author: "Alice",
  text: "My second message",
  id: "message_3",
  publishedAt: new Date("2023-02-07T16:06:00.000Z"),
};
const bobMessage1: Message = {
  author: "Bob",
  text: "Hi it's bob",
  id: "message_2",
  publishedAt: new Date("2023-02-07T16:05:00.000Z"),
};
const aliceMessage3: Message = {
  author: "Alice",
  text: "My third message",
  id: "message_4",
  publishedAt: new Date("2023-02-07T16:06:30.000Z"),
};

const messageToTimelineMessage = (
  message: Message,
  publicationTime: string
) => ({
  author: message.author,
  text: message.text,
  publicationTime,
});

describe("Feature: Viewing a personnal timeline", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: Message are show in reverse chrono order", () => {
    test("Alice can view the 2 messages she published in her timeline", async () => {
      fixture.givenNowIs(new Date("2023-02-07T16:07:00.000Z"));

      fixture.givenTheFollowingMessagesExist([
        aliceMessage1,
        bobMessage1,
        aliceMessage2,
        aliceMessage3,
      ]);

      await fixture.whenUserSeesTheTimelineOf("Alice");

      fixture.thenTheUserShouldSee([
        messageToTimelineMessage(aliceMessage3, "less than 1 minute ago"),
        messageToTimelineMessage(aliceMessage2, "1 minute ago"),
        messageToTimelineMessage(aliceMessage1, "7 minutes ago"),
      ]);
    });
  });
});

const createFixture = () => {
  let now: Date;
  let timeLine: TimeLineMessage[] = [];
  const dateProvider: DateProvider = { getNow: () => now };

  return {
    givenNowIs: (date: Date) => {
      now = date;
    },
    givenTheFollowingMessagesExist: (messages: Message[]) => {
      messageRepository.saveAll(messages);
    },
    whenUserSeesTheTimelineOf: async (user: Message["author"]) => {
      timeLine = await viewTimelineUseCase({ messageRepository, dateProvider })(
        { user }
      );
    },
    thenTheUserShouldSee: (expectedTimeline: TimeLineMessage[]) => {
      expect(timeLine).toEqual(expectedTimeline);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
