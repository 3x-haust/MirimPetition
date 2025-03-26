import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCommentDto: {
      content: string;
      petitionId: string;
      isOfficialResponse?: boolean;
    },
    @Req() req: { user: User },
  ) {
    return this.commentService.create({
      ...createCommentDto,
      user: req.user,
    });
  }

  @Get('petition/:petitionId')
  findAll(@Param('petitionId') petitionId: string) {
    return this.commentService.findAll(petitionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: { content: string },
    @Req() req: { user: User },
  ) {
    return this.commentService.update(id, updateCommentDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: { user: User }) {
    return this.commentService.remove(id, req.user);
  }
} 