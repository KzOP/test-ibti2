import { useState, useRef, useEffect } from "react";
import { MessageSquare, Bot, Send, RefreshCw, AlertTriangle, User, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sendMessage, resetChat, type ChatMessage } from "@/lib/gemini";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 500;
const MIN_DELAY_MS = 2000;

const QUICK_SUGGESTIONS = [
  "اقترح لي جامعات مناسبة",
  "ما الفرق بين SAT و ACT؟",
  "كيف أحسب الموزونية؟",
  "ما أفضل تخصصات الهندسة؟",
  "ما شروط الابتعاث؟",
  "كيف أتقدم لبرنامج خادم الحرمين؟",
];

const NO_KEY = import.meta.env.VITE_GEMINI_API_KEY === undefined || import.meta.env.VITE_GEMINI_API_KEY === "";

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSentAt, setLastSentAt] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    if (msg.length > MAX_LENGTH) { setError(`الرسالة طويلة جداً (الحد الأقصى ${MAX_LENGTH} حرف)`); return; }

    const now = Date.now();
    if (now - lastSentAt < MIN_DELAY_MS) {
      setError("يرجى الانتظار لحظة قبل إرسال رسالة أخرى");
      return;
    }

    setError("");
    setInput("");
    setLastSentAt(now);
    setMessages((p) => [...p, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const reply = await sendMessage(msg);
      setMessages((p) => [...p, { role: "model", text: reply }]);
    } catch (e: any) {
      const isKeyMissing = e?.message === "GEMINI_KEY_MISSING";
      setError(
        isKeyMissing
          ? "مفتاح Gemini API غير مضبوط. يرجى إضافة VITE_GEMINI_API_KEY في إعدادات البيئة."
          : "حدث خطأ أثناء الاتصال بالمساعد. يرجى المحاولة مرة أخرى."
      );
      setMessages((p) => p.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetChat();
    setMessages([]);
    setError("");
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout title="مساعد AI">
      <div className="flex flex-col h-full" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Bot size={20} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">مساعد ابتعاثي الذكي</h2>
                <Badge className="text-[10px] bg-green-100 text-green-700 border-0">
                  <Sparkles size={9} className="ml-0.5" />
                  Gemini
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">مساعد للابتعاث والجامعات</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-muted-foreground h-8">
              <RefreshCw size={13} className="ml-1" />
              محادثة جديدة
            </Button>
          )}
        </div>

        {NO_KEY && (
          <div className="px-4 pt-3 flex-shrink-0">
            <Alert variant="destructive" className="text-xs">
              <AlertTriangle size={14} />
              <AlertDescription>
                مفتاح Gemini API غير مضبوط. أضف <code className="font-mono bg-destructive/20 px-1 rounded">VITE_GEMINI_API_KEY</code> في إعدادات البيئة لتفعيل المساعد.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                <Bot size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">مرحباً! أنا مساعدك الذكي</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
                اسألني عن الجامعات، الابتعاث، الموزونيات، أو التخصصات
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-sm mx-auto">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-accent/50 hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-2.5", msg.role === "user" ? "justify-start flex-row-reverse" : "justify-start")}>
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                msg.role === "user" ? "bg-primary" : "bg-accent border border-border"
              )}>
                {msg.role === "user"
                  ? <User size={14} className="text-white" />
                  : <Bot size={14} className="text-primary" />
                }
              </div>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted text-foreground rounded-tl-sm"
              )}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-accent border border-border flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="text-xs">
              <AlertTriangle size={13} />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border bg-white px-4 py-3 flex-shrink-0">
          {messages.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-2">
              {QUICK_SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  disabled={loading}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب سؤالك هنا... (Enter للإرسال)"
              className="resize-none text-sm min-h-[44px] max-h-32 flex-1"
              rows={1}
              maxLength={MAX_LENGTH}
              disabled={loading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              size="icon"
              className="h-11 w-11 flex-shrink-0 rounded-xl"
            >
              <Send size={16} />
            </Button>
          </div>
          {input.length > MAX_LENGTH * 0.8 && (
            <p className="text-[10px] text-muted-foreground mt-1 text-left">
              {input.length}/{MAX_LENGTH}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
