import {AlphabetType} from "./MapAlphabets";
import {FontResource} from "./FontResource";
import {JsonResource} from "./JsonResource";


export type Config = {
    basePath?: string;
    output?: {
        path: string;
    };
    alphabets: AlphabetType[];
    fonts: {
        name: string;
        path: string;
    }[];
    resources: (FontResource | JsonResource)[];
};
