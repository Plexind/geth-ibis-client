import Bucket from "./Bucket";

export default interface BucketClient {
    listBuckets(): string[];
    getBucket(bucketName: string): Bucket;
}