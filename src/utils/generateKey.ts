import {shuffle} from "./shuffle";
import {MapAlphabets, AlphabetType} from "../types/MapAlphabets";


type Options = {
    alphabets: AlphabetType[];
};

export const generateKey = (options: Options): string => {
    const {
        alphabets
    } = options;

    return Object.keys(MapAlphabets).reduce<string[]>((res: string[], key: string) => {
        if(!alphabets.includes(key as AlphabetType)) {
            return res;
        }

        const {
            lowerStart,
            lowerLength,
            upperStart,
            upperLength
        } = MapAlphabets[key as AlphabetType];

        const indexes = [
            ...Array.from({length: lowerLength}, (_, i) => lowerStart + i),
            ...Array.from({length: upperLength}, (_, i) => upperStart + i)
        ];
        const moved = indexes.slice();

        shuffle(moved);

        return [
            res[0] + String.fromCharCode(...indexes),
            res[1] + String.fromCharCode(...moved)
        ];
    }, ["", ""] as string[]).join("\n");
};
