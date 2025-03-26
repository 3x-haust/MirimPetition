import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetitionService } from './petition.service';
import { CreatePetitionDto } from './dto/create-petition.dto';
import { UpdatePetitionDto } from './dto/update-petition.dto';
import { User } from '../entities/user.entity';
import { PetitionStatus } from '../entities/petition.entity';
import { VoteType } from '../entities/vote.entity';

@ApiTags('petitions')
@Controller('petitions')
@UseGuards(JwtAuthGuard)
export class PetitionController {
  constructor(private readonly petitionService: PetitionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new petition' })
  @ApiResponse({ status: 201, description: 'Petition created successfully' })
  async create(
    @Body() createPetitionDto: CreatePetitionDto,
    @Req() req: { user: User },
  ) {
    return this.petitionService.create(createPetitionDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all petitions' })
  @ApiResponse({ status: 200, description: 'List of petitions' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.petitionService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a petition by id' })
  @ApiResponse({ status: 200, description: 'Petition details' })
  async findOne(@Param('id') id: string) {
    return this.petitionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a petition' })
  @ApiResponse({ status: 200, description: 'Petition updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updatePetitionDto: UpdatePetitionDto,
  ) {
    return this.petitionService.update(id, updatePetitionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a petition' })
  @ApiResponse({ status: 200, description: 'Petition deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.petitionService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update petition status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: PetitionStatus,
  ) {
    return this.petitionService.updateStatus(id, status);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Vote on a petition' })
  @ApiResponse({ status: 200, description: 'Vote registered successfully' })
  async vote(
    @Param('id') id: string,
    @Body('voteType') voteType: VoteType,
    @Req() req: { user: User },
  ) {
    return this.petitionService.vote(id, req.user.id, voteType);
  }
} 