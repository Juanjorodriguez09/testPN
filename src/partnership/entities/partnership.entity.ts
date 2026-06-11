import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PartnershipStatus } from "../enum/partnership-status.enum";
import { University } from "../../university/entities/university.entity";
import { Company } from "../../company/entities/company.entity";

@Entity('partnerships')
export class Partnership {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: PartnershipStatus })
    status!: PartnershipStatus

    @Column('text', {
        nullable: true
    })
    comment?: string;

    @ManyToOne(
        () => University, 
        (university) => university.partnerships,
        { eager: true }
    )
    @JoinColumn({ name: 'universityId' })
    university?: University;

    @ManyToOne(
        () => Company,
        (company) => company.partnerships,
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
