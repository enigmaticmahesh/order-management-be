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

export class CategoryDTO {
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @IsString({ message: 'Category name must be string' })
  name!: string;
}

export class DeleteCategoryDTO {
  @IsNotEmpty({ message: 'Category id cannot be empty' })
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

export class UpdateCategoryDTO extends IntersectionType(
  DeleteCategoryDTO,
  CategoryDTO,
) {}

export class PaginatedCategoriesQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString({ message: 'Category name must be string' })
  @MinLength(3, { message: 'Category name must be at least 3 characters long' })
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
