import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateVaccinationDto } from './dto/createVaccinationDto';
import { ApiTags } from '@nestjs/swagger';
import { VaccinationService } from './vaccination.service';

@ApiTags('vaccinations')
@Controller('vaccinations')
export class VaccinationController {
    constructor(private readonly vaccinationService: VaccinationService) {}
    @Post(':userId')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async saveVaccination(@Param('userId') userId: string, @Body() createVacDto: CreateVaccinationDto) {
        await this.vaccinationService.createNewTherm(userId, createVacDto);
    }

    @Post('/clean/db')
    async cleanUsedVaccinationDb() {
        await this.vaccinationService.cleanUsedVaccinationDb();
    }

    @Post('/clean/service')
    async cleanUsedVaccinationService() {
        await this.vaccinationService.cleanUsedVaccinationService();
    }
}
