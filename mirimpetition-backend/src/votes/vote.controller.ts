import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VoteService } from './vote.service';
import { User } from '../entities/user.entity';
import { VoteType } from '../entities/vote.entity';

@ApiTags('votes')
@Controller('votes')
@UseGuards(JwtAuthGuard)
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post(':petitionId')
  @ApiOperation({ summary: 'Vote on a petition' })
  @ApiResponse({ status: 201, description: 'Vote created successfully' })
  async create(
    @Param('petitionId') petitionId: string,
    @Body('voteType') voteType: VoteType,
    @Req() req: { user: User },
  ) {
    return this.voteService.create(petitionId, req.user.id, voteType);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all votes by user' })
  @ApiResponse({ status: 200, description: 'List of votes' })
  async findByUserId(@Param('userId') userId: string) {
    return this.voteService.findByUserId(userId);
  }
} 