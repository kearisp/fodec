import {Font, TTF} from "fonteditor-core";


export const encodeFont = (key: string, file: string|Buffer, ext: string) => {
    if(ext !== "ttf") {
        return null;
    }

    if(typeof file === "string") {
        file = Buffer.from(file);
    }

    const font = Font.create(file, {
        type: ext
    });

    const {glyf: list} = font.get();
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

        if(key.indexOf(char) === -1) {
            glyphs.push(glyph);
            continue;
        }

        const index = key.indexOf(char);
        const transformUnicode = key.charCodeAt((key.length - 1) / 2 + 1 + index);

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
};
