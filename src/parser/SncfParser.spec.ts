import { readFileSync } from 'fs';
import ScnfParser from './SncfParser';

describe('src/parser/SncfParser', () => {
    let hydratedTree: ScnfParser;

    beforeAll(() => {
        const inputFile = readFileSync(
            './src/parser/test-file.html',
        ).toString();
        hydratedTree = ScnfParser.of(inputFile);
    });

    describe('parsedData', () => {
        it('should return the expected data object', () => {
            const expectedResult = {
                trips: [
                    {
                        code: 'SNIKXP',
                        name: 'dupont',
                        details: {
                            price: 768.5,
                            roundTrips: [
                                {
                                    type: 'Aller',
                                    date: 'Vendredi 2 Septembre',
                                    trains: [
                                        {
                                            departureTime: '16:57',
                                            departureStation:
                                                'PARIS GARE DE LYON',
                                            arrivalTime: '18:56',
                                            arrivalStation: 'LYON PART DIEU',
                                            type: 'TGV',
                                            number: '6687',
                                        },
                                    ],
                                },
                                {
                                    type: 'Retour',
                                    date: 'Dimanche 4 Septembre',
                                    trains: [
                                        {
                                            departureTime: '13:05',
                                            departureStation: 'LYON PART DIEU',
                                            arrivalTime: '15:01',
                                            arrivalStation:
                                                'PARIS GARE DE LYON',
                                            type: 'TGV',
                                            number: '6618',
                                        },
                                    ],
                                },
                                {
                                    type: 'Aller',
                                    date: 'Jeudi 15 Septembre',
                                    trains: [
                                        {
                                            departureTime: '16:37',
                                            departureStation:
                                                'PARIS GARE DE LYON',
                                            arrivalTime: '19:17',
                                            arrivalStation: 'AVIGNON TGV',
                                            type: 'TGV',
                                            number: '6121',
                                        },
                                    ],
                                },
                                {
                                    type: 'Retour',
                                    date: 'Dimanche 18 Septembre',
                                    trains: [
                                        {
                                            departureTime: '15:42',
                                            departureStation: 'AVIGNON TGV',
                                            arrivalTime: '18:30',
                                            arrivalStation:
                                                'PARIS GARE DE LYON',
                                            type: 'TGV',
                                            number: '6122',
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ],
                custom: {
                    prices: [
                        {
                            value: 315.5,
                        },
                        {
                            value: 378,
                        },
                        {
                            value: 75,
                        },
                    ],
                },
            };
            expect(hydratedTree.parsedData).toEqual(expectedResult);
        });
    });
});
