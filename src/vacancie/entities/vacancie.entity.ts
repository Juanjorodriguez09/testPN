import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { VacancieStatus } from "../enum/vacancie-status.enum";
import { Modality } from "../enum/modality.enum";
import { Company } from "../../company/entities/company.entity";

@Entity('vacancies')
export class Vacancie {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    title!: string;

    @Column('text')
    description!: string;

    @Column('text', {
        nullable: true
    })
    requirements?: string;

    @Column('float')
    salary!: number;

    @Column('text')
    location!: string;

    @Column({ type: 'enum', enum: Modality })
    modality!: Modality;

    @Column({ type: 'enum', enum: VacancieStatus })
    status!: VacancieStatus;

    @ManyToOne(
        () => Company,
        (company) => company.vacancies,
        { eager: true }
    )
    @JoinColumn({ name: 'companyId' })
    company!: Company

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ select: false })
    deletedAt?: Date;

}
