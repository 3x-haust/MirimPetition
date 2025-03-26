
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, 
  Check, 
  ClipboardList, 
  Send 
} from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { usePetitionStore } from "@/store/usePetitionStore";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "제목은 5자 이상이어야 합니다.",
  }).max(100, {
    message: "제목은 100자 이하여야 합니다.",
  }),
  category: z.string({
    required_error: "카테고리를 선택해주세요.",
  }),
  content: z.string().min(50, {
    message: "내용은 50자 이상이어야 합니다.",
  }).max(5000, {
    message: "내용은 5000자 이하여야 합니다.",
  }),
  agreement: z.boolean().refine(val => val === true, {
    message: "개인정보 수집 및 이용에 동의해주세요.",
  }),
});

const CreatePetition = () => {
  const { addPetition } = usePetitionStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      content: "",
      agreement: false,
    },
  });
  
  const watchTitle = form.watch("title");
  const watchCategory = form.watch("category");
  const watchContent = form.watch("content");
  const watchAgreement = form.watch("agreement");
  
  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return watchTitle.length >= 5 && watchTitle.length <= 100 && watchCategory;
      case 2:
        return watchContent.length >= 50 && watchContent.length <= 5000;
      case 3:
        return watchAgreement;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3 && isStepComplete(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const onSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
            
      toast({
        title: "청원이 성공적으로 등록되었습니다",
        description: "검토 후 승인되면 청원 목록에 게시됩니다.",
      });
      
      navigate("/petitions");
    } catch {
      toast({
        variant: "destructive",
        title: "청원 등록에 실패했습니다",
        description: "잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const contentLength = watchContent.length;
  const contentLengthPercentage = Math.min((contentLength / 5000) * 100, 100);

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-4">새로운 청원 작성</h1>
          <p className="text-muted-foreground">
            더 나은 학교를 위한 아이디어를 청원으로 작성해 주세요.
            <br />
            구체적이고 현실적인 제안일수록 검토 및 실현 가능성이 높아집니다.
          </p>
        </motion.div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full mb-2
                    ${currentStep > step 
                      ? "bg-primary text-primary-foreground" 
                      : currentStep === step 
                        ? "bg-primary/10 text-primary border-2 border-primary" 
                        : "bg-secondary text-muted-foreground"
                    }
                  `}
                >
                  {currentStep > step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                <span className={`text-xs font-medium ${currentStep === step ? "text-primary" : "text-muted-foreground"}`}>
                  {step === 1 
                    ? "기본 정보" 
                    : step === 2 
                      ? "청원 내용" 
                      : "확인 및 제출"}
                </span>
              </div>
            ))}
          </div>
          
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
            <div 
              className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>청원 제목</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="제목을 입력하세요" 
                            {...field}
                            className="py-6"
                          />
                        </FormControl>
                        <FormDescription className="flex justify-between">
                          <span>간결하고 명확한 제목을 작성해주세요.</span>
                          <span className={`${watchTitle.length > 100 ? "text-destructive" : ""}`}>
                            {watchTitle.length}/100
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>카테고리</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="카테고리를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="교육과정">교육과정</SelectItem>
                            <SelectItem value="시설">시설</SelectItem>
                            <SelectItem value="학생지원">학생지원</SelectItem>
                            <SelectItem value="식단">식단</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          청원의 주제와 가장 관련이 깊은 카테고리를 선택해주세요.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>청원 내용</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="청원 내용을 작성하세요" 
                            {...field}
                            className="min-h-[300px] resize-none"
                          />
                        </FormControl>
                        <div className="mt-2">
                          <div className="w-full bg-secondary rounded-full h-1 mb-1">
                            <div 
                              className="h-1 bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${contentLengthPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>최소 50자</span>
                            <span className={`${contentLength > 5000 ? "text-destructive" : ""}`}>
                              {contentLength}/5000
                            </span>
                          </div>
                        </div>
                        <FormDescription className="mt-2">
                          <div className="text-sm font-medium mb-2">청원 작성 팁:</div>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>문제점을 명확하게 설명하세요.</li>
                            <li>해결책이나 개선 방안을 제시하면 더 좋습니다.</li>
                            <li>객관적인 사실과 구체적인 예시를 포함하세요.</li>
                            <li>예의를 갖춘 언어로 작성해주세요.</li>
                          </ul>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl neomorphism space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-bold">청원 내용 확인</h3>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">제목</p>
                      <p className="font-medium">{watchTitle}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">카테고리</p>
                      <p>{watchCategory}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">내용</p>
                      <div className="bg-secondary/30 p-4 rounded-lg max-h-[200px] overflow-y-auto text-sm">
                        {watchContent.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm font-medium">
                        청원 검토 및 게시 안내
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                          <li>제출된 청원은 관리자 검토 후 게시됩니다 (1-2일 소요).</li>
                          <li>게시된 청원은 30일간 서명을 받을 수 있습니다.</li>
                          <li>300명 이상의 서명을 받은 청원은 학교 측의 공식 답변을 받게 됩니다.</li>
                          <li>부적절한 내용(비방, 욕설, 허위사실 등)이 포함된 청원은 반려될 수 있습니다.</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Alert variant="default" className="bg-secondary/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>개인정보 수집 및 이용 동의</AlertTitle>
                    <AlertDescription>
                      청원 작성자의 학과, 학년 정보가 청원과 함께 공개됩니다. 이에 동의하시나요?
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="agreement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="agreement"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label 
                              htmlFor="agreement" 
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              개인정보 수집 및 이용에 동의합니다
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                {currentStep > 1 ? (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                  >
                    이전
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < 3 ? (
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    disabled={!isStepComplete(currentStep)}
                  >
                    다음
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={!isStepComplete(currentStep) || isSubmitting}
                    className="gap-2"
                    onClick={() => addPetition({
                      title: watchTitle,
                      category: watchCategory,
                      content: watchContent,
                      author: {
                        name: "김미림",
                        major: "소프트웨어과",
                        grade: 2,
                        avatar: "/placeholder.svg"
                      },
                    })}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">처리 중...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        청원 제출하기
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CreatePetition;
