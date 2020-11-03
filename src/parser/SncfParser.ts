import HtmlTree, { IHtmlTree } from '../util/htmlTree';

export default class SncfParser extends HtmlTree {
    static parseInput(i: string) {
        return i.replace(/<=>/g, '');
    }

    static of(i: string) {
        return new SncfParser(SncfParser.parseInput(i));
    }

    getRoundtrip(tree: IHtmlTree, n: number, offset: number) {
        const commonTree = SncfParser.getNode(tree, [
            { tagName: 'table', nth: 3 * n + offset + 3 },
            { tagName: 'tbody', nth: 0 },
        ]);

        const type = SncfParser.getNode(commonTree, [
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
        ]).value?.trim();
        const date = SncfParser.getNode(tree, [
            { tagName: 'table', nth: 3 * n + offset + 2 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
        ]).value?.trim();

        const departureTime = SncfParser.getNode(commonTree, [
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 1 },
        ])
            .value?.trim()
            .replace('h', ':');
        const departureStation = SncfParser.getNode(commonTree, [
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 2 },
        ]).value?.trim();
        const arrivalTime = SncfParser.getNode(commonTree, [
            { tagName: 'tr', nth: 1 },
            { tagName: 'td', nth: 0 },
        ])
            .value?.trim()
            .replace('h', ':');
        const arrivalStation = SncfParser.getNode(commonTree, [
            { tagName: 'tr', nth: 1 },
            { tagName: 'td', nth: 1 },
        ]).value?.trim();
        const trainType = SncfParser.getNode(commonTree, [
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 3 },
        ]).value?.trim();
        const number = SncfParser.getNode(commonTree, [
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 4 },
        ]).value?.trim();
        return {
            type,
            date,
            trains: [
                {
                    departureTime,
                    departureStation,
                    arrivalTime,
                    arrivalStation,
                    type: trainType,
                    number,
                },
            ],
        };
    }

    get roundtrips() {
        const commonTree = SncfParser.getNode(this._tree, [
            { tagName: 'html', nth: 0 },
            { tagName: 'body', nth: 0 },
            { tagName: 'div', nth: 0 },
            { tagName: 'table', nth: 1 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
            { tagName: 'table', nth: 0 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
        ]);

        return [0, 1, 2, 3].map((n, idx) => {
            const offset = Math.floor(idx / 2);
            return this.getRoundtrip(commonTree, n, offset);
        });
    }

    get details() {
        const price = SncfParser.getNode(this._tree, [
            { tagName: 'html', nth: 0 },
            { tagName: 'body', nth: 0 },
            { tagName: 'div', nth: 0 },
            { tagName: 'table', nth: 1 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
            { tagName: 'table', nth: 2 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
            { tagName: 'table', nth: 2 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 1 },
        ])
            .value?.replace('€', '')
            .replace(',', '.');

        return {
            price: parseFloat(price || '0'),
            roundTrips: this.roundtrips,
        };
    }

    get trips() {
        const metaData = SncfParser.getNode(this._tree, [
            { tagName: 'html', nth: 0 },
            { tagName: 'body', nth: 0 },
            { tagName: 'div', nth: 0 },
            { tagName: 'table', nth: 1 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
            { tagName: 'table', nth: 1 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
            { tagName: 'table', nth: 2 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
        ]);

        const code = SncfParser.getNode(metaData, [
            { tagName: 'td', nth: 0 },
            { tagName: 'span', nth: 0 },
        ]).value?.trim();
        const name = SncfParser.getNode(metaData, [
            { tagName: 'td', nth: 1 },
            { tagName: 'span', nth: 0 },
        ]).value?.trim();

        return [
            {
                code,
                name,
                details: this.details,
            },
        ];
    }

    get custom() {
        const commonTree = SncfParser.getNode(this._tree, [
            { tagName: 'html', nth: 0 },
            { tagName: 'body', nth: 0 },
            { tagName: 'div', nth: 0 },
            { tagName: 'table', nth: 1 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
            { tagName: 'table', nth: 0 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 0 },
        ]);
        const price1 = SncfParser.getNode(commonTree, [
            { tagName: 'table', nth: 1 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 6 },
        ])
            .value?.replace('€', '')
            .replace(',', '.');

        const price2 = SncfParser.getNode(commonTree, [
            { tagName: 'table', nth: 8 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 6 },
        ])
            .value?.replace('€', '')
            .replace(',', '.');

        const price3 = SncfParser.getNode(commonTree, [
            { tagName: 'div', nth: 0 },
            { tagName: 'div', nth: 0 },
            { tagName: 'table', nth: 1 },
            { tagName: 'tbody', nth: 0 },
            { tagName: 'tr', nth: 0 },
            { tagName: 'td', nth: 2 },
        ])
            .value?.replace('€', '')
            .replace(',', '.');

        return {
            prices: [
                { value: parseFloat(price1 || '0') },
                { value: parseFloat(price2 || '0') },
                { value: parseFloat(price3 || '0') },
            ],
        };
    }

    get parsedData() {
        return {
            trips: this.trips,
            custom: this.custom,
        };
    }
}
