import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import ToolDetail from "@/pages/tool-detail";
import Category from "@/pages/category";
import Leaderboard from "@/pages/leaderboard";
import Trending from "@/pages/trending";
import Popular from "@/pages/popular";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tool/:slug" component={ToolDetail} />
      <Route path="/category/:category" component={Category} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/trending" component={Trending} />
      <Route path="/popular" component={Popular} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="taaft-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
