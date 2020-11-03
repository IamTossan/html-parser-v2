import { pipe, pickAt, prop } from './util/fp/core';
import { map } from './util/fp/task';

import { readTask, writeTask } from './services/fileService';
import SncfParser from './parser/SncfParser';

const { argv } = process;

export const clean = pipe(
    (i: string) => i.replace(/\\r\\n/g, ' ').trim(),
    (i: string) => i.replace(/&nbsp;/g, ' '),
    (i: string) => i.replace(/\\\\/g, '\\'),
    (i: string) => i.replace(/\\"/g, '"'),
);

const getInputStringAsync = pipe(pickAt(2), readTask, map(pipe(String, clean)));

const getParsedJson = pipe(
    getInputStringAsync,
    map(pipe(SncfParser.of, prop('parsedData'))),
);

if (require.main === module) {
    if (argv.length < 3) {
        console.error('Not enough arguments');
        console.log('node ./dist/src/index.js <SOURCE_FILE>');
        console.log(
            'node ./dist/src/index.js <SOURCE_FILE> <DESTINATION_FILE>',
        );
        process.exit(1);
    }
    const path = argv.length === 4 ? argv[3] : './tmp/out.json';

    getParsedJson(argv)
        .map(
            pipe(
                (json: string) => ({
                    status: 'ok',
                    result: json,
                }),
                (i) => JSON.stringify(i, null, 2),
            ),
        )
        .chain(writeTask(path))
        .fork(console.error, (outputJson: string) => {
            console.log(outputJson);
            console.log(`\nfile parsed successfully: ${path}`);
        });
}
