import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'src/features/constant';

export class CreateEmployeeDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;

    @IsNotEmpty()
    @IsMongoId()
    department: string;

    @IsNotEmpty()
    @IsDate()
    dob: Date;

    @IsNotEmpty()
    @IsDate()
    joiningDate: Date;

    @IsNotEmpty()
    @IsString()
    address: string;
}
