import { PaginationDirection, PaginationQueryDTO } from '@/app.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

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
export class PaginatedBrandsQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString({ message: 'Brand name must be string' })
  @MinLength(3, { message: 'Brand name must be at least 3 characters long' })
  search?: string;

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
