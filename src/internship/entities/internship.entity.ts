import { AfterLoad, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InternshipStatus } from "../enum/internship-status.enum";
import { Application } from "../../application/entities/application.entity";
import { InternshipUpdate } from "../../internship-update/entities/internship-update.entity";


@Entity('internships')
export class Internship {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: InternshipStatus })
    status!: InternshipStatus

    @Column('date')
    startDate!: Date|string;

    @Column('date')
    endDate!: Date|string;

    @Column('number')
    applicationId!: number;

    @OneToOne(
        () => Application,
        (application) => application.internship,
        { eager: true }
    )
    @JoinColumn({name: 'applicationId'})
    application!: Application;

    @OneToMany(
        () => InternshipUpdate,
        (internshipUpdate) => internshipUpdate.internship
    )
    internshipUpdates?: InternshipUpdate[]

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ select: false })
    deletedAt?: Date;

    @AfterLoad()
    formatDates() {
        this.startDate = this.startDate.toString();
        this.endDate = this.endDate.toString();
    }

}
