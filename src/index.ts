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
    getInputStringAsync(argv).fork(console.error, (data: string) => {
        const tree = SncfParser.of(data);
        const outputJson = {
            status: 'ok',
            result: tree.parsedData,
        };
        write('./tmp/out.json', JSON.stringify(outputJson, null, 2), () => {});
    });
}
