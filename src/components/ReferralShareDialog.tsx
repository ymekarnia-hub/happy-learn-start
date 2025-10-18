import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, MessageCircle, Mail, Facebook, Twitter, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralUrl: string;
  referralCode: string;
}

export const ReferralShareDialog = ({
  open,
  onOpenChange,
  referralUrl,
  referralCode,
}: ReferralShareDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareMessage = `Rejoins-moi sur AcadémiePlus pour du soutien scolaire ! Utilise mon code de parrainage : ${referralCode} et nous recevrons tous les deux 5% de réduction ! ${referralUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast({
      title: "Lien copié !",
      description: "Le lien de parrainage a été copié dans le presse-papier.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
  };

  const handleShareSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(shareMessage)}`, "_blank");
  };

  const handleShareEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent("Rejoins-moi sur AcadémiePlus")}&body=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`, "_blank");
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rejoins-moi sur AcadémiePlus",
          text: shareMessage,
          url: referralUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Partager mon lien de parrainage</DialogTitle>
          <DialogDescription>
            Partagez votre lien unique pour parrainer vos amis et gagner des réductions !
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referral-link">Votre lien de parrainage</Label>
            <div className="flex gap-2">
              <Input
                id="referral-link"
                value={referralUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline" className="flex items-center gap-2">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Partager via</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                className="flex items-center gap-2 justify-start"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              <Button
                onClick={handleShareSMS}
                variant="outline"
                className="flex items-center gap-2 justify-start"
              >
                <MessageCircle className="h-4 w-4 text-blue-600" />
                SMS
              </Button>
              <Button
                onClick={handleShareEmail}
                variant="outline"
                className="flex items-center gap-2 justify-start"
              >
                <Mail className="h-4 w-4 text-red-600" />
                Email
              </Button>
              <Button
                onClick={handleShareFacebook}
                variant="outline"
                className="flex items-center gap-2 justify-start"
              >
                <Facebook className="h-4 w-4 text-blue-700" />
                Facebook
              </Button>
              <Button
                onClick={handleShareTwitter}
                variant="outline"
                className="flex items-center gap-2 justify-start"
              >
                <Twitter className="h-4 w-4 text-sky-500" />
                Twitter
              </Button>
              <Button
                onClick={handleNativeShare}
                variant="outline"
                className="flex items-center gap-2 justify-start"
              >
                <Share2 className="h-4 w-4 text-gray-600" />
                Autre
              </Button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-sm text-blue-800">
              <strong>💡 Astuce :</strong> Partagez votre lien avec vos amis et recevez 5% de crédit
              sur leur premier abonnement annuel (jusqu'à 50% maximum) !
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
