import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StatusType } from '@/components/StatusBadge';

export interface Author {
  name: string;
  avatar?: string;
  major?: string;
  grade?: number;
  isTeacher?: boolean;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  date: string;
  likes: number;
  likedBy?: string[]; // 좋아요를 누른 사용자들의 ID 목록
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface RelatedPetition {
  id: string;
  title: string;
  signatures: number;
  status: StatusType;
}

export interface Petition {
  id?: string;
  title: string;
  content: string;
  category: string;
  author: Author;
  status?: StatusType;
  signatures?: number;
  goal?: number;
  deadline?: string;
  createdAt?: string;
  timeline?: TimelineEvent[];
  comments?: Comment[];
  relatedPetitions?: RelatedPetition[];
  reports?: Report[];
  signedBy?: string[];
}

export interface Report {
  id: string;
  reason: string;
  reportedAt: string;
  reportedBy: string;
  status: 'pending' | 'reviewed' | 'rejected';
}

interface PetitionState {
  petitions: Petition[];
  addPetition: (petition: Petition) => void;
  updatePetition: (id: string, updatedPetition: Partial<Petition>) => void;
  deletePetition: (id: string) => void;
  addSign: (id: string, name: string) => void;
  reportPetition: (id: string, report: Report) => void;
  addComment: (petitionId: string, comment: Comment) => void;
  toggleCommentLike: (petitionId: string, commentId: string, userId: string) => void;
}

export const usePetitionStore = create<PetitionState>()(
  persist(
    (set) => ({
      petitions: [
        {
          id: "fnmu7leok",
          title: "교내 프로그래밍 대회 정기 개최 요청",
          content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.

현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.

정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:

1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
2. 팀워크와 협업 능력 개발 (팀 대회 시)
3. 취업 및 진학에 도움이 될 포트폴리오 구축
4. 프로그래밍에 대한 흥미 및 동기 부여
5. 학과 간 교류 증진

매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
          category: "교육과정",
          status: "progress",
          signatures: 13,
          goal: 60,
          deadline: "2025.09.15",
          createdAt: "2025.06.15",
          author: {
            name: "김미림",
            major: "소프트웨어과",
            grade: 2,
            avatar: "/placeholder.svg"
          },
          timeline: [
            { date: "2025.06.18", event: "청원 등록" },
            { date: "2025.06.19", event: "10명 서명 달성" },
          ],
          comments: [
            {
              id: "c1",
              author: { 
                name: "정소프트", 
                department: "소프트웨어과", 
                grade: 2, 
                avatar: "/placeholder.svg" 
              },
              content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
              date: "2025.06.18",
              likes: 15
            },
            {
              id: "c2",
              author: { 
                name: "이웹개발", 
                department: "소프트웨어과", 
                grade: 3, 
                avatar: "/placeholder.svg" 
              },
              content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
              date: "2025.06.19",
              likes: 8
            },
            {
              id: "c3",
              author: { 
                name: "박교사", 
                department: "교사", 
                grade: 0, 
                avatar: "/placeholder.svg", 
                isTeacher: true 
              },
              content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
              date: "2025.06.19",
              likes: 22
            }
          ],
          relatedPetitions: [],
          reports: []
        },
        {
          id: "abc123def",
          title: "급식 메뉴 다양성 확대 요청",
          content: `학생들의 건강한 식생활과 급식 만족도 향상을 위해 급식 메뉴의 다양성 확대를 요청드립니다.

        현재 급식 메뉴가 반복적이고 단조로워 학생들의 급식 만족도가 낮은 상황입니다. 또한 알레르기나 특정 식재료를 피해야 하는 학생들을 위한 대체 메뉴가 부족합니다.

        급식 메뉴 다양성 확대를 통해 다음과 같은 효과를 기대할 수 있습니다:

        1. 학생들의 급식 만족도 향상
        2. 균형 잡힌 영양 섭취 기회 제공
        3. 다양한 음식 문화 체험 기회 제공
        4. 알레르기 학생들을 위한 대체 메뉴 제공
        5. 식습관 개선 및 건강한 성장 지원

        매주 새로운 메뉴 1-2개씩 도입하고, 월 1회 이상 세계 각국의 음식을 급식으로 제공하여 학생들의 식생활의 질을 향상시켜주시기를 요청드립니다.`,
          category: "식단",
          status: "answered",
          signatures: 87,
          goal: 60,
          deadline: "2025.04.30",
          createdAt: "2025.01.15",
          author: {
            name: "이건강",
            major: "바이오과",
            grade: 1,
            avatar: "/placeholder.svg"
          },
          timeline: [
            { date: "2025.01.15", event: "청원 등록" },
            { date: "2025.01.20", event: "10명 서명 달성" },
            { date: "2025.02.05", event: "30명 서명 달성" },
            { date: "2025.02.15", event: "60명 서명 달성 - 목표 달성" },
            { date: "2025.03.01", event: "영양사와 면담 진행" },
            { date: "2025.03.15", event: "급식 메뉴 개선안 확정" },
            { date: "2025.04.01", event: "새로운 급식 메뉴 도입 시작" },
            { date: "2025.04.30", event: "청원 완료" }
          ],
          comments: [
            {
              id: "c4",
              author: { 
                name: "김영양", 
                major: "바이오과", 
                grade: 2, 
                avatar: "/placeholder.svg" 
              },
              content: "정말 필요했던 청원이에요! 매일 같은 메뉴라서 지겨웠는데 개선되어서 너무 좋습니다.",
              date: "2025.05.01",
              likes: 23
            },
            {
              id: "c5",
              author: { 
                name: "박급식", 
                major: "급식실", 
                grade: 0, 
                avatar: "/placeholder.svg", 
                isTeacher: true 
              },
              content: "학생들의 의견을 적극 반영하여 새로운 메뉴들을 도입했습니다. 앞으로도 지속적으로 개선해나가겠습니다.",
              date: "2025.05.02",
              likes: 31
            }
          ],
          relatedPetitions: [
            {
              id: "fnmu7leok",
              title: "교내 프로그래밍 대회 정기 개최 요청",
              signatures: 13,
              status: "progress"
            }
          ],
          reports: []
        },
      ],
      addPetition: (petition) => 
        set((state) => ({ 
          petitions: [...state.petitions, { 
            ...petition, 
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '.'),
            signatures: 1,
            timeline: [],
            goal: 60,
            status: "progress",
            comments: [],
            reports: [],
            relatedPetitions: []
          }] 
        })),
      updatePetition: (id, updatedPetition) =>
        set((state) => ({
          petitions: state.petitions.map((petition) =>
            petition.id === id ? { ...petition, ...updatedPetition } : petition
          ),
        })),
      deletePetition: (id) =>
        set((state) => ({
          petitions: state.petitions.filter((petition) => petition.id !== id),
        })),
      addSign: (id, name) =>
        set((state) => ({
          petitions: state.petitions.map((petition) =>
            petition.id === id
              ? (() => {
                  const signedBy = petition.signedBy || [];
                  const hasAlreadySigned = signedBy.includes(name);
                  
                  if (hasAlreadySigned) {
                    return {
                      ...petition,
                      signatures: Math.max(0, (petition.signatures ?? 0) - 1),
                      signedBy: signedBy.filter(id => id !== name)
                    };
                  } else {
                    const newSignatureCount = (petition.signatures ?? 0) + 1;
                    return {
                      ...petition,
                      signatures: newSignatureCount,
                      signedBy: [...signedBy, name],
                      timeline: [
                        ...(petition.timeline ?? []),
                        ...(newSignatureCount === 100 || newSignatureCount === 200 || newSignatureCount === 300 
                          ? [{ date: new Date().toISOString().split('T')[0].replace(/-/g, '.'), event: `${newSignatureCount}명 서명 달성` }] 
                          : [])
                      ]
                    };
                  }
                })()
              : petition
          ),
        })),
      reportPetition: (id, report) =>
        set((state) => ({
          petitions: state.petitions.map((petition) =>
            petition.id === id
              ? { 
                  ...petition, 
                  reports: [...(petition.reports || []), report] 
                }
              : petition
          ),
        })),
      addComment: (petitionId, comment) =>
        set((state) => ({
          petitions: state.petitions.map((petition) =>
            petition.id === petitionId
              ? {
                  ...petition,
                  comments: [...(petition.comments || []), comment]
                }
              : petition
          ),
        })),
      toggleCommentLike: (petitionId, commentId, userId) =>
        set((state) => ({
          petitions: state.petitions.map((petition) =>
            petition.id === petitionId
              ? {
                  ...petition,
                  comments: (petition.comments || []).map((comment) =>
                    comment.id === commentId
                      ? (() => {
                          const likedBy = comment.likedBy || [];
                          const isLiked = likedBy.includes(userId);
                          
                          if (isLiked) {
                            // 좋아요 취소
                            return {
                              ...comment,
                              likes: Math.max(0, comment.likes - 1),
                              likedBy: likedBy.filter(id => id !== userId)
                            };
                          } else {
                            // 좋아요 추가
                            return {
                              ...comment,
                              likes: comment.likes + 1,
                              likedBy: [...likedBy, userId]
                            };
                          }
                        })()
                      : comment
                  )
                }
              : petition
          ),
        })),
    }),
    {
      name: 'petition-storage',
    }
  )
);

