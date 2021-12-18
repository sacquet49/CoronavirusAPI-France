import {CovidData} from './interface';
import {DataService} from './data.service';
import {Controller, Get, Param} from '@nestjs/common';

@Controller('data')
export class DataController {
    constructor(private dataService: DataService) {
    }

    @Get(':filtre/:sex/:departement')
    async getDataBySexAndDepartement(
        @Param('filtre') filtre: string,
        @Param('sex') sex: string,
        @Param('departement') departement: string,
    ): Promise<CovidData[] | string> {
        return await this.dataService.getDataByTypeAndSexAndDepartement(filtre, sex, departement);
    }

    @Get('hospCourant/byDate/:filtre/:sex/:departement/:dateMin/:dateMax')
    async getDataByTypeAndSexAndDepartementAndDate(
        @Param('filtre') filtre: string,
        @Param('sex') sex: string,
        @Param('departement') departement: string,
        @Param('dateMin') dateMin: string,
        @Param('dateMax') dateMax: string,
    ): Promise<any[] | string> {
        return await this.dataService.getDataByTypeAndSexAndDepartementAndDate(filtre, sex, departement, dateMin, dateMax);
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

    @Get('hospitalise/:filtre/trancheAge/byDate/:date')
    async getHospitaliseTrancheAgeByDate(
        @Param('filtre') filtre: string,
        @Param('date') date: string
    ): Promise<any[] | string> {
        return await this.dataService.getHospitaliseTrancheAgeByDate(filtre, date);
    }

    @Get('hospitalise/variation/:filtre/trancheAge/byDate/:dateMin/:dateMax')
    async getHospitaliseVariationTrancheAgeByDate(
        @Param('filtre') filtre: string,
        @Param('dateMin') dateMin: string,
        @Param('dateMax') dateMax: string
    ): Promise<any[] | string> {
        return await this.dataService.getHospitaliseVariationTrancheAgeByDate(filtre, dateMin, dateMax);
    }

    @Get('update')
    updateData(): void {
        return this.dataService.updateData();
    }
}
