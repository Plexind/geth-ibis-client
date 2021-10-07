import { Readable } from "stream";

export default interface Bucket {
    upload(key: string, file: Readable): Promise<void>;
    download(key: string): Promise<Readable>;
    delete(key: string): Promise<void>;
    listKeys(): Promise<string[]>;

    waitForEntryToExist(key: string, maxWaitTime: number): Promise<void>;
}