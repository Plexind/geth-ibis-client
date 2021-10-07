import BucketClient from "./BucketClient";
import S3Bucket from "./S3Bucket";
import Bucket from "./Bucket";
import { S3ClientConfig } from "@aws-sdk/client-s3";

export default class S3BucketClient implements BucketClient {
    private readonly region: string;

    constructor() {
        const region = process.env.AWS_REGION;
        console.assert(region);
        this.region = region as string;
    }

    public getBucket(bucketName: string): Bucket {
        const config: S3ClientConfig = {
            region: this.region
        };
        return new S3Bucket(bucketName, config);
    }

    public listBuckets(): string[] {
        throw new Error("not yet implemented");
    }
}