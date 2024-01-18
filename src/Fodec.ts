import Path from "path";
import {promises as FS} from "fs";
import {Font, TTF} from "fonteditor-core";


export class Fodec {
    public constructor(
        protected key: string
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
        return this.transformFontV1(fontPath);
    }

    public async transformFontV1(fontPath: string) {
        const ext = Path.extname(fontPath).slice(1);

        if(ext !== "ttf") {
            return;
        }

        const font = Font.create(await FS.readFile(fontPath), {
            type: ext
        });

        const {glyf: list,} = font.get();
        const glyphs: TTF.Glyph[] = [];

        for(let i = 0; i < list.length; i++) {
            const glyph = list[i];
            const char = glyph.unicode
                ? String.fromCharCode(glyph.unicode[0])
                : null;

            if(!char) {
                glyphs.push(glyph);
                continue;
            }

            if(this.key.indexOf(char) === -1) {
                glyphs.push(glyph);
                continue;
            }

            const index = this.key.indexOf(char);
            const transformUnicode = this.key.charCodeAt((this.key.length - 1) / 2 + 1 + index);

            const rand = list.find((item) => {
                if(!item.unicode) {
                    return;
                }

                return item.unicode[0] === transformUnicode;
            });

            if(!rand) {
                glyphs.push(glyph);
                continue;
            }

            glyphs.push({
                ...glyph,
                name: rand.name,
                unicode: rand.unicode
            });
        }

        font.set({
            ...font.get(),
            glyf: glyphs
        });

        return font.write({
            type: ext
        });
    }
}
