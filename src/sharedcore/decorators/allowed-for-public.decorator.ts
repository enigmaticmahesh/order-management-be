import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'IS_PUBLIC';
export const PubliclyAllowed = () => SetMetadata(PUBLIC_KEY, true);
