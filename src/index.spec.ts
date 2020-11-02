import { clean } from '.';

describe('src/index', () => {
    describe('clean', () => {
        it('should remove all \\r\\n', () => {
            const actualResponse = clean('lol\r\n');

            expect(actualResponse).toEqual('lol');
        });

        it('should replace all \\" immediately followed with a char with \'"\'', () => {
            const actualResponse = clean('\\"lol\\"');

            expect(actualResponse).toEqual('"lol"');
        });
    });
});
