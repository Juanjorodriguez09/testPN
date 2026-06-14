import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken {
    
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column('text')
    tokenHash!: string;

    @Column()
    expiresAt!: Date;

    @Column({ default: false })
    used!: boolean;

    @ManyToOne(
        () => User, 
        { onDelete: 'CASCADE' }
    )
    user!: User;

    @Column('text')
    userId!: string;

    @CreateDateColumn()
    createdAt!: Date;
}