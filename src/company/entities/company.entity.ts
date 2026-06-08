import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IndustryType } from '../enum/industry.enum';

@Entity('companies')
export class Company {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({
        type: 'varchar',
        unique: true,
        length: 100
    })
    nit!: string;

    @Column({
        type: 'enum',
        enum: IndustryType
    })
    industry!: IndustryType

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({type: 'varchar', length: 15})
    phone!: string;

    @OneToOne(
        () => User, 
        (user) => user.company, 
        { eager: true }
    )
    @JoinColumn({ name: 'userId' })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ select: false })
    deletedAt?: Date;
}
