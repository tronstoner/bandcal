import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class CalendarEntry {
  @PrimaryColumn()
  date!: string;

  @Column()
  text!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updated!: Date;
}
