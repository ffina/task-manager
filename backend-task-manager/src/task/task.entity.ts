import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'open' })
  status: string;

  // Relasi: Many tasks to one user
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  user: User;
}