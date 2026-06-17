import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';

@Global()
@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.get<string>('KEYCLOAK_AUTH_SERVER_URL', 'http://localhost:8080'),
        realm: configService.get<string>('KEYCLOAK_REALM', 'cciama'),
        clientId: configService.get<string>('KEYCLOAK_CLIENT_ID', 'cciama-backend'),
        secret: configService.get<string>('KEYCLOAK_SECRET', 'keycloak_client_secret_placeholder'),
        cookieKey: 'KEYCLOAK_JWT',
        logLevels: ['warn', 'error'],
        useNestLogger: true,
      }),
    }),
  ],
  providers: [
    // Register global auth guards (Keycloak)
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [KeycloakConnectModule],
})
export class SecurityModule {}
