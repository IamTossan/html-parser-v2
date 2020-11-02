import { NoParamCallback, readFile, writeFile } from 'fs';

import Task from '../util/fp/task';

export const readerTask = (filename: string) =>
    new Task((reject: Function, result: Function) => {
        readFile(filename, (err, data) => (err ? reject(err) : result(data)));
    });

export const write = (
    path: string,
    outputContent: string,
    cb: NoParamCallback,
) => writeFile(path, outputContent, cb);
