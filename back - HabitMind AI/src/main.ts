import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { I18nService } from './i18n/i18n.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get I18nService for global exception filter
  const i18nService = app.get(I18nService);

  // Enable CORS
  app.enableCors();

  // Global exception filter with i18n
  app.useGlobalFilters(new AllExceptionsFilter(i18nService));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('HabitMind AI API')
    .setDescription('API documentation for HabitMind AI - SaaS platform for habit management with AI insights')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Habits', 'Habit management endpoints')
    .addTag('Check-ins', 'Habit check-in endpoints')
    .addTag('AI', 'AI insights and analysis endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
