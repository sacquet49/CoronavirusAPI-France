/* eslint-disable @typescript-eslint/no-var-requires */
import {S3Service} from './../s3/s3.service';
import {TaskService} from './../task/task.service';
import {CovidData, TRANCHE_AGE} from './interface';
import {Injectable} from '@nestjs/common';
import {format, startOfYesterday} from 'date-fns';
import * as helper from '../helpers';

@Injectable()
export class DataService {

    constructor(private taskService: TaskService, private s3Service: S3Service) {
    }

    updateData(): void {
        this.taskService.getCovidDataFromFile();
    }

    async getDataByTypeAndSexAndDepartement(
        filtre: string,
        sex: string,
        departement: string,
    ): Promise<any[] | string> {
        const covidDataListDEP: any[] = await this.s3Service.getFileS3(
            'donnees-hospitalieres-covid19.json',
        );
        const hospitaliseParJour = covidDataListDEP.reduce((r, v, i, a, k = v.jour) => ((r[k] || (r[k] = []))
            .push(v), r), {});
        if (departement && departement !== 'undefined') {
            return Object.entries(hospitaliseParJour).map((hospJour: any[]) => hospJour['1']
                .filter((ha: any) => ha.dep === parseInt(departement))
                .reduce((r, v, i, a, k = v.sexe) => ((r[k] || (r[k] = [])).push(v[filtre]) , r), {})[sex])
                .map(ha => this.reduceAdd(ha));
        } else {
            return Object.entries(hospitaliseParJour).map((hospJour: any[]) => hospJour['1']
                .reduce((r, v, i, a, k = v.sexe) => ((r[k] || (r[k] = [])).push(v[filtre]) , r), {})[sex])
                .map(ha => this.reduceAdd(ha));
        }
    }

    async getDecesByDay(): Promise<any[] | string> {
        const covidDece: any[] = await this.s3Service.getFileS3(
            'donnees-hospitalieres-nouveaux-covid19.json',
        );
        const decesParJour = covidDece.reduce((r, v, i, a, k = v.jour) => ((r[k] || (r[k] = [])).push(v), r), {});
        return Object.entries(decesParJour).map((hospJour: any[]) => hospJour['1']
            .reduce((r, v, i, a, k = v.jour) => ((r[k] || (r[k] = [])).push(v.incid_dc) , r), {}))
            .map((j: any[]) => this.reduceAdd(Object.values(j)['0']));
    }

    async getLabelsDay(): Promise<any[] | string> {
        const covidLabelDay: any[] = await this.s3Service.getFileS3(
            'donnees-hospitalieres-nouveaux-covid19.json',
        );
        const covidLabels = covidLabelDay.reduce((r, v, i, a, k = v.jour) => ((r[k] || (r[k] = [])).push(v), r), {});
        return Object.entries(covidLabels).map((hospJour: any[]) => hospJour['0']);
    }

    async getLabelsDayByDate(dateMin, dateMax): Promise<any[] | string> {
        const covidLabelDay: any[] = await this.s3Service.getFileS3(
            'donnees-hospitalieres-classe-age-covid19.json',
        );
        const trancheAgeData = covidLabelDay.reduce((r, v, i, a, k = v.jour) => ((r[k] || (r[k] = [])).push(v), r), {});
        return Object.entries(trancheAgeData).map(hospJour => hospJour['0'])
            .filter((ha: any) => (dateMin && dateMax && dateMax !== 'undefined' && dateMin !== 'undefined') ? (ha >= dateMin && ha <= dateMax) : true);
    }

