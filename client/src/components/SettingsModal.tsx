import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  Globe,
  User,
  Users,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import { useStore } from "@/lib/StoreContext";
import { SupportedLanguage, languageNames } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { getTelegramWebApp } from "@/lib/telegram";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t, language, setLanguage, theme, setTheme, referralCode, setReferralCode } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("language");
  const [copied, setCopied] = useState(false);
  
  // Generate a referral code if none exists
  const generateReferralCode = () => {
    if (!referralCode) {
      // Get user info from Telegram if available
      const telegramApp = getTelegramWebApp();
      const user = telegramApp?.initDataUnsafe?.user;
      
      // Generate a code based on user id or random
      const userPart = user?.id ? user.id.toString().slice(-4) : Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const newCode = `NIKE${userPart}${randomPart}`;
      
      setReferralCode(newCode);
      return newCode;
    }
    return referralCode;
  };
  
  // Copy referral link to clipboard
  const copyReferralLink = () => {
    const code = generateReferralCode();
    const referralLink = `https://t.me/your_bot_username?start=${code}`;
    
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast({
        title: t.settings.referralCopied,
        duration: 2000,
      });
      
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Share referral link (Telegram specific)
  const shareReferralLink = () => {
    const code = generateReferralCode();
    const telegramApp = getTelegramWebApp();
    
    if (telegramApp?.openTelegramLink) {
      try {
        // Format will be something like: https://t.me/share/url?url=https://t.me/your_bot_username?start=CODE&text=Join%20using%20my%20referral%20link
        const shareText = encodeURIComponent(`Присоединяйтесь к Nike Store используя мою реферальную ссылку!`);
        const shareUrl = encodeURIComponent(`https://t.me/your_bot_username?start=${code}`);
        const telegramShareUrl = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
        
        telegramApp.openTelegramLink(telegramShareUrl);
      } catch (e) {
        console.error("Error sharing referral link:", e);
        // Fallback to clipboard
        copyReferralLink();
      }
    } else {
      // Fallback to clipboard
      copyReferralLink();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.settings.title}</DialogTitle>
          <DialogDescription>
            {t.settings.selectLanguage}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="language" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{t.common.language}</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span>{t.common.theme}</span>
            </TabsTrigger>
            <TabsTrigger value="referral" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{t.common.referral}</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Language Settings */}
          <TabsContent value="language" className="space-y-4 pt-4">
            <RadioGroup 
              value={language} 
              onValueChange={(value) => setLanguage(value as SupportedLanguage)}
              className="space-y-2"
            >
              {Object.entries(languageNames).map(([langCode, langName]) => (
                <div key={langCode} className="flex items-center space-x-2">
                  <RadioGroupItem value={langCode} id={`lang-${langCode}`} />
                  <Label 
                    htmlFor={`lang-${langCode}`}
                    className="flex-1 cursor-pointer py-2"
                  >
                    {langName}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
          
          {/* Theme Settings */}
          <TabsContent value="theme" className="space-y-4 pt-4">
            <RadioGroup 
              value={theme} 
              onValueChange={(value: 'light' | 'dark') => setTheme(value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label 
                  htmlFor="theme-light"
                  className="flex items-center gap-2 cursor-pointer py-2"
                >
                  <Sun className="h-4 w-4" />
                  {t.common.lightTheme}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label 
                  htmlFor="theme-dark"
                  className="flex items-center gap-2 cursor-pointer py-2"
                >
                  <Moon className="h-4 w-4" />
                  {t.common.darkTheme}
                </Label>
              </div>
            </RadioGroup>
          </TabsContent>
          
          {/* Referral Program */}
          <TabsContent value="referral" className="space-y-4 pt-4">
            <div className="text-sm">{t.settings.referralInfo}</div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm font-medium mb-1">{t.settings.referralCode}</div>
              <div className="flex items-center">
                <div className="flex-1 bg-muted py-2 px-3 rounded-l-md font-mono">
                  {referralCode || generateReferralCode()}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-l-none"
                  onClick={copyReferralLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full"
              onClick={shareReferralLink}
            >
              <Share2 className="h-4 w-4 mr-2" />
              {t.settings.shareReferralLink}
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {t.common.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}