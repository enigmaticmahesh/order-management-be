import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsISO8601,
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

export class CreateProductDTO {
  @IsNotEmpty({ message: 'Product name cannot be empty' })
  @IsString({ message: 'Product name must be string' })
  name!: string;

  @IsNotEmpty({ message: 'MRP cannot be empty' })
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
    { message: 'MRP must be a valid number or numeric string' },
  )
  mrp!: string;

  @IsNotEmpty({ message: 'Price cannot be empty' })
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
    { message: 'Price must be a valid number or numeric string' },
  )
  price!: string;

  @IsNotEmpty({ message: 'Quantity cannot be empty' })
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = Number(value);
    // If it's an unparseable string like "abc", return original value so @IsNumber catches it
    return Number.isNaN(parsed) ? value : parsed;
  })
  @IsNumber(
    {},
    {
      message: 'Quantity must be a valid non decimal number',
    },
  )
  @Min(1, { message: 'Quantity cannot be less than 1' })
  qty!: number;

  @IsNotEmpty()
  // 1. Transform the incoming ISO string ("2026-05-18") into a JS Date Object
  //   @Type(() => Date)
  //   // 2. Validate that it is a valid calendar date
  //   @IsDate({
  //     message: 'The manufactured date must be a valid ISO 8601 date string',
  //   })
  @IsISO8601()
  mfD!: string;

  @IsNotEmpty()
  //   @Type(() => Date)
  //   @IsDate({
  //     message: 'The expiry date must be a valid ISO 8601 date string',
  //   })
  @IsISO8601()
  expD!: string;

  @IsNotEmpty({ message: 'Product SKU cannot be empty' })
  @IsString({ message: 'Product SKU must be string' })
  sku!: string;

  @IsNotEmpty({ message: 'Bar code cannot be empty' })
  @IsString({ message: 'Bar code must be string' })
  barCode!: string;

  @IsNotEmpty({ message: 'HSN code cannot be empty' })
  @Transform(({ value }) => {
    // If it's a string like "25", Number("25") becomes 25
    // If it's a broken string like "abc", Number("abc") becomes NaN
    return value !== null && value !== undefined ? Number(value) : value;
  })
  @IsNumber({}, { message: 'HSN code id must be a valid numeric value' })
  @IsInt({
    message: 'HSN code id must be a whole integer number (no decimals)',
  })
  @Min(1, { message: 'HSN code id cannot be a negative number' })
  hsnId!: number;

  @IsNotEmpty({ message: 'Sub category cannot be empty' })
  @Transform(({ value }) => {
    // If it's a string like "25", Number("25") becomes 25
    // If it's a broken string like "abc", Number("abc") becomes NaN
    return value !== null && value !== undefined ? Number(value) : value;
  })
  @IsNumber({}, { message: 'Sub category id must be a valid numeric value' })
  @IsInt({
    message: 'Sub category id must be a whole integer number (no decimals)',
  })
  @Min(1, { message: 'Sub category id cannot be a negative number' })
  subcatId!: number;

  @IsNotEmpty({ message: 'Brand cannot be empty' })
  @Transform(({ value }) => {
    // If it's a string like "25", Number("25") becomes 25
    // If it's a broken string like "abc", Number("abc") becomes NaN
    return value !== null && value !== undefined ? Number(value) : value;
  })
  @IsNumber({}, { message: 'Brand id must be a valid numeric value' })
  @IsInt({
    message: 'Brand id must be a whole integer number (no decimals)',
  })
  @Min(1, { message: 'Brand id cannot be a negative number' })
  brandId!: number;
}

export class DeleteProductDTO {
  @IsNotEmpty({ message: 'Product id cannot be empty' })
  @Transform(({ value }) => {
    // If it's a string like "25", Number("25") becomes 25
    // If it's a broken string like "abc", Number("abc") becomes NaN
    return value !== null && value !== undefined ? Number(value) : value;
  })
  @IsNumber({}, { message: 'Product id must be a valid numeric value' })
  @IsInt({ message: 'Product id must be a whole integer number (no decimals)' })
  @Min(1, { message: 'Product id cannot be a negative number' })
  id!: number;
}

export class UpdateProductDTO extends IntersectionType(
  DeleteProductDTO,
  PartialType(CreateProductDTO),
) {}

export class PaginatedProductsQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString({ message: 'Product name must be string' })
  @MinLength(3, { message: 'Product name must be at least 3 characters long' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Product bar code must be string' })
  @MinLength(3, {
    message: 'Product bar code must be at least 3 characters long',
  })
  barCode?: string;

  @IsOptional()
  @IsString({ message: 'Product SKU must be string' })
  @MinLength(3, { message: 'Product SKU must be at least 3 characters long' })
  sku?: string;

  @IsOptional()
  @IsString({ message: 'HSN code ID must be string' })
  @MinLength(1, { message: 'HSN code ID must be at least 3 characters long' })
  hsnId?: string;

  @IsOptional()
  @IsString({ message: 'Brand ID must be string' })
  @MinLength(1, { message: 'Brand ID must be at least 3 characters long' })
  brandId?: string;

  @IsOptional()
  @IsString({ message: 'Subcategory ID must be string' })
  @MinLength(1, {
    message: 'Subcategory ID must be at least 3 characters long',
  })
  subcatId?: string;

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
