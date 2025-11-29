import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Role } from './models/roles.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(registerAuthDto: RegisterAuthDto): Promise<User> {
    const { email, password } = registerAuthDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new ForbiddenException('El usuario ya existe');
    }

    const newUser = this.userRepository.create({
      email: email.toLowerCase(),
      password: password,
      roles: [Role.USER], // Rol por defecto
    });

    const savedUser = await this.userRepository.save(newUser);
    delete savedUser.password;
    return savedUser;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'roles'],
    });

    if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const tokens = await this.getTokens(user.id, user.email, user.roles);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    // Solo devolvemos el access_token, el refresh_token se enviará como cookie
    return {
      access_token: tokens.access_token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles
      }
    };
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    await this.userRepository.update(userId, { hashedRefreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'roles', 'hashedRefreshToken'],
    });

    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Acceso denegado.');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Acceso denegado.');
    }

    const tokens = await this.getTokens(user.id, user.email, user.roles);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    // Devolver tokens completos (se usará en el controlador)
    return tokens;
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { hashedRefreshToken });
  }

  private async getTokens(userId: number, email: string, roles: Role[]) {
    const jwtPayload = { sub: userId, email, roles };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'), // expiresIn se tomará de la configuración del módulo
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME', '7d'),
      }),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }
}