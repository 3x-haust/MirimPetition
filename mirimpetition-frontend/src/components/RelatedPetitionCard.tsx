import { RelatedPetition } from "@/store/usePetitionStore";
import { Users } from "lucide-react";

const RelatedPetitionCard = ({ petition }: { petition: RelatedPetition }) => {
  return (
    <a href={`../petitions/${petition.id}`} className="block p-3 rounded-lg hover:bg-secondary/50 transition-colors">
      <p className="font-medium text-sm line-clamp-2">{petition.title}</p>
      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
        <Users className="h-3 w-3" />
        <span>{petition.signatures}</span>
        <span>·</span>
        <span>{petition.status}</span>
      </div>
    </a>
  );
}

export default RelatedPetitionCard;