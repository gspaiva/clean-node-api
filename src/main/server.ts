import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(5050, () => console.log(`Server running at port http://localhost:${env.port}`))
  })
  .catch(console.error)
