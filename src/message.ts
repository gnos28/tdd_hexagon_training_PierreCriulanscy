export type Message = {
  id: string;
  author: string;
  text: string;
  publishedAt: Date;
};

export type TimeLineMessage = Pick<Message, "author" | "text"> & {
  publicationTime: string;
};
