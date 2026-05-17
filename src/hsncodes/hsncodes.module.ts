import { Module } from '@nestjs/common';
import { HsncodesController } from './hsncodes.controller';
import { HsncodesService } from './hsncodes.service';

@Module({
  controllers: [HsncodesController],
  providers: [HsncodesService]
})
export class HsncodesModule {}
