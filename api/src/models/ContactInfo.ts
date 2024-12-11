import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ContactInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  text: string;
}
