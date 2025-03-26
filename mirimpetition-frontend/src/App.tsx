
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "./pages/Index";
import PetitionList from "./pages/PetitionList";
import PetitionDetail from "./pages/PetitionDetail";
import CreatePetition from "./pages/CreatePetition";
import NotFound from "./pages/NotFound";
import "./index.css";
import Notices from "./pages/Notices";
import FAQ from "./pages/FAQ";
import EditPetition from "./pages/EditPetition";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/petitions" element={<PetitionList />} />
              <Route path="/petitions/:id" element={<PetitionDetail />} />
              <Route path="/petitions/create" element={<CreatePetition />} />
              <Route path="/petitions/edit/:id" element={<EditPetition />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
};

export default App;
