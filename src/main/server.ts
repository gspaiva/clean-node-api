import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    const port = env.port as number
    app.listen(port, '0.0.0.0', () => console.log(`Server running at port http://localhost:${env.port}`))
  })
  .catch(console.error)
