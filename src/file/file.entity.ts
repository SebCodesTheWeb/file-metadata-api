import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  original_name: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  s3_key: string;

  @CreateDateColumn()
  created_at: Date;
}
