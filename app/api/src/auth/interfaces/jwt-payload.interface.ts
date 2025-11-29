import { Role } from '../models/roles.model';

export interface JwtPayload {
  sub: number; // 'sub' es el estándar JWT para el subject (user ID)
  email: string;
  roles: Role[];
}