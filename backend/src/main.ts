import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // habilita CORS
  app.enableCors({
    origin: 'http://localhost:5173', // substitua pela porta do seu frontend
    credentials: true, // se for enviar cookies
  });

  await app.listen(3000);
}
bootstrap();
