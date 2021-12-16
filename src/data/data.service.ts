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

    async getAllData(): Promise<CovidData[] | string> {
        const covidDataListFR: CovidData[] = await this.s3Service.getFileS3(
            'covidDataFR.json',
        );
        return covidDataListFR.length
            ? covidDataListFR
            : 'No data found';
    }

    async getLiveData(): Promise<CovidData[] | string> {
        const covidDataListFR: CovidData[] = await this.s3Service.getFileS3(
            'covidDataFR.json',
        );
        const yesterdayDate: string = format(startOfYesterday(), 'yyyy-MM-dd');
        const todayDate: string = format(new Date(), 'yyyy-MM-dd');
        let yesterdayData: CovidData[] | null = null;
        const dataOfToday: CovidData[] = covidDataListFR.filter(
            (data: CovidData) => data.date === todayDate,
        );

        if (!dataOfToday.length) {
            yesterdayData = covidDataListFR.filter(
                (data: CovidData) => data.date === yesterdayDate,
            );
        }
        return dataOfToday.length
            ? dataOfToday
            : yesterdayData.length
                ? yesterdayData
                : 'No data found';
    }

    async getLiveDataForAllDepartement(): Promise<CovidData[] | string> {
        const covidDataListDEP: CovidData[] = await this.s3Service.getFileS3(
            'covidDataDep.json',
        );
        const yesterdayDate: string = format(startOfYesterday(), 'yyyy-MM-dd');
        const todayDate: string = format(new Date(), 'yyyy-MM-dd');
        let yesterdayData: CovidData[] | null = null;
        const dataOfToday: CovidData[] = covidDataListDEP.filter(
            (data: CovidData) => data.date === todayDate,
        );

        if (!dataOfToday.length) {
            yesterdayData = covidDataListDEP.filter(
                (data: CovidData) => data.date === yesterdayDate,
            );
        }

        return dataOfToday.length
            ? dataOfToday
            : yesterdayData.length
                ? yesterdayData
                : 'No data found';
    }

    async getLiveDataByDepartementName(
        name: string,
    ): Promise<CovidData[] | string> {
        const covidDataListDEP: CovidData[] = await this.s3Service.getFileS3(
            'covidDataDep.json',
        );
        const yesterdayDate: string = format(startOfYesterday(), 'yyyy-MM-dd');
        const todayDate: string = format(new Date(), 'yyyy-MM-dd');
        let yesterdayData: CovidData[] | null = null;
        const dataOfToday: CovidData[] = covidDataListDEP.filter(
            (data: CovidData) =>
                data.date === todayDate &&
                helper.removeAccentAndLowercase(data.lib_dep) ===
                helper.removeAccentAndLowercase(name),
        );
        if (!dataOfToday.length) {
            yesterdayData = covidDataListDEP.filter(
                (data: CovidData) =>
                    data.date === yesterdayDate &&
                    helper.removeAccentAndLowercase(data.lib_dep) ===
                    helper.removeAccentAndLowercase(name),
            );
        }
        return dataOfToday.length
            ? dataOfToday
            : yesterdayData.length
                ? yesterdayData
                : 'No data found';
    }

    async getLiveDataByRegionName(name: string): Promise<CovidData[] | string> {
        const covidDataListDEP: CovidData[] = await this.s3Service.getFileS3(
            'covidDataDep.json',
        );
        const yesterdayDate: string = format(startOfYesterday(), 'yyyy-MM-dd');
        const todayDate: string = format(new Date(), 'yyyy-MM-dd');
        let yesterdayData: CovidData[] | null = null;
        const dataOfToday: CovidData[] = covidDataListDEP.filter(
            (data: CovidData) =>
                data.date === todayDate &&
                helper.removeAccentAndLowercase(data.lib_reg) ===
                helper.removeAccentAndLowercase(name),
        );
        if (!dataOfToday.length) {
            yesterdayData = covidDataListDEP.filter(
                (data: CovidData) =>
                    data.date === yesterdayDate &&
                    helper.removeAccentAndLowercase(data.lib_reg) ===
                    helper.removeAccentAndLowercase(name),
            );
        }
        return dataOfToday.length
            ? dataOfToday
            : yesterdayData.length
                ? yesterdayData
                : 'No data found';
    }

    async getDataByDepartementName(name: string): Promise<CovidData[] | string> {
        const covidDataListDEP: CovidData[] = await this.s3Service.getFileS3(
            'covidDataDep.json',
        );
        const dataByDepepartment: CovidData[] = covidDataListDEP.filter(
            (data: CovidData) =>
                helper.removeAccentAndLowercase(data.lib_dep) ===
                helper.removeAccentAndLowercase(name),
        );
        return dataByDepepartment.length ? dataByDepepartment : 'No data found';
    }

    async getDataByRegionName(name: string): Promise<CovidData[] | string> {
        const covidDataListDEP: CovidData[] = await this.s3Service.getFileS3(
            'covidDataDep.json',
        );
        const dataByDepartement: CovidData[] = covidDataListDEP.filter(
            (data: CovidData) =>
                helper.removeAccentAndLowercase(data.lib_reg) ===
                helper.removeAccentAndLowercase(name),
        );
        return dataByDepartement.length ? dataByDepartement : 'No data found';
    }

    async getDataDepartementByDate(date: string): Promise<CovidData[] | string> {
        const covidDataListDEP: CovidData[] = await this.s3Service.getFileS3(
            'covidDataDep.json',
        );
        const dataByDate: CovidData[] = covidDataListDEP.filter(
            (data: CovidData) => data.date === format(new Date(date), 'yyyy-dd-MM'),
        );
        return dataByDate.length ? dataByDate : 'No data found';
    }

    async getDataFRByDate(date: string): Promise<CovidData[] | string> {
        const covidDataListFR: CovidData[] = await this.s3Service.getFileS3(
            'covidDataFR.json',
        );
        const dataByDate: CovidData[] = covidDataListFR.filter(
            (data: CovidData) => data.date === format(new Date(date), 'yyyy-dd-MM'),
        );
        return dataByDate.length ? dataByDate : 'No data found';
    }

    async getDataByDepartementNameByDate(
        name: string,
        date: string,
    ): Promise<CovidData[] | string> {
        const covidDataListDEP: CovidData[] = await this.s3Service.getFileS3(
            'covidDataDep.json',
        );
        const dataByDepartment: CovidData[] = covidDataListDEP.filter(
            (data: CovidData) =>
                helper.removeAccentAndLowercase(data.lib_dep) ===
                helper.removeAccentAndLowercase(name) &&
                data.date === format(new Date(date), 'yyyy-dd-MM'),
        );
        return dataByDepartment.length ? dataByDepartment : 'No data found';
    }

    async getDataByRegionNameByDate(
        name: string,
        date: string,
    ): Promise<CovidData[] | string> {
        const covidDataListDEP: CovidData[] = await this.s3Service.getFileS3(
            'covidDataDep.json',
        );
        const dataByRegion: CovidData[] = covidDataListDEP.filter(
            (data: CovidData) =>
                helper.removeAccentAndLowercase(data.lib_reg) ===
                helper.removeAccentAndLowercase(name) &&
                data.date === format(new Date(date), 'yyyy-dd-MM'),
        );
        return dataByRegion.length ? dataByRegion : 'No data found';
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
