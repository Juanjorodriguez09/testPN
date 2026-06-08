import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Career } from "../enum/career.enum";
import { University } from "../../university/entities/university.entity";


@Entity('students')
export class Student {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    fullName!: string;

    @Column({ type: 'text' })
    about!: string;

    @Column({
        type: 'varchar',
        unique: true,
        length: 50
    })
    documentNumber!: string;

    @Column({type: 'varchar', length: 15})
    phone!: string;

    @Column({ type: 'enum', enum: Career })
    career!: string;

    @Column({ type: 'int' })
    semester!: number;

    @OneToOne(
        () => User, 
        (user) => user.company, 
        { eager: true }
    )
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(
        () => University, 
        (university) => university.students,
        { eager: true }
    )
    @JoinColumn({ name: 'universityId' })
    university?: University;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ select: false })
    deletedAt?: Date;

}
