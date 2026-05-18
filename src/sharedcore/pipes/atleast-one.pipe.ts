import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class AtleastOneRequiredExceptID implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid data provided');
    }
    const { id, ...rest } = value;
    if (Object.keys(rest).length < 1) {
      throw new BadRequestException('Atleast one of the field is required');
    }
    return value;
  }
}
