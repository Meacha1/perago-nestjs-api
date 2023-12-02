import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePositionDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsUUID()
    @IsOptional()
    parentId: string;
}
