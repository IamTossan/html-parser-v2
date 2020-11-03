import { readFile, writeFile } from 'fs';

import Task from '../util/fp/task';

export const readTask = (filename: string) =>
    new Task((reject: Function, resolve: Function) => {
        readFile(filename, (err, data) => (err ? reject(err) : resolve(data)));
    });

export const writeTask = (path: string) => (data: string) =>
    new Task((reject: Function, resolve: Function) => {
        writeFile(path, data, (err) => (err ? reject(err) : resolve(data)));
    });
