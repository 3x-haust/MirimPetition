import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PetitionService } from '../petitions/petition.service';
import { VoteService } from '../votes/vote.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private readonly petitionService: PetitionService,
    private readonly voteService: VoteService,
  ) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY'),
    );
  }

  async analyzePetition(petitionId: string) {
    const petition = await this.petitionService.findOne(petitionId);
    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `청원 분석 전문가로서, 주어진 청원의 내용을 분석하고 실현 가능성, 영향력, 시급성을 평가해주세요.\n\n청원 제목: ${petition.title}\n청원 내용: ${petition.content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      analysis: text,
    };
  }

  async getRecommendations(userId: string) {
    const userVotes = await this.voteService.findByUserId(userId);
    const votedPetitions = await Promise.all(
      userVotes.map(vote => this.petitionService.findOne(vote.petitionId)),
    );

    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `사용자의 투표 기록을 바탕으로 관심사를 분석하고 관련된 청원을 추천해주세요.\n\n사용자가 투표한 청원 목록:\n${votedPetitions
      .map(
        petition =>
          `- ${petition.title} (카테고리: ${petition.category})`,
      )
      .join('\n')}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      recommendations: text,
      userVotes,
    };
  }

  async categorizePetition(petitionId: string) {
    const petition = await this.petitionService.findOne(petitionId);
    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `청원의 내용을 분석하여 가장 적합한 카테고리를 추천해주세요. 카테고리는 ACADEMIC, FACILITY, WELFARE, EVENT, OTHER 중에서 선택해야 합니다.\n\n청원 제목: ${petition.title}\n청원 내용: ${petition.content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      suggestedCategory: text,
    };
  }

  async summarizePetition(petitionId: string) {
    const petition = await this.petitionService.findOne(petitionId);
    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `청원의 내용을 간단하고 명확하게 요약해주세요.\n\n청원 제목: ${petition.title}\n청원 내용: ${petition.content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      summary: text,
    };
  }
} 