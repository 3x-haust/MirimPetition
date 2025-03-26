import { create } from 'zustand';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FaqState {
  faqs: FaqItem[];
  isLoading: boolean;
  error: string | null;
  fetchFaqs: () => void;
}

export const useFaqStore = create<FaqState>((set) => ({
  faqs: [
    {
      id: '1',
      question: '청원은 어떻게 작성하나요?',
      answer: '청원 작성 페이지에서 제목, 내용, 카테고리를 입력하여 작성할 수 있습니다. 작성된 청원은 검토 후 사이트에 게시됩니다.',
      category: '청원 작성'
    },
    {
      id: '2',
      question: '청원이 채택되기 위한 최소 서명 수는 얼마인가요?',
      answer: '청원이 학교 측의 공식 답변을 받기 위해서는 최소 300명의 서명이 필요합니다.',
      category: '서명 및 진행'
    },
    {
      id: '3',
      question: '청원 진행 상황은 어디서 확인할 수 있나요?',
      answer: '청원 목록 페이지에서 각 청원의 상태를 확인할 수 있으며, 개별 청원 페이지에서 더 자세한 진행 상황을 확인할 수 있습니다.',
      category: '서명 및 진행'
    },
    {
      id: '5',
      question: '이미 비슷한 청원이 있는 경우 어떻게 되나요?',
      answer: '비슷한 내용의 청원이 이미 진행 중인 경우, 새 청원은 기존 청원으로 병합될 수 있습니다. 이 경우 서명 수도 합산됩니다.',
      category: '청원 작성'
    },
    {
      id: '6',
      question: '청원 기간은 얼마나 되나요?',
      answer: '청원은 등록일로부터 30일 동안 진행됩니다. 기간 내에 목표 서명 수를 달성하지 못하면 만료됩니다.',
      category: '서명 및 진행'
    },
    {
      id: '7',
      question: '청원 답변은 언제 받을 수 있나요?',
      answer: '목표 서명 수를 달성한 청원에 대해서는 14일 이내에 학교 측의 공식 답변이 게시됩니다.',
      category: '서명 및 진행'
    },
    {
      id: '8',
      question: '부적절한 청원은 어떻게 신고하나요?',
      answer: '각 청원 페이지 하단에 있는 신고 버튼을 통해 부적절한 내용을 신고할 수 있습니다.',
      category: '기타'
    }
  ],
  isLoading: false,
  error: null,
  fetchFaqs: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set((state) => ({ isLoading: false, faqs: state.faqs }));
    }, 500);
  }
}));
