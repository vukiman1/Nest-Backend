import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'vukiman1', // Khóa bí mật phải giống với khóa trong auth.module.ts
    });
  }

  // Xử lý token sau khi được xác thực
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
