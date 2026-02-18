import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-slate-100 shadow-lg rounded-xl">
        <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer font-medium text-slate-700 focus:bg-primary/10 focus:text-primary">
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('hi')} className="cursor-pointer font-medium text-slate-700 focus:bg-primary/10 focus:text-primary">
          🇮🇳 Hindi (हिंदी)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('mr')} className="cursor-pointer font-medium text-slate-700 focus:bg-primary/10 focus:text-primary">
          🇮🇳 Marathi (मराठी)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
