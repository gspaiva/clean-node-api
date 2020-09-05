export class ServerError extends Error {
  constructor () {
    super('Internal server error: Try later.')
    this.name = 'ServerError'
  }
}
