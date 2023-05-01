#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostMessageCommand,
  postMessageUseCase,
} from "./src/postMessage.useCase";
import { messageRepository } from "./src/message.inmemory.repository";

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
      .action((user, message) => {
        try {
          const postMessageCommand: PostMessageCommand = {
            id: "azeaze",
            author: user,
            text: message,
          };

          postMessageUseCase({
            messageRepository,
            dateProvider,
          }).handle(postMessageCommand);
          console.log("OK");
          console.table([messageRepository.get()]);
          process.exit(0);
        } catch (err) {
          console.error(err.message);
          process.exit(1);
        }
      })
  );

const main = async () => await program.parseAsync();
main();
