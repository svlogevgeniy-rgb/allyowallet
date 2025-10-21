import Fastify from 'fastify';
import { pathToFileURL } from 'node:url';

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV === 'production'
          ? undefined
          : {
              target: 'pino-pretty',
              options: { colorize: true, singleLine: true }
            }
    }
  });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}

async function start() {
  const app = await buildApp();
  const port = Number(process.env.PORT ?? 4100);
  const host = process.env.HOST ?? '0.0.0.0';
  try {
    await app.listen({ port, host });
    app.log.info({ host, port }, 'ESIA stub started');
  } catch (error) {
    app.log.error(error, 'Failed to start ESIA stub');
    process.exit(1);
  }
}

const isDirectExecution =
  typeof process !== 'undefined' &&
  typeof process.argv[1] === 'string' &&
  import.meta.url === pathToFileURL(process.argv[1]!).href;

if (isDirectExecution) {
  void start();
}
