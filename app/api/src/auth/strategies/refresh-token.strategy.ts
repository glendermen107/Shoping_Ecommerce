import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Función para extraer el refresh token desde la cookie
const extractRefreshTokenFromCookie = (req: Request): string | null => {
  if (req && req.cookies && req.cookies['refresh_token']) {
    return req.cookies['refresh_token'];
  }
  return null;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET no está definido en las variables de entorno');
    }
    super({
      jwtFromRequest: extractRefreshTokenFromCookie,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // Extraer el refresh token desde la cookie
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token no encontrado');
    }
    return { ...payload, refreshToken };
  }
}
