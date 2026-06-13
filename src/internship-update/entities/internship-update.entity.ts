import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Internship } from "../../internship/entities/internship.entity";


@Entity('internship-updates')
export class InternshipUpdate {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    title!: string;

    @Column('text')
    description!: string;

    @Column('number')
    internshipId!: number;

    @ManyToOne(
        () => Internship,
        (internship) => internship.internshipUpdates
    )
    @JoinColumn({name: 'internshipId'})
    internship!: Internship

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ select: false })
    deletedAt?: Date;

}
