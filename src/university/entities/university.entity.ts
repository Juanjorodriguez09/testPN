import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Student } from '../../student/entities/student.entity';
import { Partnership } from '../../partnership/entities/partnership.entity';

@Entity('universities')
export class University {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name!: string;

    @Column({
        type: 'varchar',
        unique: true,
        length: 100
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

    @OneToMany(
        () => Student,
        (student) => student.university
    )
    students?: Student[]

    @OneToMany(
        () => Partnership,
        (partnership) => partnership.university
    )
    partnerships?: Partnership[]

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ select: false })
    deletedAt?: Date;
}