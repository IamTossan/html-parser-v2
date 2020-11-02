import { identity, compose } from '../core';

type Taskable = (reject: Function, resolve: Function) => unknown;

export default class Task {
    fork: Taskable;
    constructor(fork: Taskable) {
        this.fork = fork;
    }

    static rejected(x: any) {
        return new Task((reject: Function, _: Function) => reject(x));
    }

    // ----- Pointed (Task a)
    static of(x: Function) {
        return new Task((_: Function, resolve: Function) => resolve(x));
    }

    // ----- Functor (Task a)
    map(fn: Function) {
        return new Task((reject: Function, resolve: Function) =>
            this.fork(reject, compose(resolve, fn)),
        );
    }

    // ----- Applicative (Task a)
    ap(f: Task) {
        return this.chain((fn: Function) => f.map(fn));
    }

    // ----- Monad (Task a)
    chain(fn: Function) {
        return new Task((reject: Function, resolve: Function) =>
            this.fork(reject, (x: Function) => fn(x).fork(reject, resolve)),
        );
    }

    join() {
        return this.chain(identity);
    }
}

export const map = (fn: Function) => (i: Task) => i.map(fn);
