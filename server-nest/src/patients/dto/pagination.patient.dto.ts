import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create.patient.dto';

export class PaginationPatientDto extends PartialType(CreatePatientDto) {}
