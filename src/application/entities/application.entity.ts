import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApplicationStatus } from "../enum/application-status.enum";
import { Student } from "../../student/entities/student.entity";
import { Vacancie } from "../../vacancie/entities/vacancie.entity";

@Entity('applications')
export class Application {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: ApplicationStatus })
    status!: ApplicationStatus

    @Column('text', {
        nullable: true
    })
    companyComments?: string;

    @ManyToOne(
        () => Student,
        (student) => student.applications,
        { eager: true }
    )
    @JoinColumn({ name: 'studentId' })
    student!: Student

    @ManyToOne(
        () => Vacancie,
        (vacancie) => vacancie.applications,
        { eager: true }
    )
    @JoinColumn({ name: 'vacancieId' })
    vacancie!: Vacancie

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ select: false })
    deletedAt?: Date;

}
