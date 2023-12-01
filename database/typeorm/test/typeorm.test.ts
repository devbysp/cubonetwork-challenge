import { getDataSource, close } from '../src'
import { Participant } from '../src/entities/Participant'

describe('TypeORM framework test', () => {
  const zero = { value: 0 }

  test('select, insert, remove, max', async () => {
    const db = await getDataSource()
    await db.transaction(async (entityManager) => {
      const participants = await entityManager
        .getRepository(Participant)
        .createQueryBuilder()
        .select()
        .getMany()

      let maxBeforeUpdate = zero
      console.log(participants)
      if (participants.length > 0) {
        maxBeforeUpdate = await entityManager
          .getRepository(Participant)
          .createQueryBuilder('participant')
          .select('max(participant.participation)', 'value')
          .getRawOne() ?? zero
        console.log('max before update', maxBeforeUpdate.value)

        entityManager.delete(
          Participant,
          participants.map(participant => participant.id)
        )
        console.log('delete', participants.map(participant => participant.id))

        const participant = await entityManager.insert(Participant, {
          firstName: 'John - ' + (maxBeforeUpdate.value + 1),
          lastName: 'Doe',
          participation: maxBeforeUpdate.value + 1
        })
        console.log('insert', participant)
      } else {
        const participant = entityManager.create(Participant, {
          firstName: 'John',
          lastName: 'Doe',
          participation: 0
        })
        await entityManager.save(participant)
        console.log('save new', participant)
      }

      const max = await entityManager
        .getRepository(Participant)
        .createQueryBuilder('participant')
        .select('max(participant.participation)', 'value')
        .getRawOne() ?? zero
      console.log('max', max)

      expect(max.value).toBe(maxBeforeUpdate.value + 1)
    })
  })

  afterAll(async () => {
    await close()
  })
})
