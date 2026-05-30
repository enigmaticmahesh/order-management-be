import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { PaginationDirection, PaginationQueryDTO } from '@/app.dto';

export class CreateHsnCodeDTO {
  @IsNotEmpty({ message: 'HSN code cannot be empty' })
  @IsString({ message: 'HSN code must be string' })
  code!: string;

  @IsNotEmpty({ message: 'SGST cannot be empty' })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return value;

    const parsedNumber = Number(value);
    // If the input is malicious text like 'abc', return it as-is so @IsNumberString catches it
    if (isNaN(parsedNumber)) return value;

    if (parsedNumber < 0) {
      throw new BadRequestException(`Price cannot be a negative number`);
    }

    return parsedNumber.toFixed(2); // Outputs format like "1200.00" or "99.95"
  })
  // 2. Validates that the final value remains a clean numeric string
  @IsNumberString(
    {},
    { message: 'SGST must be a valid number or numeric string' },
  )
  sgst!: string;
}

export class DeleteHsnCodeDTO {
  @IsNotEmpty({ message: 'HSN code id cannot be empty' })
  @Transform(({ value }) => {
    // If it's a string like "25", Number("25") becomes 25
    // If it's a broken string like "abc", Number("abc") becomes NaN
    return value !== null && value !== undefined ? Number(value) : value;
  })
  @IsNumber({}, { message: 'id must be a valid numeric value' })
  @IsInt({ message: 'id must be a whole integer number (no decimals)' })
  @Min(1, { message: 'id cannot be a negative number' })
  id!: number;
}

export class UpdateHsnCodeDTO extends IntersectionType(
  DeleteHsnCodeDTO,
  PartialType(CreateHsnCodeDTO),
) {}

export class PaginatedHSNCodesQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString({ message: 'HSN Code must be string' })
  @MinLength(3, { message: 'HSN Code must be at least 3 characters long' })
  code?: string;

  @IsOptional()
  @Type(() => Number) // Converts the incoming string query/param to a real number
  @IsNumber()
  cursor?: number; // This acts like a cursor, which will contain the last id or first id depending on the direction

  @IsOptional()
  @IsEnum(PaginationDirection, {
    message: 'direction must be either "next" or "prev"',
  })
  dir?: PaginationDirection;
}
