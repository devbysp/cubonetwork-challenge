import { Task, of as taskOf } from 'fp-ts/Task'
import { TaskEither, tryCatchK, tryCatch, map } from 'fp-ts/TaskEither'
import { pipe, tuple } from 'fp-ts/function'

import { DataSource, DataSourceOptions, EntityManager } from 'typeorm'

// -----------------------------------------------------------------------------
// Datasource creation
// -----------------------------------------------------------------------------
type GetDataSource = (options: DataSourceOptions) => Task<DataSource>
export const getDataSource: GetDataSource = options => taskOf(new DataSource(options))

// -----------------------------------------------------------------------------
// Datasource initialization
// -----------------------------------------------------------------------------
type InitDataSource = (ds: DataSource) => TaskEither<Error, DataSource>
export const initDataSource: InitDataSource = tryCatchK(
  async (ds) => await ds.initialize(),
  (reason) => new Error(String(reason))
)

// -----------------------------------------------------------------------------
// Run in transaction
// -----------------------------------------------------------------------------
type RunInTransaction = <A>(f: (em: EntityManager) => Promise<A>) => (ds: DataSource) => TaskEither<Error, [DataSource, A]>
export const runInTransaction: RunInTransaction = f => dataSource =>
  pipe(
    tryCatchK(
      async (ds: DataSource) => await ds.transaction(async em => await f(em)),
      (error) => new Error(String(error))
    )(dataSource),
    map((result) => tuple(dataSource, result))
  )

// -----------------------------------------------------------------------------
// Destroy datasource
// -----------------------------------------------------------------------------
type DestroyDataSource = <A>(input: [DataSource, A]) => TaskEither<Error, A>
export const destroyDataSource: DestroyDataSource = tryCatchK(
  async (ds) => {
    await ds[0].destroy()
    return ds[1]
  },
  (reason) => new Error(String(reason))
)

// const fromPromise = <A, B>(asycnFunction: (input: A) => Promise<B>) =>
//   tryCatchK(
//     async (input: A) => await asycnFunction(input),
//     (reason) => new Error(String(reason))
//   )
