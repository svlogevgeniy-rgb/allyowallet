import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { RecoveryModule } from './modules/recovery/recovery.module';
import { AuditModule } from './modules/audit/audit.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { AttestationsModule } from './modules/attestations/attestations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100
      }
    ]),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: { singleLine: true, colorize: true }
              }
      }
    }),
    AuthModule,
    UsersModule,
    WalletsModule,
    PoliciesModule,
    TransactionsModule,
    RecoveryModule,
    AuditModule,
    BlockchainModule,
    AttestationsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
