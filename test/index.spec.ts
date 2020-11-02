import { readFileSync } from 'fs';

describe('e2e - Sncf parser', () => {
    it('should output the expected JSON content', () => {
        const outputFile = readFileSync('./tmp/out.json');
        const controlFile = readFileSync('./test/expected-output.json');

        expect(outputFile.toString()).toEqual(controlFile.toString());
    });
});
