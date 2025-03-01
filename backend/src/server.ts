import { build } from './app'

const start = async () => {
  const server = await build()
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

  try {
    await server.listen({ port, host: '0.0.0.0' })
    console.log(`Server listening on ${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()