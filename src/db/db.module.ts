import { Global, Module } from '@nestjs/common';
import { DrizzleService } from './drizzle/drizzle.service';

@Global()
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DbModule {
  // static forRoot(orm: OrmType = 'drizzle'): DynamicModule {
  //   // Choose the correct service class constructor based on the argument string
  //   const selectedClass = () => {
  //     // if (orm === 'prisma') { return PrismaService }
  //     return DrizzleService;
  //   };
  //   return {
  //     module: DbModule,
  //     global: true,
  //     providers: [
  //       // DrizzleService, // Still place both in the provider tree for compilation safety
  //       {
  //         provide: IDbClient,
  //         // Bind the interface token directly to your dynamically selected class
  //         useClass: selectedClass(),
  //         // useExisting: selectedClass(),
  //       },
  //     ],
  //     exports: [IDbClient],
  //   };
  // }
}
