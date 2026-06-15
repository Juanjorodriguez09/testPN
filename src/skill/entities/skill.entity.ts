import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('skills')
export class Skill {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text', { unique: true })
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

}
