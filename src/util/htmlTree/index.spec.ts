import HtmlTree, { getTagName } from '.';

describe('util/htmlTree', () => {
    describe('getTagName', () => {
        it('should get the tag name (basic case)', () => {
            const actualResponse = getTagName('div>');

            expect(actualResponse).toEqual('div');
        });

        it('should get the tag name (self-closing tag)', () => {
            const actualResponse = getTagName('br>');

            expect(actualResponse).toEqual('br');
        });

        it('should get the tag name (with attributes)', () => {
            const actualResponse = getTagName(
                'meta http-equiv="Content-Type" content="text/html; charset=utf-8">',
            );

            expect(actualResponse).toEqual('meta');
        });
    });

    it('should init a tree', () => {
        const input =
            '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Confirmation de votre commande</title></head>';

        const tree = new HtmlTree(input);

        const expectedResult = {
            tagName: '',
            children: [
                {
                    tagName: 'head',
                    children: [
                        { tagName: 'meta', children: [] },
                        {
                            tagName: 'title',
                            children: [],
                            value: 'Confirmation de votre commande',
                        },
                    ],
                },
            ],
        };
        expect(tree.tree).toEqual(expectedResult);
    });

    it('should init a tree (pointed function)', () => {
        const input =
            '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Confirmation de votre commande</title></head>';

        const tree = HtmlTree.of(input);

        const expectedResult = {
            tagName: '',
            children: [
                {
                    tagName: 'head',
                    children: [
                        { tagName: 'meta', children: [] },
                        {
                            tagName: 'title',
                            children: [],
                            value: 'Confirmation de votre commande',
                        },
                    ],
                },
            ],
        };
        expect(tree.tree).toEqual(expectedResult);
    });
});
