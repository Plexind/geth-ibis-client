import fs from 'fs';
import { Readable } from "stream";
import path from "path";
import Bucket from "./bucket/Bucket";
import S3BucketClient from "./bucket/S3BucketClient";


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
    console.assert(process.env.S3BUCKET_NAME, "No bucket name provided");
    return new S3BucketClient().getBucket(String(process.env.S3BUCKET_NAME));
}

main();