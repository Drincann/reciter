export const config = {
  port: 80,
  staticRoot: __dirname + '/public',
  mongoUrl: 'mongodb://localhost:27017/',
  db: 'reciter',
  wordCacheTime: 1000 * 60 * 60 * 24 * 7,
}
