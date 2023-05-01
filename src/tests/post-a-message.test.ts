describe("Feature : Posting a message", () => {
  describe("Rule: A message can contain a maximum of 280 caracters", () => {
    test("Alice can post a message on her timeline", () => {
      givenNowIs(new Date("2023-02-07T10:40:00.000Z"));
      whenUserPostAMessage({
        id: "message-id",
        text: "hello world",
        author: "Alice",
      });
      thenPostedMessageShouldBe({
        id: "message-id",
        text: "hello world",
        author: "Alice",
        publishedAt: new Date("2023-02-07T10:40:00.000Z"),
      });
    });
  });
});

let message: { id: string; author: string; text: string; publishedAt: Date };
let now: Date;

const givenNowIs = (_now: Date) => {
  now = _now;
};

const whenUserPostAMessage = (postMessageCommand: {
  id: string;
  text: string;
  author: string;
}) => {
  message = {
    id: postMessageCommand.id,
    text: postMessageCommand.text,
    author: postMessageCommand.author,
    publishedAt: now,
  };
};

const thenPostedMessageShouldBe = (expectedMessage: {
  id: string;
  text: string;
  author: string;
  publishedAt: Date;
}) => {
  expect(expectedMessage).toEqual(message);
};
