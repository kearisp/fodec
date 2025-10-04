import {Cli} from "@kearisp/cli";
import {promptText, promptSelect} from "@wocker/utils";
import {promises as FS, existsSync, mkdirSync} from "fs";
import Path from "path";
import {Fodec} from "../Fodec";
import {generateKey} from "../utils/generateKey";
import {Config} from "../types/Config";


export class App {
    protected readonly cli: Cli;

    public constructor() {
        this.cli = new Cli();

        this.cli.command("completion")
            .help({
                disabled: true
            })
            .action(() => {
                return this.cli.completionScript();
            });

        this.cli.command("init")
            .help({
                description: "Init"
            })
            .action(() => this.init());

        this.cli.command("gen")
            .action(() => this.generate());

        this.cli.command("build")
            .action(() => this.build());
    }

    protected async getConfig(): Promise<Config> {
        const configPath = "fodec.json";

        if(!existsSync(configPath)) {
            throw new Error("Config not found");
        }

        const res = await FS.readFile(configPath);

        return JSON.parse(res.toString());
    }

    protected async getKey(): Promise<string> {
        const res = await FS.readFile("fodec.key");

        return res.toString();
    }

    public async init(): Promise<void> {
        const configPath = "./fodec-2.json";

        if(existsSync(configPath)) {
            throw new Error("Config already exists");
        }

        let config: Config = {} as Config;

        config.basePath = await promptText({
            required: true,
            type: "string",
            message: "Base Path:",
            default: "src"
        });

        config.output = {
            path: await promptText({
                required: true,
                type: "string",
                message: "Output path:",
                default: "build"
            })
        };

        config.alphabets = await promptSelect({
            multiple: true,
            options: [
                "cyrillic",
                "latin"
            ]
        }) as Config["alphabets"];

        config.resources = [];

        await FS.writeFile(configPath, JSON.stringify(config, null, 4));
    }

    public async generate(): Promise<void> {
        const {alphabets} = await this.getConfig();

        const key = generateKey({
            alphabets
        });

        console.log(key);

        await FS.writeFile("fodec.key", key);
    }

    public async build(): Promise<void> {
        const key = await this.getKey();
        const {
            basePath = "./",
            output: {
                path: outPath = "./build"
            } = {},
            fonts,
            resources
        } = await this.getConfig();

        const fodec = new Fodec(key);

        for(const resource of resources) {
            let res: any;

            if(resource.type === "font") {
                const transformedFont = await fodec.transformFont(
                    Path.join(basePath, resource.path)
                );

                if(!transformedFont || transformedFont instanceof ArrayBuffer) {
                    continue;
                }

                res = transformedFont;
            }
            else if(resource.type === "json") {
                const json = await FS.readFile(
                    Path.join(basePath, resource.path)
                );

                const data = JSON.parse(json.toString());

                res = JSON.stringify(data, (key, value) => {
                    if(typeof value === "string") {
                        return fodec.transformText(value);
                    }

                    return value;
                }, 4);
            }

            if(res) {
                const outFullPath = Path.join(outPath, Path.dirname(resource.output || resource.path));

                mkdirSync(outFullPath, {
                    recursive: true
                });

                await FS.writeFile(
                    Path.join(outPath, resource.output || resource.path),
                    res
                );
            }
        }
    }

    public async run(): Promise<void> {
        try {
            const res = await this.cli.run(process.argv);

            if(res) {
                process.stdout.write(res);
                process.stdout.write("\n");
            }
        }
        catch(err) {
            process.stderr.write((err as Error).message);
            process.stdout.write("\n");
        }
    }
}
