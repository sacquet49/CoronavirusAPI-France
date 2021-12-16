import {CovidData} from './interface';
import {DataService} from './data.service';
import {Controller, Get, Param} from '@nestjs/common';

@Controller('data')
export class DataController {
    constructor(private dataService: DataService) {
    }

    @Get('live/france/all')
    async getAllData(): Promise<Promise<CovidData[] | string>> {
        return await this.dataService.getAllData();
    }

    @Get('live/france')
    async getLiveData(): Promise<Promise<CovidData[] | string>> {
        return await this.dataService.getLiveData();
    }

    @Get('live/departements')
    async getLiveDataByDep(): Promise<CovidData[] | string> {
        return this.dataService.getLiveDataForAllDepartement();
    }

    @Get('live/departement/:name')
    async getLiveDataByDepName(
        @Param('name') name: string,
    ): Promise<CovidData[] | string> {
        return await this.dataService.getLiveDataByDepartementName(name);
    }

    @Get('live/region/:name')
    async getLiveDataByRegName(
        @Param('name') name: string,
    ): Promise<CovidData[] | string> {
        return await this.dataService.getLiveDataByRegionName(name);
    }

    @Get('france-by-date/:date')
    async getDataFRByDate(
        @Param('date') date: string,
    ): Promise<Promise<CovidData[] | string>> {
        return await this.dataService.getDataFRByDate(date);
    }

    @Get('departements-by-date/:date')
    async getDataDepByDate(
        @Param('date') date: string,
    ): Promise<CovidData[] | string> {
        return await this.dataService.getDataDepartementByDate(date);
    }

    @Get('departement/:name')
    async getDataForOneDep(
        @Param('name') name: string,
    ): Promise<CovidData[] | string> {
        return await this.dataService.getDataByDepartementName(name);
    }

    @Get('departement/:name/:date')
    async getDataForOneDepByDate(
        @Param('name') name: string,
        @Param('date') date: string,
    ): Promise<CovidData[] | string> {
        return await this.dataService.getDataByDepartementNameByDate(name, date);
    }

    @Get('region/:name')
    async getDataByRegName(
        @Param('name') name: string,
    ): Promise<CovidData[] | string> {
        return this.dataService.getDataByRegionName(name);
    }

    @Get('region/:name/:date')
    async getDataByRegNameByDate(
        @Param('name') name: string,
        @Param('date') date: string,
    ): Promise<CovidData[] | string> {
        return await this.dataService.getDataByRegionNameByDate(name, date);
    }

    @Get(':filtre/:sex/:departement')
    async getDataBySexAndDepartement(
        @Param('filtre') filtre: string,
        @Param('sex') sex: string,
        @Param('departement') departement: string,
    ): Promise<CovidData[] | string> {
        return await this.dataService.getDataByTypeAndSexAndDepartement(filtre, sex, departement);
    }

    @Get('decesByDay')
    async getDecesByDay(): Promise<CovidData[] | string> {
        return await this.dataService.getDecesByDay();
    }

    @Get('labelsDay')
    async getLabelsDay(): Promise<CovidData[] | string> {
        return await this.dataService.getLabelsDay();
    }

    @Get('labelsDay/ByDate/:dateMin/:dateMax')
    async getLabelsDayByDate(@Param('dateMin') dateMin: string,
                             @Param('dateMax') dateMax: string
    ): Promise<CovidData[] | string> {
        return await this.dataService.getLabelsDayByDate(dateMin, dateMax);
    }

    @Get('trancheAge/:filtre/:dateMin/:dateMax/:region')
    async getHospitaliseByTrancheAge(
        @Param('filtre') filtre: string,
        @Param('dateMin') dateMin: string,
        @Param('dateMax') dateMax: string,
        @Param('region') region: string,
    ): Promise<any[] | string> {
        return await this.dataService.getHospitaliseByTrancheAge(filtre, dateMin, dateMax, region);
    }

    @Get('update')
    updateData(): void {
        return this.dataService.updateData();
    }
}
