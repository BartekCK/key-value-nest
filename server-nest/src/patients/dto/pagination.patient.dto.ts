import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create.patient.dto';
import { AddressDto } from '../../common/dto/address.dto';

export class PaginationPatientDto extends IntersectionType(
    PartialType(OmitType(CreatePatientDto, ['address'])),
    PartialType(AddressDto),
) {}
