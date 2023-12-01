import { DataSource } from 'typeorm'
import ParticipantSchema from './schemas/ParticipantSchema'

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'app',
  password: 'appPwd',
  database: 'cubonetwork',
  logging: true, // Set to true to log SQL queries
  entities: [ParticipantSchema]
})

export async function getDataSource () {
  if (dataSource.isInitialized) {
    return dataSource
  }
  await dataSource.initialize()
  return dataSource
}

export async function close () {
  (await getDataSource()).destroy()
}
