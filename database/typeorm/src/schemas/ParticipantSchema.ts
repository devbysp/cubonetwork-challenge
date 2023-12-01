import { EntitySchema } from 'typeorm'
import { Participant, type ParticipantInterface } from '../entities/Participant'

const ParticipantSchema = new EntitySchema<ParticipantInterface>({
  name: 'Participant',
  target: Participant,
  tableName: 'participants',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    firstName: {
      type: 'varchar',
      length: 40,
      name: 'first_name'
    },
    lastName: {
      type: 'varchar',
      length: 40,
      name: 'last_name'
    },
    participation: {
      type: 'float'
    }
  }
})

export default ParticipantSchema
