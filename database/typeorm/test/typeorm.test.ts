import { Either, isRight } from 'fp-ts/Either'
import { Task } from 'fp-ts/Task'
import { chain, map, fromTask, flatMap, tryCatch, tryCatchK } from 'fp-ts/TaskEither'
import { pipe, tuple } from 'fp-ts/function'

import { DataSource, DataSourceOptions } from 'typeorm'

import { destroyDataSource, getDataSource, initDataSource, runInTransaction } from '../src'
import ParticipantSchema from '../src/schemas/ParticipantSchema'
import { Participant } from '../src/entities/Participant'

// -----------------------------------------------------------------------------
// This file is an introduction to the typeORM's API. It explores how to work
// with it and proposes the design of a new and simple API that makes it
// compatible with the fp-ts library, in order to use functional programming.
//
// This design is an incremental design done with Test Driven Development.
// -----------------------------------------------------------------------------
describe('TDD with TypeROM', () => {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  const zero = 0
  const options: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'app',
    password: 'appPwd',
    database: 'cubonetwork',
    logging: true, // Set to true to log SQL queries
    entities: [ParticipantSchema]
  }

  describe("TypeORM's API", () => {
    // -------------------------------------------------------------------------
    // Tests
    // -------------------------------------------------------------------------
    test('usage', async () => {
      const db = new DataSource(options)
      if (!db.isInitialized) {
        await db.initialize()
      }
      const participants = await db.transaction(async em => await em
        .getRepository(Participant)
        .createQueryBuilder()
        .select()
        .getMany()
      )
      await db.destroy()
      expect(participants).toBeDefined()
      expect(participants).toBeInstanceOf(Array<Participant>)
    })
  })

  describe('Wrapping api into TaskEither functors', () => {
    const db: Task<DataSource> = getDataSource(options)

    test('init and destroy', async () => {
      const ds = await pipe(
        fromTask(db),
        chain(initDataSource),
        chain((ds) =>
          pipe(
            tryCatchK(
              async (y) => await Promise.resolve(42),
              (error) => new Error(String(error))
            )(ds),
            map((x) => tuple(ds, x))
          )
        ),
        chain(destroyDataSource)
      )()

      expect(isRight(ds) ? ds.right : null).toBe(42)
    })

    test('run a transaction', async () => {
      const ds: Either<Error, number> = await pipe(
        fromTask(db),
        chain(initDataSource),
        chain(runInTransaction(async em => await Promise.resolve(42))),
        chain(destroyDataSource)
      )()

      expect(isRight(ds) ? ds.right : null).toBe(42)
    })
  })
})

//  test.skip('select, insert, remove, max', async () => {
//    const db = await getDataSource()
//    await db.transaction(async (entityManager) => {
//      const participants = await entityManager
//        .getRepository(Participant)
//        .createQueryBuilder()
//        .select()
//        .getMany()
//
//      let maxBeforeUpdate = zero
//      console.log(participants)
//      if (participants.length > 0) {
//        maxBeforeUpdate = await entityManager
//          .getRepository(Participant)
//          .createQueryBuilder('participant')
//          .select('max(participant.participation)', 'value')
//          .getRawOne() ?? zero
//        console.log('max before update', maxBeforeUpdate.value)
//
//        entityManager.delete(
//          Participant,
//          participants.map(participant => participant.id)
//        )
//        console.log('delete', participants.map(participant => participant.id))
//
//        const participant = await entityManager.insert(Participant, {
//          firstName: 'John - ' + (maxBeforeUpdate.value + 1),
//          lastName: 'Doe',
//          participation: maxBeforeUpdate.value + 1
//        })
//        console.log('insert', participant)
//      } else {
//        const participant = entityManager.create(Participant, {
//          firstName: 'John',
//          lastName: 'Doe',
//          participation: 0
//        })
//        await entityManager.save(participant)
//        console.log('save new', participant)
//      }
//
//      const max = await entityManager
//        .getRepository(Participant)
//        .createQueryBuilder('participant')
//        .select('max(participant.participation)', 'value')
//        .getRawOne() ?? zero
//      console.log('max', max)
//
//      expect(max.value).toBe(maxBeforeUpdate.value + 1)
//    })
//  })
//
//  afterAll(async () => {
//    await close()
//  })
