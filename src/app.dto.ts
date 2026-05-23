// import { HttpStatus } from '@nestjs/common';

import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ApiResponseDTO<T = any> {
  //   statusCode: number;
  message: string;
  @Transform(({ value }) =>
    value === null || value === undefined ? undefined : value,
  )
  data?: T;
  //   timestamp: string;

  constructor(options: {
    // statusCode?: HttpStatus;
    message?: string;
    data?: T;
  }) {
    // this.statusCode = options.statusCode ?? HttpStatus.OK;
    this.message = options.message || 'Success';
    // Only assign data if it is provided
    if (options.data !== undefined) {
      this.data = options.data;
    }
    // this.timestamp = new Date().toISOString();
  }
}

export class PaginationQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page number must be an integer' })
  @Min(1, { message: 'Page number must be at least 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page limit must be an integer' })
  @Min(1, { message: 'Page limit must be at least 1' })
  @Max(100, { message: 'Page limit cannot exceed 100' })
  limit: number = 10;
}
