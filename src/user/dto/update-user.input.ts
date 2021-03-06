import { InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsString()
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'Invalid characters.' })
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Invalid e-mail.' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Invalid password.' })
  @IsOptional()
  password?: string;
}
