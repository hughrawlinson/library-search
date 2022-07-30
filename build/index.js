#!/usr/bin/env -S node
/*#!/usr/bin/env -S node --loader ts-node/esm ./src/index.ts*/
import fetch from "node-fetch";
const Book = {
    parse: (book) => {
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
const libraries = process.env.LIBRARIES?.split(",");
const query = process.argv[process.argv.length - 1];
let format = "audiobook-overdrive";
if (process.argv[process.argv.length - 2].includes("book")) {
    format = "ebook-kindle";
}
if (!libraries) {
    console.log("Specify libraries as a comma separated string in the `LIBRARIES` environment variable");
    throw new Error("No libraries provided");
}
const results = libraries.flatMap(async (library) => {
    const url = `https://${library}.overdrive.com/search?format=${format}&query=${encodeURIComponent(query)}`;
    const result = await (await fetch(url)).text();
    const dataLine = result
        .split("\n")
        .filter((line) => line.includes("window.OverDrive.titleCollection"))[0];
    const assignmentIndex = dataLine.indexOf("=");
    const data = JSON.parse(dataLine.slice(assignmentIndex + 1, dataLine.length - 1));
    const books = data.map(Book.parse).map((book) => ({
        library,
        link: `https://${library}.overdrive.com/media/${book.id}`,
        ...book,
    }));
    return books;
});
console.log(JSON.stringify(await Promise.all(results), null, 2));
