import { AddressDto } from '../../common/dto/address.dto';

export class CreatePatientDto {
  name: string;
  surname: string;
  personalIdentityNumber: string;
  dateBirth: Date;
  phoneNumber: string;
  address: AddressDto;
}
