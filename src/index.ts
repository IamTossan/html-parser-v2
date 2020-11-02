import { pipe, pickAt } from './util/fp/core';
import { map } from './util/fp/task';

import { readerTask, write } from './services/fileService';
import SncfParser from './parser/SncfParser';

const argv: string[] = process.argv;

export const clean = pipe(
    (i: string) => i.replace(/\\r\\n/g, ' ').trim(),
    (i: string) => i.replace(/\\\\/g, '\\'),
    (i: string) => i.replace(/\\"/g, '"'),
);

const getInputStringAsync = pipe(
    pickAt(2),
    readerTask,
    map(pipe(String, clean)),
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

    getInputStringAsync(argv).fork(console.error, (data: string) => {
        const tree = SncfParser.of(data);
        const outputJson = {
            status: 'ok',
            result: tree.parsedData,
        };
        const path = argv.length === 4 ? argv[4] : './tmp/out.json';
        write(path, JSON.stringify(outputJson, null, 2), () => {});
    });
}
