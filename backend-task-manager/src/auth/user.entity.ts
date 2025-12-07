import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // Password tidak boleh disimpan plain text!
  @Column()
  password: string;

  // Implementasi RBAC (Role-Based Access Control) sederhana
  @Column({ default: 'user' }) 
  role: 'user' | 'admin';
}