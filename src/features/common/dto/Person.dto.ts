import { IsDateString, IsEmail, IsEnum, IsMobilePhone, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Gender } from "src/features/constant";

export class PersonDto {
    @IsMongoId()
    admin: string;

    @IsOptional()
    @IsMongoId()
    user: string;

    @IsEmail()
    email: string;

    @IsNotEmpty({ message: "Mobile is required" })
    @IsMobilePhone("bn-BD")
    mobile: string;

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
    @IsDateString()
    dob: Date;

    @IsNotEmpty()
    @IsDateString()
    joiningDate: Date;

    @IsNotEmpty()
    @IsString()
    address: string;
}