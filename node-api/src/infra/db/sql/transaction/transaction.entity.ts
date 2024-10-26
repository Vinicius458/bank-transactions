import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountId: number;

  @Column({ nullable: true })
  targetAccountId?: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}
