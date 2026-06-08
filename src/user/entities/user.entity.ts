import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { University } from '../../university/entities/university.entity';
import { Company } from '../../company/entities/company.entity';
import { Student } from '../../student/entities/student.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text', { unique: true })
    email!: string;

    @Column('text', { select: false })
    password!: string;

    @Column('bool', {
        default: true
    })
    isActive!: boolean;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role!: Role;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ select: false })
    deletedAt?: Date;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

    @OneToOne(
        () => University, 
        (university) => university.user,
        { nullable: true }
    )
    university?: University;

    @OneToOne(
        () => Company, 
        (company) => company.user,
        { nullable: true }
    )
    company?: Company;

    @OneToOne(
        () => Student, 
        (student) => student.user,
        { nullable: true }
    )
    student?: Student;
}