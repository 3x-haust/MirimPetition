
import { ArrowRight, CheckCheck, FileEdit, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PetitionCard } from "@/components/PetitionCard";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { usePetitionStore } from "@/store/usePetitionStore";

const features = [
  {
    icon: <FileEdit className="h-8 w-8" />,
    title: "청원 작성",
    description: "학교 발전을 위한 아이디어를 청원으로 작성해 공유하세요."
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "서명 참여",
    description: "공감되는 청원에 서명하여 변화의 목소리를 높여주세요."
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "진행 상황 추적",
    description: "실시간으로 청원의 진행 상황을 확인하고 관심있는 주제를 팔로우하세요."
  },
  {
    icon: <CheckCheck className="h-8 w-8" />,
    title: "답변 확인",
    description: "목표 서명 수에 도달한 청원에 대한 학교 측의 공식 답변을 받아볼 수 있습니다."
  }
];

const Index = () => {
  const { petitions } = usePetitionStore();
  const filteredPetitions = petitions
    .sort((a, b) => (b.signatures ?? 0) - (a.signatures ?? 0))
    .slice(0, 4);

  return (
    <Layout>
      <section className="relative pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="container px-4 py-12 mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            미림의 변화,{" "}
            <span className="text-gradient">여러분의 목소리</span>로 시작됩니다
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            학교를 더 나은 곳으로 만들기 위한 아이디어가 있으신가요?
            <br className="hidden sm:inline" /> 청원을 통해 여러분의 생각을 공유하고 변화를 만들어보세요.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/petitions/create">청원 작성하기</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link to="/petitions">청원 둘러보기</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">어떻게 작동하나요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-3 mb-4 rounded-full bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">주목받는 청원</h2>
            <Button asChild variant="ghost" className="group">
              <Link to="/petitions" className="flex items-center gap-2">
                모든 청원 보기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPetitions.map((petition, index) => (
              <PetitionCard key={index} {...petition} id={petition.id ?? ""} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-3xl mx-auto p-8 rounded-2xl relative overflow-hidden neomorphism"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">변화는 여러분의 참여로부터</h2>
              <p className="text-muted-foreground mb-6">
                매일 새로운 청원이 등록되고 있습니다. 여러분의 목소리로 미림마이스터고를 함께 발전시켜요.
              </p>
              <Button asChild size="lg">
                <Link to="/petitions/create">청원 시작하기</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
