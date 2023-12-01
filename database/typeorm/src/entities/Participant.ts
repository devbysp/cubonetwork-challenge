import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export interface ParticipantInterface {
  id: number
  firstName: string
  lastName: string
  participation: number
}

@Entity()
export class Participant implements ParticipantInterface {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    firstName: string

  @Column()
    lastName: string

  @Column()
    participation: number
}
