import fs from 'fs';
import FileDestination from "./FileDestination/FileDestination";

const main = async (): Promise<void> => {
    checkUsage();
    const fileName = getFileName();
    const file = await readFile(fileName);
    const destination = {} as FileDestination; // TODO: create a concrete implementation for S3
    await destination.put(file);
    console.log("done");
}

const checkUsage = (): void => {
    const args = process.argv;
    if (args.length !== 3) {
        printUsage();
        throw new Error("Invalid invocation - incorrect number of arguments");
    }
}

const printUsage = (): void => {
    console.log("Usage: \nnode index.ts <filepath>");
}

const getFileName = (): string => {
    const args = process.argv;
    return args[2];
}

const readFile = async (fileName: string): Promise<Buffer> => {
    return new Promise(resolve => {
        fs.readFile(fileName, (err,data): void => {
            if (err) {
                console.log(err);
                throw new Error("Error reading file");
            }
            resolve(data);
        });
    });
}

main();