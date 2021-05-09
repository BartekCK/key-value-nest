import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create.patient.dto';

export class PaginationPatientDto extends PartialType(CreatePatientDto) {}
