import { Injectable, UnauthorizedException, OnModuleInit, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    try {
      const adminExists = await this.prisma.user.findFirst({
        where: { email: 'admin@cciama-tchad.com' }
      });
      if (!adminExists) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        await this.prisma.user.create({
          data: {
            email: 'admin@cciama-tchad.com',
            passwordHash,
            role: 'ADMIN',
            firstName: 'Admin',
            lastName: 'System'
          }
        });
        this.logger.log('Default admin user seeded: admin@cciama-tchad.com / admin123');
      }
    } catch (error) {
      this.logger.error('Failed to seed admin user', error);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.isActive) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    };
  }
}
