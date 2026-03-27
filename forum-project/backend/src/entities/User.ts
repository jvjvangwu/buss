import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserEntity, UserRole, UserStatus } from '../types/auth.types';

@Entity('users')
export class User implements UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ nullable: true })
  emailVerificationToken?: string;

  @Column({ nullable: true })
  emailVerificationExpires?: Date;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ nullable: true })
  passwordResetExpires?: Date;

  @Column({ type: 'enum', enum: ['user', 'moderator', 'admin'], default: 'user' })
  role!: UserRole;

  @Column({ type: 'enum', enum: ['active', 'suspended', 'banned', 'inactive'], default: 'active' })
  status!: UserStatus;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ default: 0 })
  loginAttempts!: number;

  @Column({ nullable: true })
  lockUntil?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
