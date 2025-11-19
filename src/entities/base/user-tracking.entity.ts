import { Column } from 'typeorm';

export abstract class UserTrackingEntity {
  @Column({ type: 'uuid', nullable: true })
  createdBy: string | null;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string | null;

  @Column({ type: 'uuid', nullable: true })
  deletedBy: string | null;
}
