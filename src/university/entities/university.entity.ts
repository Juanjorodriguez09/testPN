import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('universities')
export class University {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name!: string;

    @Column('text', {
        unique: true
    })
    nit!: string;

    @Column('text', { nullable: true })
    address?: string;

    @Column({type: 'varchar', length: 15})
    phone!: string;

    @OneToOne(
        () => User, 
        (user) => user.university, 
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