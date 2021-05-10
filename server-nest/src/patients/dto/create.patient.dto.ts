import { AddressDto } from '../../common/dto/address.dto';
import { IsDate, IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    surname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    personalIdentityNumber: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    dateBirth: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @ValidateNested()
    @IsDefined()
    @Type(() => AddressDto)
    address: AddressDto;
}
