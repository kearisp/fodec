import {AlphabetType} from "./MapAlphabets";

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

type FontResource = {
    type: "font",
    format: string;
    name: string;
    path: string;
    output?: string;
};

type JsonResource = {
    type: "json",
    path: string;
    output?: string;
};
