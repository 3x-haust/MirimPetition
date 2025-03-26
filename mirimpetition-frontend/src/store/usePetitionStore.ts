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
  addSign: (id: string) => void;
  reportPetition: (id: string, report: Report) => void;
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
          signatures: 210,
          goal: 300,
          deadline: "2023.05.10",
          createdAt: "2023.04.01",
          author: {
            name: "김미림",
            department: "소프트웨어과",
            grade: 2,
            avatar: "/placeholder.svg"
          },
          timeline: [
            { date: "2023.04.01", event: "청원 등록" },
            { date: "2023.04.05", event: "100명 서명 달성" },
            { date: "2023.04.15", event: "200명 서명 달성" },
            { date: "2023.04.20", event: "검토 시작" }
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
              date: "2023.04.05",
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
              date: "2023.04.07",
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
              date: "2023.04.10",
              likes: 22
            }
          ],
          relatedPetitions: [],
          reports: []
        }
      ],
      addPetition: (petition) => 
        set((state) => ({ 
          petitions: [...state.petitions, { 
            ...petition, 
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
            deadline: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
            signatures: 1,
            timeline: [],
            goal: 300,
            status: "pending",
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
      addSign: (id) =>
        set((state) => ({
          petitions: state.petitions.map((petition) =>
            petition.id === id
              ? { 
                  ...petition, 
                  signatures: (petition.signatures ?? 0) + 1,
                  timeline: [
                    ...(petition.timeline ?? []),
                    ...((petition.signatures ?? 0) + 1 === 100 || (petition.signatures ?? 0) + 1 === 200 || (petition.signatures ?? 0) + 1 === 300 
                      ? [{ date: new Date().toISOString().split('T')[0].replace(/-/g, '.'), event: `${(petition.signatures ?? 0) + 1}명 서명 달성` }] 
                      : [])
                  ]
                }
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
    }),
    {
      name: 'petition-storage',
    }
  )
);
