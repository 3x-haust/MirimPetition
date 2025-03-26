
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Petition } from "@/store/usePetitionStore";


export function PetitionCard(petition: Petition, { className }: { className?: string }) {
  const { id, title, category, status, signatures, goal, deadline } = petition;
  const progress = Math.min(((signatures ?? 0) / (goal ?? 1)) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/petitions/${id}`}>
        <Card className={cn(
          "h-full overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/5",
          "cursor-pointer border-primary/5 bg-card/50 backdrop-blur-sm",
          className
        )}>
          <CardHeader className="p-5">
            <div className="flex justify-between items-start gap-2">
              <div className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/80 text-foreground/80">
                {category}
              </div>
              <StatusBadge status={status ?? "pending"} />
            </div>
            <h3 className="mt-2 text-xl font-bold leading-tight text-balance line-clamp-2">
              {title}
            </h3>
          </CardHeader>
          <CardFooter className="p-5 pt-0 flex-col items-start gap-3">
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{(signatures ?? 0).toLocaleString()} / {(goal ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{deadline}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
