import { AfterLoad, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InternshipStatus } from "../enum/internship-status.enum";
import { Application } from "../../application/entities/application.entity";
import { formatDate } from "../../common/helpers/format-date.helper";


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
