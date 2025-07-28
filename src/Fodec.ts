import Path from "path";
import {promises as FS} from "fs";
import {encodeFont} from "./utils/encodeFont";


export class Fodec {
    public constructor(
        protected readonly key: string
    ) {}

    public transformText(str: string): string {
        return str.split("").map((char) => {
            const index = this.key.indexOf(char);

            return index !== -1 ? this.key.charAt(index + 1 + (this.key.length - 1) / 2) : char;
        }).join("");
    }

    public async transformJson(data: any) {
        return data;
    }

    public async transformFont(fontPath: string) {
        const file = await FS.readFile(fontPath),
              ext = Path.extname(fontPath).slice(1);

        return encodeFont(this.key, file, ext);
    }
}
