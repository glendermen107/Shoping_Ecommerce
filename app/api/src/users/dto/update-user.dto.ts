import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { RegisterAuthDto } from '../../auth/dto/register-auth.dto';
import { Role } from '../../auth/models/roles.model';

export class UpdateUserDto extends PartialType(RegisterAuthDto) {
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}
