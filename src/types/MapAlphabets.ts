export const MapAlphabets = {
    latin: {
        lowerStart: 0x61,
        lowerLength: 26,
        upperStart: 0x41,
        upperLength: 26
    },
    cyrillic: {
        lowerStart: 0x430,
        lowerLength: 32,
        upperStart: 0x410,
        upperLength: 32
    },
    arabic: {
        lowerStart: 0x0620,
        lowerLength: 36,
        upperStart: 0x0620,
        upperLength: 36
    },
    greek: {
        lowerStart: 0x03B1,
        lowerLength: 25,
        upperStart: 0x0391,
        upperLength: 25
    }
};

export type AlphabetType = keyof typeof MapAlphabets;
