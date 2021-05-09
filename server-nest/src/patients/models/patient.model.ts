import { Address } from '../../common/models/address.model';

export class Patient {
    name: string;
    surname: string;
    personalIdentityNumber: string;
    dateBirth: Date;
    phoneNumber: string;
    address: Address;
}
