import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('skills')
export class Skill {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

}
