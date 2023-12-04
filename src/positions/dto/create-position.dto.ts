import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreatePositionDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsUUID()
    @ValidateIf((obj, value) => obj.name !== 'CEO')
    parentId?: string;
}
