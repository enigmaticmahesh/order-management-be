import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SubCatDTO {
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @IsString({ message: 'Category name must be string' })
  name!: string;

  @IsNotEmpty({ message: 'Category id cannot be empty' })
  @Transform(({ value }) => {
    // If it's a string like "25", Number("25") becomes 25
    // If it's a broken string like "abc", Number("abc") becomes NaN
    return value !== null && value !== undefined ? Number(value) : value;
  })
  @IsNumber(
    {},
    { message: 'Category id must be a valCategory id numeric value' },
  )
  @IsInt({
    message: 'Category id must be a whole integer number (no decimals)',
  })
  @Min(1, { message: 'Category id cannot be a negative number' })
  catId!: number;
}

export class DeleteSubCatDTO {
  @IsNotEmpty({ message: 'Sub Category id cannot be empty' })
  @Transform(({ value }) => {
    // If it's a string like "25", Number("25") becomes 25
    // If it's a broken string like "abc", Number("abc") becomes NaN
    return value !== null && value !== undefined ? Number(value) : value;
  })
  @IsNumber({}, { message: 'subcat id must be a valid numeric value' })
  @IsInt({ message: 'subcat id must be a whole integer number (no decimals)' })
  @Min(1, { message: 'subcat id cannot be a negative number' })
  id!: number;
}

export class UpdateSubCatDTO extends IntersectionType(
  DeleteSubCatDTO,
  PickType(SubCatDTO, ['name'] as const),
) {}

export class CatIDDTO {
  @IsNotEmpty({ message: 'Category id cannot be empty' })
  @Transform(({ value }) => {
    // If it's a string like "25", Number("25") becomes 25
    // If it's a broken string like "abc", Number("abc") becomes NaN
    return value !== null && value !== undefined ? Number(value) : value;
  })
  @IsNumber({}, { message: 'Category id must be a valid numeric value' })
  @IsInt({
    message: 'Category id must be a whole integer number (no decimals)',
  })
  @Min(1, { message: 'Category id cannot be a negative number' })
  catId!: number;
}
