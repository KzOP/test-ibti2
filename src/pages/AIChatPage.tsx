import { MessageSquare, Bot, Clock, AlertTriangle, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PLANNED_FEATURES = [
  "الإجابة على أسئلتك عن شروط القبول في كل جامعة",
  "مقارنة الجامعات بناءً على ملفك الشخصي",
  "شرح معادلات الموزونة وطريقة الحساب",
  "مساعدتك في اختيار التخصص المناسب",
  "تنبيهات عن مواعيد التقديم في برامج الابتعاث",
  "الإجابة بالعربية والإنجليزية",
];

export default function AIChatPage() {
  return (
    <Layout title="مساعد AI">
      <div className="p-6 max-w-2xl mx-auto" dir="rtl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
            <MessageSquare size={24} className="text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">مساعد ابتعاثي الذكي</h2>
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">
                <Clock size={10} className="ml-1" />قريباً
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">مساعد ذكي لأسئلتك عن الجامعات والابتعاث</p>
          </div>
        </div>

        <Card className="border-primary/20 bg-accent/30 mb-6">
          <CardContent className="py-10 text-center">
            <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-5 flex items-center justify-center">
              <Bot size={40} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">قيد التطوير</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mb-4">
              سيتم تفعيل المساعد الذكي قريباً بعد ربط واجهة برمجة الذكاء الاصطناعي (AI API). حالياً الميزة غير متصلة بأي نموذج ذكاء اصطناعي.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-right max-w-sm mx-auto">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>تنبيه:</strong> المساعد غير متصل بالإنترنت ولا يُقدّم معلومات حالياً. أي ردود ظهرت سابقاً كانت نصوصاً ثابتة وليست ذكاءً اصطناعياً حقيقياً.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border mb-6">
          <CardContent className="py-4 px-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-primary" />
              <p className="text-sm font-semibold text-foreground">ما الذي سيقدمه المساعد الذكي؟</p>
            </div>
            <ul className="space-y-2">
              {PLANNED_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-accent text-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="bg-muted/40 border border-border rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            في انتظار تفعيل المساعد، يمكنك استخدام هذه الصفحات للحصول على المعلومات التي تحتاجها:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/universities">
              <Button variant="outline" size="sm" className="text-xs">استعرض الجامعات</Button>
            </Link>
            <Link href="/scholarships">
              <Button variant="outline" size="sm" className="text-xs">برامج الابتعاث</Button>
            </Link>
            <Link href="/calculator">
              <Button variant="outline" size="sm" className="text-xs">احسب موزونتك</Button>
            </Link>
            <Link href="/recommendations">
              <Button variant="outline" size="sm" className="text-xs">توصياتي</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
