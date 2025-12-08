import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FilterTaskDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  search?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  @Transform(({ value }) => (value === '' ? undefined : value))
  priority?: string;

  @IsOptional()
  @IsEnum(['pending', 'completed'])
  @Transform(({ value }) => (value === '' ? undefined : value))
  status?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) =>
    value === '' || isNaN(value) ? undefined : parseInt(value),
  )
  categoryId?: number;

  @IsOptional()
  @IsString()
  dueDateFrom?: string;

  @IsOptional()
  @IsString()
  dueDateTo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
