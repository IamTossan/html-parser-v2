# html-parser-v2

## Project setup

```
npm install
```

## Scripts

```
npm run build             build the project into the ./dist/ folder
npm run start             build the project and parse the sample file into the ./tmp folder
npm run dev               run in development mode
npm run lint              run eslint
npm run prettier          run prettier
npm run test              run the unit tests
npm run test-watch        run test unit tests in development mode
npm run test-cov          run test unit tests with coverage report
npm run test-e2e          run the end-to-end test with the sample html file
```

## Context

This is a remake of a [technical test I did for my previous job](https://github.com/IamTossan/html-parser). This time I decided to not rush too much as there is no deadline and take more appropriate choices like writing a parser since I did not find any acceptable choice (even the first time).
Emphasis have been put on using coherently OOP and FP and find better solutions for some hacky code that I did in the past, here's an example:

```
// not so good
const rawInput = getInput(source)
const sanitizedInput = sanitizeInput(rawInput)
const formattedInput = formatInput(sanitizedInput)

// better
const output = flow(
  getInput,
  sanitize,
  format,
)
```

Also, I decided not to worry too much on the business side with questions like "How often is the source material likely to change (structurally)".
In other words, I tried to make this project so that could be used realistically for long-term, technically sound and cheap to maintain.

## Notes

-   expect the e2e test to fail since the `passengers` field really does not make any sense
-   the getters in the SncfParser are kinda hard-coded but in a real situation, I would ask some question to the product side to make sure the code design is right for the situation
-   eslint/prettier are not used enough automatized thus lots of eslint errors
-   I could have used some `Position` class to traverse a `HtmlTree` but it shouldn't be hard to implement if need be
-   Everything should be easy to work on, long-term-wise (maintainability right?)
