import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  text!: string;

  @Column({ type: "datetime" })
  datetime!: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updated!: Date;

  @Column({ default: true })
  visible!: boolean;
}
