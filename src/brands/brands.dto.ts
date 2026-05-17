import { IntersectionType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class BrandDTO {
  @IsNotEmpty({ message: 'Brand name cannot be empty' })
  @IsString({ message: 'Brand name must be string' })
  brand!: string;
}

export class DeleteBrandDTO {
  @IsNotEmpty({ message: 'Brand id cannot be empty' })
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

export class UpdateBrandDTO extends IntersectionType(
  DeleteBrandDTO,
  BrandDTO,
) {}
