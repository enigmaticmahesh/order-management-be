import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateHsnCodeDTO {
  @IsNotEmpty({ message: 'HSN code cannot be empty' })
  @IsString({ message: 'HSN code must be string' })
  code!: string;

  @IsNotEmpty({ message: 'SGST cannot be empty' })
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = Number(value);
    // If it's an unparseable string like "abc", return original value so @IsNumber catches it
    return Number.isNaN(parsed) ? value : parsed;
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'SGST must be a valid decimal number with up to 2 decimal places',
    },
  )
  @Min(0, { message: 'SGST cannot be negative' })
  sgst!: number;
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

// import { createZodDto } from 'nestjs-zod';
// import { z } from 'zod';
import { DbHsnCode, HsnCode } from './hsncodes.interface';

// const createHsnCode = z.object({
//   code: z
//     .string({
//       error: 'HSN code must be a string',
//     })
//     .trim() // ⚡ Highly Recommended: Removes leading/trailing whitespaces before checking length
//     .min(1, { message: 'HSN code cannot be empty or just spaces' }),
//   sgst: z
//     .number({
//       error: 'SGST must be a valid number',
//     })
//     .nonnegative({ error: 'SGST cannot be negative number' })
//     .refine((value) => Number.isInteger(value * 100), {
//       message: 'SGST cannot have more than 2 decimal places',
//     }),
// });

// const deleteHsnCode = z.object({
//   id: z.coerce
//     .number({ error: 'id should be a number' })
//     .positive({ error: 'id should be a positive number greater than 0' }),
// });

// const updateHsnCode = deleteHsnCode
//   .extend(createHsnCode.partial().shape)
//   .refine(
//     ({ sgst, code }) => [sgst, code].some((value) => value !== undefined),
//     {
//       message: 'At least one field required',
//     },
//   );

// export class CreateHsnCodeDTO extends createZodDto(createHsnCode) {}
// export class UpdateHsnCodeDTO extends createZodDto(updateHsnCode) {}
// export class DeleteHsnCodeDTO extends createZodDto(deleteHsnCode) {}

export const createDbHsnCode = (hsnCodeData: HsnCode): DbHsnCode => {
  return { ...hsnCodeData, sgst: hsnCodeData.sgst.toString() };
};
