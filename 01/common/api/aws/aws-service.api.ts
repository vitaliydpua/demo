import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { DeleteObjectsRequest, PutObjectRequest } from 'aws-sdk/clients/s3';
import { Subject } from 'rxjs';

import { AwsServiceApiConfigProvider } from '../config/aws-config.provider';

import { EFileContentType } from './enums/file-content-type.enum';

export interface AwsServiceApiConfig {
    fullUrl: string;
    accessKeyId: string;
    secretAccessKey: string;
    rootBucket: string;
    region?: string;
}

@Injectable()
export class AwsServiceApi {
    private readonly s3: S3;
    private readonly awsConfig: AwsServiceApiConfig;

    constructor(private readonly awsConfigProvider: AwsServiceApiConfigProvider) {
        this.awsConfig = awsConfigProvider.getConfig();
        this.s3 = new S3({
            credentials: {
                accessKeyId: this.awsConfig.accessKeyId,
                secretAccessKey: this.awsConfig.secretAccessKey,
            },
            endpoint: this.awsConfig.fullUrl,
            s3ForcePathStyle: true,
        });
    }

    async uploadFile(fileContentType: EFileContentType, filename: string, content: Buffer): Promise<S3.ManagedUpload.SendData> {
        const uploadParameters: PutObjectRequest = {
            Bucket: `${this.awsConfig.rootBucket}`,
            Key: filename,
            Body: content,
            ContentType: fileContentType,
            ACL: 'public-read',
        };
        return await this.s3
            .upload(uploadParameters, (err, _) => {
                if (err) {
                    throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
                }
            })
            .promise();
    }

    async deleteFiles(fileNames: string[], bucketPath?: string): Promise<boolean> {
        const deleteObjects = fileNames.map((filename) => ({
            Key: bucketPath ? `${bucketPath}/${filename}` : filename,
        }));
        const params: DeleteObjectsRequest = {
            Bucket: `${this.awsConfig.rootBucket}`,
            Delete: {
                Objects: deleteObjects,
            },
        };
        const subject = new Subject<boolean>();

        this.s3.deleteObjects(params, (err, _) => {
            if (err) {
                console.error(err);
                subject.next(false);
                subject.complete();
            }

            subject.next(true);
            subject.complete();
        });

        return subject.toPromise();
    }

    public generateFileLink(filename: string): string {
        //return `https://${this.awsConfig.rootBucket}.${this.awsConfig.fullUrl}/${filename}`;
        return `${this.awsConfig.fullUrl}/${this.awsConfig.rootBucket}/${filename}`;
    }
}
