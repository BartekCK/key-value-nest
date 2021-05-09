import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
    @ApiProperty()
    @IsString()
    street: string;

    @ApiProperty()
    @IsString()
    homeNumber: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    zipCode: string;
}
