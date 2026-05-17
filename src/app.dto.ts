// import { HttpStatus } from '@nestjs/common';

import { Transform } from 'class-transformer';

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
