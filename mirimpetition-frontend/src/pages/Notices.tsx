import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useNoticeStore } from '@/store/useNoticeStore';
import { Bell, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Notices = () => {
  const { notices, fetchNotices, isLoading, selectNotice, selectedNotice } = useNoticeStore();
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleNoticeClick = (id: string) => {
    selectNotice(id);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (showDetail && selectedNotice) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="mb-4 -ml-2"
          >
            <ChevronRight className="h-4 w-4 transform rotate-180 mr-1" />
            목록으로 돌아가기
          </Button>
          
          <Card className={cn(
            "w-full overflow-hidden transition-all",
            selectedNotice.important && "border-primary"
          )}>
            <CardHeader className={cn(
              "pb-2",
              selectedNotice.important && "bg-primary/5"
            )}>
              {selectedNotice.important && (
                <Badge variant="outline" className="mb-2 border-primary text-primary inline-flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  중요 공지
                </Badge>
              )}
              <CardTitle className="text-2xl">{selectedNotice.title}</CardTitle>
              <CardDescription className="flex justify-between mt-2">
                <span>{selectedNotice.author.name}</span>
                <span>{formatDate(selectedNotice.date)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-gray dark:prose-invert whitespace-pre-line">
                {selectedNotice.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Bell className="h-6 w-6" />
          공지사항
        </h1>
        <p className="text-lg mb-8 text-muted-foreground">
          미림마이스터고등학교 청원 시스템의 주요 소식과 업데이트를 확인하세요.
        </p>
        
        {isLoading ? (
          <p className="text-center py-8 text-muted-foreground">로딩 중...</p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <Card 
                key={notice.id} 
                className={cn(
                  "cursor-pointer hover:shadow-md transition-all hover:-translate-y-1",
                  notice.important && "border-primary"
                )}
                onClick={() => handleNoticeClick(notice.id)}
              >
                <CardHeader className={cn(
                  "pb-2",
                  notice.important && "bg-primary/5"
                )}>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      {notice.important && (
                        <Badge variant="outline" className="mb-2 border-primary text-primary w-fit">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          중요
                        </Badge>
                      )}
                      <CardTitle>{notice.title}</CardTitle>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(notice.date)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 pb-4">
                  <p className="text-muted-foreground line-clamp-2">{notice.content}</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center text-sm">
                  <span className="font-medium">{notice.author.name}</span>
                  <span className="text-primary flex items-center">
                    자세히 보기
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notices;
