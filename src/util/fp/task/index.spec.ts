import Task from '.';

describe('src/util/fp/task', () => {
    describe('Task', () => {
        describe('of', () => {
            it('should return an new instance', () => {
                const task = Task.of('lol');

                expect(task).toBeInstanceOf(Task);
            });
        });

        describe('rejected', () => {
            it('should return a rejected value', () => {
                const task = Task.rejected('lol');

                expect(task).toBeInstanceOf(Task);
            });
        });

        describe('map (functor)', () => {
            it('should apply a function', async () => {
                const task = Task.of('lol');

                const actualResult = await new Promise((resolve) => {
                    task.map((i: string) => i.toUpperCase()).fork(() => {},
                    resolve);
                });

                expect(actualResult).toEqual('LOL');
            });
        });

        describe('chain (monad)', () => {
            it('should apply another Task without nesting', async () => {
                const task = Task.of('lol');

                const actualResult = await new Promise((resolve) => {
                    task.chain((i: string) => {
                        return Task.of(`${i} + j`);
                    }).fork(() => {}, resolve);
                });

                expect(actualResult).toEqual('lol + j');
            });
        });

        describe('join', () => {
            it('should remove one Task container', async () => {
                const task = Task.of('lol');
                const wrapperTask = Task.of(task);

                const actualResult = await new Promise((resolve) => {
                    wrapperTask.join().fork(() => {}, resolve);
                });

                const expectedResult = await new Promise((resolve) => {
                    Task.of('lol').fork(() => {}, resolve);
                });
                expect(actualResult).toEqual(expectedResult);
            });
        });

        describe('ap (applicative functor)', () => {
            it('should apply another Task to current Task', async () => {
                const add = (a: number) => (b: number) => a + b;
                const actualResult = await new Promise((resolve) => {
                    Task.of(add)
                        .ap(Task.of(1))
                        .ap(Task.of(2))
                        .fork(() => {}, resolve);
                });

                expect(actualResult).toEqual(3);
            });
        });
    });
});
