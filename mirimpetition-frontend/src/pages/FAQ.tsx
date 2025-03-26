import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useFaqStore } from '@/store/useFAQStore';
import { cn } from '@/lib/utils';

const FAQ = () => {
  const { faqs, fetchFaqs, isLoading } = useFaqStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);
  
  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">자주 묻는 질문</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          미림마이스터고등학교 청원 시스템에 대한 자주 묻는 질문들을 모았습니다.
          원하는 정보를 찾을 수 없다면 학생회에 문의해주세요.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <p className="text-center py-8 text-muted-foreground">로딩 중...</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <span className="font-medium text-left">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Layout>
  );
};

export default FAQ;
