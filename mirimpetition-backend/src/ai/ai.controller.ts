import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { User } from '../entities/user.entity';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze/:petitionId')
  @ApiOperation({ summary: 'Analyze a petition' })
  @ApiResponse({ status: 200, description: 'Analysis result' })
  async analyzePetition(@Param('petitionId') petitionId: string) {
    return this.aiService.analyzePetition(petitionId);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get personalized recommendations' })
  @ApiResponse({ status: 200, description: 'List of recommended petitions' })
  async getRecommendations(@Req() req: { user: User }) {
    return this.aiService.getRecommendations(req.user.id);
  }

  @Post('categorize/:petitionId')
  @ApiOperation({ summary: 'Categorize a petition' })
  @ApiResponse({ status: 200, description: 'Suggested category' })
  async categorizePetition(@Param('petitionId') petitionId: string) {
    return this.aiService.categorizePetition(petitionId);
  }

  @Post('summarize/:petitionId')
  @ApiOperation({ summary: 'Generate a summary of a petition' })
  @ApiResponse({ status: 200, description: 'Petition summary' })
  async summarizePetition(@Param('petitionId') petitionId: string) {
    return this.aiService.summarizePetition(petitionId);
  }
} 