import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { MSG } from '../../common/helpers/validation-messages.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy, 'jwt' ) {

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }


    async validate( payload: JwtPayload ): Promise<User> {
        const { id, email, role } = payload;

        if (!id || !email || !role) {
            throw new UnauthorizedException(MSG.invalidToken());
        }

        const user = await this.userRepository.findOneBy({ id });

        if ( !user ) 
            throw new UnauthorizedException(MSG.invalidToken())
            
        if ( !user.isActive ) 
            throw new UnauthorizedException(MSG.inactiveUser());

        return user;
    }

}