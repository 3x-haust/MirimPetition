import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { usePetitionStore } from "@/store/usePetitionStore";
import NotFound from "./NotFound";

const EditPetition = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { petitions, updatePetition } = usePetitionStore();
  const { toast } = useToast();

  const petition = petitions.find((p) => p.id === id);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    if (petition) {
      setFormData({
        title: petition.title,
        content: petition.content,
        category: petition.category,
      });
    }
  }, [petition]);

  if (!petition) {
    return <NotFound />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePetition(id!, {
      title: formData.title,
      content: formData.content,
      category: formData.category,
    });

    toast({
      title: "청원이 수정되었습니다",
      description: "변경사항이 적용되었습니다.",
    });

    navigate(`/petitions/${id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">청원 수정하기</h1>
            <p className="text-muted-foreground">
              청원 내용을 수정합니다. 수정 후에도 서명은 유지됩니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="청원 제목을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="청원 내용을 상세히 작성해주세요"
                className="min-h-64"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="교육과정">교육과정</SelectItem>
                    <SelectItem value="학생 복지">학생 복지</SelectItem>
                    <SelectItem value="학교 시설">학교 시설</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(`/petitions/${id}`)}
              >
                취소
              </Button>
              <Button type="submit">수정 완료</Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditPetition;
