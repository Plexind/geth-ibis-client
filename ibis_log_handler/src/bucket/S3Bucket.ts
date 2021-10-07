import Bucket from "./Bucket";
import {
    DeleteObjectCommandInput,
    GetObjectCommandInput,
    ListObjectsCommandInput,
    PutObjectCommandInput,
    S3,
    S3Client,
    S3ClientConfig,
    waitUntilObjectExists
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { WaiterState } from "@aws-sdk/util-waiter";

export default class S3Bucket implements Bucket {
    private readonly bucketName: string;

    private readonly s3Bucket: S3;

    private readonly s3Client: S3Client;

    constructor(bucketName: string, config: S3ClientConfig) {
        this.bucketName = bucketName;
        this.s3Bucket = new S3(config);
        this.s3Client = new S3Client(config);
    }

    public async delete(key: string): Promise<void> {
        const command: DeleteObjectCommandInput = {
            Bucket: this.bucketName,
            Key: key
        };
        await this.s3Bucket.deleteObject(command);
    }

    public async download(key: string): Promise<Readable> {
        const command: GetObjectCommandInput = {
            Bucket: this.bucketName,
            Key: key
        };
        const result = await this.s3Bucket.getObject(command);
        console.assert(result.Body);
        return result.Body as Readable;
    }

    public async listKeys(): Promise<string[]> {
        const command: ListObjectsCommandInput = {
            Bucket: this.bucketName
        };
        const result = await this.s3Bucket.listObjects(command);
        return result.Contents?.map(item => item.Key ?? "NO_KEY") ?? [];
    }

    public async upload(key: string, file: Readable): Promise<void> {
        const command: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: key,
            Body: file
        };
        await this.s3Bucket.putObject(command);
    }

    public async waitForEntryToExist(key: string, maxWaitTime: number): Promise<void> {
        const res = await waitUntilObjectExists(
            {
                client: this.s3Client,
                maxWaitTime: maxWaitTime
            },
            {
                Key: key,
                Bucket: this.bucketName
            }
        );

        if (res.state !== WaiterState.SUCCESS) {
            throw new Error("waiting timed out or failed");
        }
    }
}