import { MongoClient } from 'mongodb'
import { config } from '../config'
import { WordCollection } from './types'
export const client = new MongoClient(config.mongoUrl)
export const db = client.db(config.db)
export const wordCollection: WordCollection = db.collection('word')

client.connect((err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('Connected to MongoDB')
})
