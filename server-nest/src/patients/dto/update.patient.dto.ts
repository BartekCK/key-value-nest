import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create.patient.dto';
import { AddressDto } from '../../common/dto/address.dto';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdatePatientDto extends PartialType(OmitType(CreatePatientDto, ['address'])) {
    @ApiProperty({ type: () => PartialType(AddressDto), required: false })
    @Type(() => PartialType(AddressDto))
    @IsOptional()
    address?: Partial<AddressDto>;
}
