declare const process: {
  argv: string[];
};

declare const Bun: {
  write(path: string, contents: string): Promise<number>;
};
