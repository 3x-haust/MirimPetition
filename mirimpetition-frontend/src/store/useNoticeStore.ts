import { create } from 'zustand';
import { Author } from './usePetitionStore';

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: Author;
  important: boolean;
}

interface NoticeState {
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  selectedNotice: Notice | null;
  fetchNotices: () => void;
  selectNotice: (id: string) => void;
}

export const useNoticeStore = create<NoticeState>((set) => ({
  notices: [
    {
      id: '1',
      title: '청원 시스템 오픈 안내',
      content: '미림마이스터고등학교 청원 시스템이 공식 오픈되었습니다. 학생 여러분의 다양한 의견을 청원을 통해 전달해주세요.',
      date: '2023-05-01',
      author: {
        name: '학생회',
      },
      important: true
    },
    {
      id: '2',
      title: '청원 작성 가이드라인 업데이트',
      content: '청원 작성 시 지켜야 할 가이드라인이 업데이트되었습니다. 작성 전 반드시 가이드라인을 확인해주세요.',
      date: '2023-05-10',
      author: {
        name: '학생회',
      },
      important: true
    },
    {
      id: '3',
      title: '5월 청원 답변 일정 안내',
      content: '5월 중 목표 서명 수를 달성한 청원에 대한 답변은 6월 첫째 주에 게시될 예정입니다.',
      date: '2023-05-20',
      author: {
        name: '학생회',
      },
      important: false
    },
    {
      id: '4',
      title: '청원 시스템 임시 점검 안내',
      content: '시스템 안정화를 위한 임시 점검이 5월 25일 오후 6시부터 8시까지 진행됩니다. 해당 시간에는 서비스 이용이 제한됩니다.',
      date: '2023-05-23',
      author: {
        name: '학생회',
      },
      important: true
    },
    {
      id: '5',
      title: '우수 청원 선정 결과 발표',
      content: '4월 한 달간 진행된 청원 중 우수 청원으로 "교내 프로그래밍 대회 정기 개최 요청"이 선정되었습니다. 해당 청원은 학교 측의 적극적인 검토가 진행될 예정입니다.',
      date: '2023-05-02',
      author: {
        name: '학생회',
      },
      important: false
    }
  ],
  isLoading: false,
  error: null,
  selectedNotice: null,
  fetchNotices: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set((state) => ({ isLoading: false, notices: state.notices }));
    }, 500);
  },
  selectNotice: (id) => {
    set((state) => ({
      selectedNotice: state.notices.find(notice => notice.id === id) || null
    }));
  }
}));
