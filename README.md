# Library Search

I'm deliberately not mentioning the service or libraries I use here.

I use multiple libraries. Searching them one by one isn't fun. Now, a CLI I can
use to search them at the same time. Didn't make a website because I assume I
would have to deal with CORS.

## Installation

```sh
npm install --global https://github.com/hughrawlinson/library-search
```

## Usage

Use a comma separated environmental variable to specify which libraries to
search. Use the first argument to specify the query.

```sh
LIBRARIES="fls,afls" library-search "a fictional book"
```
