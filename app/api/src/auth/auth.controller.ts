import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import type { Request, Response } from 'express';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);

    // Extraer el refresh_token del resultado interno
    const tokens = await this.authService['getTokens'](result.user.id, result.user.email, result.user.roles);

    // Configurar cookie httpOnly con el refresh token
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/',
    });

    // Devolver solo el access_token y datos del usuario
    return result;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // El JwtStrategy retorna el User completo, que se adjunta a req.user
    const user = req.user as any;

    if (!user || !user.id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    await this.authService.logout(user.id);

    // Limpiar la cookie del refresh token
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logout exitoso' };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.user!['sub'];
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      res.clearCookie('refresh_token');
      throw new UnauthorizedException('Refresh token no encontrado');
    }

    const tokens = await this.authService.refreshTokens(userId, refreshToken);

    // Actualizar cookie con el nuevo refresh token
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Devolver solo el nuevo access_token
    return {
      access_token: tokens.access_token,
      user: {
        id: userId,
        email: req.user!['email'],
        roles: req.user!['roles']
      }
    };
  }
}