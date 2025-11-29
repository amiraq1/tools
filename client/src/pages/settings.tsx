import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { ToolsResponse } from "@shared/schema";
import {
  SettingsIcon,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Check,
} from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("ar");
  const [notifications, setNotifications] = useState(true);
  const [savedSetting, setSavedSetting] = useState("");

  const { data: toolsData } = useQuery<ToolsResponse>({
    queryKey: ["/api/tools"],
  });

  const allTools = toolsData?.tools || [];

  useEffect(() => {
    const savedTheme = localStorage.getItem("nabdh-theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("nabdh-theme", newTheme);
    setSavedSetting(newTheme);
    setTimeout(() => setSavedSetting(""), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header tools={allTools} />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* رأس الصفحة */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">الإعدادات</h1>
            </div>
            <p className="text-muted-foreground">إدارة تفضيلات حسابك والتطبيق</p>
          </div>

          <div className="space-y-6">
            {/* المظهر والثيم */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  المظهر
                </CardTitle>
                <CardDescription>اختر نمط العرض المفضل لديك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between ${
                      theme === "light"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    data-testid="button-theme-light"
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5" />
                      <span className="font-medium">فاتح</span>
                    </div>
                    {theme === "light" && <Check className="w-5 h-5 text-primary" />}
                  </button>

                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between ${
                      theme === "dark"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    data-testid="button-theme-dark"
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5" />
                      <span className="font-medium">داكن</span>
                    </div>
                    {theme === "dark" && <Check className="w-5 h-5 text-primary" />}
                  </button>
                </div>

                {savedSetting === theme && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4" />
                    تم الحفظ بنجاح
                  </div>
                )}
              </CardContent>
            </Card>

            {/* اللغة والمنطقة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  اللغة والمنطقة
                </CardTitle>
                <CardDescription>اختر لغتك ومنطقتك الجغرافية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">اللغة</p>
                      <p className="text-sm text-muted-foreground">العربية</p>
                    </div>
                    <Badge variant="secondary">الحالي</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">المنطقة الزمنية</p>
                      <p className="text-sm text-muted-foreground">الوقت المحلي</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* الإشعارات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  الإشعارات
                </CardTitle>
                <CardDescription>إدارة تفضيلات الإشعارات الخاصة بك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">أدوات جديدة</p>
                      <p className="text-sm text-muted-foreground">اخبرني بالأدوات الجديدة</p>
                    </div>
                    <Button
                      variant={notifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotifications(!notifications)}
                      data-testid="button-notifications-toggle"
                    >
                      {notifications ? "مُفعّل" : "معطّل"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">الأدوات المحفوظة</p>
                      <p className="text-sm text-muted-foreground">تحديثات للأدوات التي حفظتها</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      معطّل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* الأمان والخصوصية */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  الأمان والخصوصية
                </CardTitle>
                <CardDescription>حماية حسابك وبيانات الخصوصية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="text-right">
                      <p className="font-medium">كلمة السر</p>
                      <p className="text-sm text-muted-foreground">غيّر كلمة السر الخاصة بك</p>
                    </div>
                    <ChevronRight className="w-5 h-5 mr-auto text-muted-foreground" />
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="text-right">
                      <p className="font-medium">التحقق الثنائي</p>
                      <p className="text-sm text-muted-foreground">أضف طبقة أمان إضافية</p>
                    </div>
                    <ChevronRight className="w-5 h-5 mr-auto text-muted-foreground" />
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-auto p-3">
                    <div className="text-right">
                      <p className="font-medium">الجلسات النشطة</p>
                      <p className="text-sm text-muted-foreground">إدارة أجهزتك المتصلة</p>
                    </div>
                    <ChevronRight className="w-5 h-5 mr-auto text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* معلومات الحساب */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
                <CardDescription>تفاصيل حسابك وخطتك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">البريد الإلكتروني</p>
                    <p className="font-medium">user@example.com</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">الخطة</p>
                    <p className="font-medium flex items-center gap-2">
                      مجاني
                      <Badge variant="outline">أساسي</Badge>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">تاريخ الانضمام</p>
                    <p className="font-medium">يناير 2024</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">الأدوات المحفوظة</p>
                    <p className="font-medium">12 أداة</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* الخروج وحذف الحساب */}
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">منطقة الخطر</CardTitle>
                <CardDescription>إجراءات لا يمكن التراجع عنها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-3 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30"
                  data-testid="button-logout"
                >
                  <LogOut className="w-5 h-5 ml-2 text-red-600 dark:text-red-400" />
                  <span className="text-red-600 dark:text-red-400">تسجيل الخروج</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-3 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30"
                  data-testid="button-delete-account"
                >
                  <span className="text-red-600 dark:text-red-400">حذف الحساب بشكل دائم</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* معلومات عن التطبيق */}
          <div className="mt-12 p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              نبض v1.0 • منصة اكتشاف أدوات الذكاء الاصطناعي
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
