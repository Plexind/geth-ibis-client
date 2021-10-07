import fs from 'fs';
import { Readable } from "stream";
import path from "path";
import config from "./config.json";
import S3Bucket from "./bucket/S3Bucket";
import Bucket from "./bucket/Bucket";


const main = async (): Promise<void> => {
    checkUsage();
    const filePath = getFilePath();
    const file = getFileStream(filePath);
    const fileName = getFileName(filePath);
    const destination = getDestination();
    await destination.upload(fileName, file);
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
    console.log("Usage: \nnode index.ts \<filePath>");
}

const getFileStream = (filePath: string): Readable => {
    return fs.createReadStream(filePath);
}

const getFilePath = (): string => {
    return process.argv[2];
}

const getFileName = (filePath: string): string => {
    return path.parse(filePath).base;
}

const getDestination = (): Bucket => {
    return new S3Bucket(config.awsBucketName, {
        region: config.awsRegion,
        credentials: {
            accessKeyId: config.awsAccessKeyId,
            secretAccessKey: config.awsSecretAccessKey
        }
    });
}

main();