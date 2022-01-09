#!/usr/bin/env -S node --loader ts-node/esm -r dotenv/config ./src/index.ts
import "./env.ts";
import fetch from "node-fetch";

interface EbookType {
  name: "eBook";
  id: "ebook";
}

interface AudioBookType {
  name: "Audiobook";
  id: "audiobook";
}

interface Creator {
  id: string;
  role: string;
  name: string;
}

interface Publisher {
  name: string;
  id: string;
}

type BookType = EbookType | AudioBookType;

interface Book {
  id: string;
  isAvailable: boolean;
  isHoldable: true;
  // subjects: Subject[];
  creators: Creator[];
  publisher: Publisher;
  // languages: Language[];
  type: BookType;
  title: string;
}

const Book = {
  parse: (book: any): Book => {
    return {
      isAvailable: book.isAvailable,
      isHoldable: true,
      type: book.type,
      publisher: book.publisher,
      creators: book.creators,
      title: book.title,
      id: book.id,
    };
  },
};

type BookSearchResult = Book & { library: string };

const libraries = process.env.LIBRARIES?.split(",");
const query = process.argv[1];

if (!libraries) {
  console.log(
    "Specify libraries as a comma separated string in the `LIBRARIES` environment variable"
  );
  throw new Error("No libraries provided");
}

const results = libraries.flatMap(async (library: string) => {
  const url = `https://${library}.overdrive.com/search?format=audiobook-overdrive&query=${encodeURIComponent(
    query
  )}`;
  const result = await (await fetch(url)).text();
  const dataLine = result
    .split("\n")
    .filter((line) => line.includes("window.OverDrive.titleCollection"))[0];
  const assignmentIndex = dataLine.indexOf("=");
  const data = JSON.parse(
    dataLine.slice(assignmentIndex + 1, dataLine.length - 1)
  );
  const books: BookSearchResult[] = data.map(Book.parse).map((book: Book) => ({
    library,
    link: `https://${library}.overdrive.com/media/${book.id}`,
    ...book,
  }));
  return books;
});

console.log(JSON.stringify(await Promise.all(results)));