    async getHospitaliseByTrancheAge(
        typeStatSelected: string,
        dateMin: string,
        dateMax: string,
        region: string
    ): Promise<any[] | string> {
        const trancheAge: any[] = await this.s3Service.getFileS3(
            'donnees-hospitalieres-classe-age-covid19.json',
        );
        const trancheAgeData = trancheAge.reduce((r, v, i, a, k = v.cl_age90) => ((r[k] || (r[k] = [])).push(v), r), {});
        const evolutionByAge = [];
        TRANCHE_AGE.forEach(t => {
            t.data = this.getHospitaliseByAge(trancheAgeData[t.indice], typeStatSelected, dateMin, dateMax, region);
            evolutionByAge[t.indice] = [...t.data];
        });
        for (let i = 0; i < evolutionByAge['9'].length; i++) {
            const total = this.reduceAdd(evolutionByAge.map(t => t[i]));
            TRANCHE_AGE.forEach(t => {
                evolutionByAge[t.indice][i] = this.roundDecimal((evolutionByAge[t.indice][i] * 100) / total, 2);
            });
        }
        TRANCHE_AGE.forEach(t => {
            t.dataP = evolutionByAge[t.indice];
        });
        return TRANCHE_AGE;
    }

    async getHospitaliseTrancheAgeByDate(
        filtre: string,
        date: string,
    ): Promise<any[] | string> {
        const trancheAge: any[] = await this.s3Service.getFileS3(
            'donnees-hospitalieres-classe-age-covid19.json',
        );
        const trancheAgeData = trancheAge.reduce((r, v, i, a, k = v.jour) => ((r[k] || (r[k] = [])).push(v), r), {});
        return this.gethospitaliseByFilterAndDate(trancheAgeData, filtre, date);
    }

    async getHospitaliseVariationTrancheAgeByDate(
        filtre: string,
        dateMin: string,
        dateMax: string,
    ): Promise<any[] | string> {
        const trancheAge: any[] = await this.s3Service.getFileS3(
            'donnees-hospitalieres-classe-age-covid19.json',
        );
        const trancheAgeData = trancheAge.reduce((r, v, i, a, k = v.jour) => ((r[k] || (r[k] = [])).push(v), r), {});
        const dataRea = this.gethospitaliseByFilterAndDate(trancheAgeData, filtre, dateMin);
        const dataRea2 = this.gethospitaliseByFilterAndDate(trancheAgeData, filtre, dateMax);
        return dataRea.map((v, i) => this.roundDecimal((100 * (dataRea2[i] - v)) / v, 2));
    }

    getHospitaliseByAge(trancheAgeData: any[], typeStatSelected: string, dateMin: string, dateMax: string, region: string): any[] {
        const hospitalise = [];
        if (trancheAgeData) {
            Object.entries(trancheAgeData?.filter((ha: any) => {
                if (dateMin && dateMax && dateMax !== 'undefined' && dateMin !== 'undefined') {
                    return (ha.jour >= dateMin && new Date(ha.jour) <= this.addDays(dateMax, 1)) && ((region && region !== 'undefined' && region !== 'null') ? ha.reg === region : true);
                } else if (region && region !== 'undefined' && region !== 'null') {
                    return ha.reg === parseInt(region);
                } else {
                    return true;
                }
            })
                .reduce((r, v, i, a, k = v.jour) => ((r[k] || (r[k] = [])).push(v[typeStatSelected]) , r), {}))
                .map((ha: any) => hospitalise.push(this.reduceAdd(ha['1'])));
        }
        return hospitalise?.slice(1);
    }

    gethospitaliseByFilterAndDate(hospitaliseParJour: any[], filtre: string, date: string): any[] {
        const hospitalise = [];
        if (hospitaliseParJour[date]) {
            Object.entries(hospitaliseParJour[date]
                .reduce((r, v, i, a, k = v.cl_age90) => ((r[k] || (r[k] = [])).push(v[filtre]) , r), {}))
                .map((ha: any) => hospitalise.push(this.reduceAdd(ha['1'])));
        }
        return hospitalise.slice(1, 11);
    }

    reduceAdd(array: Array<any>): any {
        // tslint:disable-next-line:radix
        const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);
        return array?.reduce(reducer);
    }

    addDays(date, days): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    roundDecimal(nombre, precision): any {
        precision = precision || 2;
        const tmp = Math.pow(10, precision);
        return Math.round(nombre * tmp) / tmp;
    }
}
