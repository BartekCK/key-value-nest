import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVaccinationDto {

    @ApiProperty()
    @IsNumber()
    @Max(2)
    @Min(1)
    count: number;

    @ApiProperty()
    @IsDate()
    @Type(()=> Date)
    date: Date;
}
