import { AddressDto } from '../../common/dto/address.dto';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsString()
  personalIdentityNumber: string;

  @ApiProperty()
  @Type(() => Date)
  dateBirth: Date;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @Type(() => AddressDto)
  address: AddressDto;
}
