
import { useEffect, useState } from "react";
import { Filter, Search, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PetitionCard } from "@/components/PetitionCard";
import { Layout } from "@/components/Layout";
import { usePetitionStore } from "@/store/usePetitionStore";

const categories = [
  { value: "all", label: "전체" },
  { value: "교육과정", label: "교육과정" },
  { value: "시설", label: "시설" },
  { value: "학생지원", label: "학생지원" },
  { value: "식단", label: "식단" },
  { value: "기타", label: "기타" },
];

const sortOptions = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "deadline", label: "마감임박순" },
];

const PetitionList = () => {
  const { petitions } = usePetitionStore();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPetitions = petitions.filter(petition => {
    const matchesSearch = petition.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "answered" && petition.status === "answered") ||
                      (activeTab === "progress" && petition.status === "progress") ||
                      (activeTab === "waiting" && petition.status === "pending") ||
                      (activeTab === "expired" && (petition.status === "expired" || petition.status === "rejected"));
    
    const matchesCategory = selectedCategory === "all" || petition.category === selectedCategory;
    
    return matchesSearch && matchesTab && matchesCategory;
  }).slice((page - 1) * 9, page * 9);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, activeTab]);

  const totalPages = Math.ceil(
    (searchQuery || selectedCategory !== "all" || activeTab !== "all"
      ? filteredPetitions.length
      : petitions.length) / 9
  );
  

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">청원 목록</h1>
          <p className="text-muted-foreground">
            미림마이스터고 구성원들이 제안한 다양한 청원들을 확인하고 참여해보세요.
          </p>
          
          <div className="relative mt-8 max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="청원 제목, 내용 검색"
              className="pl-10 py-6 bg-card/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={(value) => {
              setActiveTab(value);
              setPage(1);
            }}>
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all">전체 청원</TabsTrigger>
                <TabsTrigger value="progress">진행 중</TabsTrigger>
                <TabsTrigger value="waiting">대기 중</TabsTrigger>
                <TabsTrigger value="answered">답변 완료</TabsTrigger>
                <TabsTrigger value="expired">마감된 청원</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
              
              <div className={`flex flex-col md:flex-row gap-2 w-full md:w-auto ${showFilters ? 'block' : 'hidden md:flex'}`}>
                <Select defaultValue="all" onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select defaultValue="latest" onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <SortDesc className="mr-2 h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {filteredPetitions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPetitions.map((petition) => (
              <PetitionCard key={petition.id} {...petition} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">검색 결과가 없습니다</h3>
            <p className="text-muted-foreground">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <nav className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <span>이전</span>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                className={i + 1 === page ? "bg-primary text-primary-foreground" : ""}
                variant="outline"
                size="icon"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={Math.floor(filteredPetitions.length / 9) < 1}
              onClick={() => setPage(page + 1)}
            >
              <span>다음</span>
            </Button>
          </nav>
        </div>
      </div>
    </Layout>
  );
};

export default PetitionList;
