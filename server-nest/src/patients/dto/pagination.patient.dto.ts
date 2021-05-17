import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create.patient.dto';
import { AddressDto } from '../../common/dto/address.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaginationPatientDto extends IntersectionType(
    PartialType(OmitType(CreatePatientDto, ['address'])),
    PartialType(AddressDto),
) {
    @ApiProperty({required: false})
    @IsString()
    key?: string;
}
