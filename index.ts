#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostMessageCommand,
  postMessageUseCase,
} from "./src/postMessage.useCase";
import { fileSystemMessageRepository } from "./src/message.fs.repository";

const program = new Command();

const dateProvider: DateProvider = {
  getNow: () => new Date(),
};

program
  .version("1.0.0")
  .description("crafty network")
  .addCommand(
    new Command("post")
      .argument("<user>", "the current user")
      .argument("<message>", "the message to post")
      .action(async (user, message) => {
        try {
          const postMessageCommand: PostMessageCommand = {
            id: "azeaze",
            author: user,
            text: message,
          };

          await postMessageUseCase({
            messageRepository: fileSystemMessageRepository,
            dateProvider,
          })(postMessageCommand);
          console.log("OK");
          console.table([await fileSystemMessageRepository.get()]);
          process.exit(0);
        } catch (err) {
          console.error(err.message);
          process.exit(1);
        }
      })
  );

const main = async () => await program.parseAsync();
main();
