import { Address } from '../../common/models/address.model';
import { CreatePatientDto } from '../dto/create.patient.dto';
import { Vaccination } from '../../common/models/vaccination.model';

export class Patient {
    constructor({ address, dateBirth, name, personalIdentityNumber, phoneNumber, surname }: CreatePatientDto) {
        this.name = name;
        this.surname = surname;
        this.personalIdentityNumber = personalIdentityNumber;
        this.dateBirth = dateBirth;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    name: string;
    surname: string;
    personalIdentityNumber: string;
    dateBirth: Date;
    phoneNumber: string;
    address: Address;
    vaccinationReservations: Vaccination[] = [];
}
