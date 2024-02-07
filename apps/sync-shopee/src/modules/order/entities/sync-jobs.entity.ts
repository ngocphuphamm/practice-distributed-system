// src/sync-job.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Job } from './job.entity';

@Entity()
export class SyncJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobsCreated: number;

  @Column()
  jobsCompleted: number;

  @Column()
  status: string; // 'pending', 'in_progress', 'completed'

  @OneToMany(() => Job, job => job.syncJob)
  jobs: Job[];
}
