import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./ChatMessage";

type MessageContent = {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
};

type Message = {
  role: "user" | "assistant";
  content: string | MessageContent[];
};

type ChatBotProps = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  subject?: string;
};

export default function ChatBot({ messages, setMessages, subject = "mathématiques" }: ChatBotProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; base64: string; type: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (file.size > maxSize) {
      toast({
        title: "Erreur",
        description: "Le fichier est trop volumineux (max 20MB)",
        variant: "destructive",
      });
      return;
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erreur",
        description: "Type de fichier non supporté. Utilisez des images ou PDF.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadedFiles((prev) => [...prev, { name: file.name, base64, type: file.type }]);
      toast({
        title: "Fichier ajouté",
        description: `${file.name} est prêt à être envoyé`,
      });
    };
    reader.onerror = () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la lecture du fichier",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);

    // Reset l'input file pour permettre de sélectionner le même fichier à nouveau
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (content: string) => {
    if ((!content.trim() && uploadedFiles.length === 0) || isLoading) return;

    // Construire le contenu du message
    let messageContent: string | MessageContent[];

    if (uploadedFiles.length > 0) {
      messageContent = [
        { type: "text", text: content.trim() || "Analysez ce fichier et répondez aux questions qu'il contient." },
        ...uploadedFiles.map((file) => ({
          type: "image_url" as const,
          image_url: { url: file.base64 },
        })),
      ];
    } else {
      messageContent = content.trim();
    }

    const userMessage: Message = { role: "user", content: messageContent };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lovable-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          subject: subject,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let assistantMessage = "";
      let buffer = "";

      // Ajouter le message assistant vide initial
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Traiter les données restantes dans le buffer
          if (buffer.trim()) {
            const lines = buffer.split("\n");
            for (const line of lines) {
              await processLine(line, assistantMessage, (newContent) => {
                assistantMessage = newContent;
              });
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Garder la dernière ligne incomplète

        for (const line of lines) {
          await processLine(line, assistantMessage, (newContent) => {
            assistantMessage = newContent;
          });
        }
      }

      // Vérifier si on a reçu le signal [DONE]
      if (buffer.includes("[DONE]")) {
        console.log("Stream completed");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description:
          error.message === "Insufficient credits"
            ? "Crédits insuffisants pour utiliser l'IA"
            : error.message === "Rate limit exceeded"
              ? "Limite de taux dépassée, veuillez réessayer plus tard"
              : "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
      // Retirer le message assistant qui n'a pas été complété
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const processLine = async (line: string, currentMessage: string, onUpdate: (newMessage: string) => void) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine === ":" || trimmedLine.startsWith(":")) {
      return;
    }

    if (trimmedLine === "data: [DONE]") {
      return;
    }

    if (trimmedLine.startsWith("data: ")) {
      const jsonStr = trimmedLine.slice(6).trim();

      if (!jsonStr || jsonStr === "[DONE]") {
        return;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;

        if (content) {
          const newMessage = currentMessage + content;
          onUpdate(newMessage);

          setMessages((prev) => {
            const newMessages = [...prev];
            if (newMessages.length > 0) {
              newMessages[newMessages.length - 1] = {
                role: "assistant",
                content: newMessage,
              };
            }
            return newMessages;
          });
        }
      } catch (error) {
        console.warn("Failed to parse SSE data:", jsonStr, error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header avec bouton de fermeture */}
      <div className="border-b bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
          <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-foreground truncate">Professeur de {subject} AI</h2>
            <p className="text-sm text-muted-foreground truncate">Posez vos questions de {subject}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <span className="text-3xl">🧮</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Bienvenue dans votre classe virtuelle !</h3>
              <p className="text-muted-foreground">
                Je suis votre professeur de {subject} personnel. Posez-moi n'importe quelle question de {subject} en
                français, arabe ou toute autre langue !
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={
                    typeof message.content === "string"
                      ? message.content
                      : message.content.find((c) => c.type === "text")?.text || ""
                  }
                  isStreaming={isLoading && index === messages.length - 1 && message.role === "assistant"}
                />
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-background">
        <div className="max-w-3xl mx-auto space-y-2">
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm">
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="hover:text-destructive transition-colors"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Posez votre question de ${subject}...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || (!inputValue.trim() && uploadedFiles.length === 0)}
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
