/* eslint-disable @typescript-eslint/no-var-requires */
import {ConfigService} from '@nestjs/config';
import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import axios from 'axios';
import {PutObjectCommand, PutObjectCommandOutput, S3Client,} from '@aws-sdk/client-s3';
import {CSV} from "../data/interface";
const {StringStream} = require('scramjet');
const Papa = require('papaparse');

@Injectable()
export class TaskService {

    constructor(private configService: ConfigService) {
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    getCovidDataFromFile(): void {
        const uploadFileS3 = async (
            data: string,
            filename: string,
        ): Promise<PutObjectCommandOutput> => {
            const jsonContent: string = JSON.stringify(data);
            const s3client = new S3Client({
                credentials: {
                    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
                },
                region: this.configService.get('AWS_REGION'),
            });
            const bucketParams = {
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Body: jsonContent,
                Key: filename,
            };
            return await s3client.send(new PutObjectCommand(bucketParams));
        };

        const getAllCsv = async (): Promise<void> => {
            const req = await axios({
                method: 'GET',
                url: 'https://www.data.gouv.fr/api/2/datasets/5e7e104ace2080d9162b61d8/resources/',
                responseType: 'json',
            });
            const jsonDataFilter: any[] = req.data.data.filter(j => !j.title.includes('metadonnees'));
            for (let i = 0; i < 9; i++) {
                CSV[i].id = jsonDataFilter[i].id;
                getDataByUrl(jsonDataFilter[i].latest, i);
            }
        };

        const getDataByUrl = async (url, i): Promise<void> => {
            const req = await axios({
                method: 'GET',
                url: `${url}`,
                responseType: 'stream',
            });
            const csvData = req.data.pipe(new StringStream());
            Papa.parse(csvData, {
                dynamicTyping: true,
                header: true,
                complete: function (result) {
                    uploadFileToS3(result, i);
                },
            });
        };

        const uploadFileToS3 = (result, i) => {
            uploadFileS3(result.data, CSV[i].nom + '.json');
            new Promise(resolve => setTimeout(resolve, 20000));
            console.log(CSV[i].nom + '.json : File has been uploaded');
        }

        getAllCsv();
    }
}
