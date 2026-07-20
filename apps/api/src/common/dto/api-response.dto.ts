import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T = unknown> {
  @ApiProperty()
  success!: boolean;

  @ApiPropertyOptional()
  data?: T | null;

  @ApiPropertyOptional()
  error?: string | null;

  @ApiPropertyOptional()
  meta?: Record<string, unknown>;
}

export function successResponse<T>(data: T, meta?: Record<string, unknown>): ApiResponseDto<T> {
  return { success: true, data, error: null, meta };
}

export function errorResponse(error: string): ApiResponseDto<null> {
  return { success: false, data: null, error };
}
