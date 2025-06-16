import { registerAs } from '@nestjs/config';
import {
  IsNotEmpty,
  IsOptional,
  IsPort,
  IsString,
  validateSync,
} from 'class-validator';
import { plainToClass } from 'class-transformer';

class AppConfig {
  @IsPort()
  @IsOptional()
  PORT = '3001';

  @IsString()
  @IsNotEmpty()
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN = '7d';

  @IsString()
  @IsOptional()
  FRONTEND_URL = 'http://localhost:3000';

  @IsString()
  @IsNotEmpty()
  COOKIE_SECRET: string;
}

export default registerAs('app', () => {
  const config = plainToClass(AppConfig, process.env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(config, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `Configuration validation error: ${errors
        .map((error) => Object.values(error.constraints || {}))
        .flat()
        .join(', ')}`,
    );
  }

  return config;
});

export { AppConfig };
