import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FormCompletion from "./pages/FormCompletion";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Templates from "./pages/Templates";
import ManageTopics from "./pages/ManageTopics";
import DashboardLayout from "./components/DashboardLayout";
import { FileText, History as HistoryIcon, Settings as SettingsIcon, FolderOpen } from "lucide-react";

const navItems = [
  { href: "/complete", label: "Complete Document", icon: FileText },
  { href: "/history", label: "History", icon: HistoryIcon },
  { href: "/templates", label: "Templates", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/complete">
        <DashboardLayout navItems={navItems}>
          <FormCompletion />
        </DashboardLayout>
      </Route>
      <Route path="/history">
        <DashboardLayout navItems={navItems}>
          <History />
        </DashboardLayout>
      </Route>
      <Route path="/templates">
        <DashboardLayout navItems={navItems}>
          <Templates />
        </DashboardLayout>
      </Route>
      <Route path="/settings">
        <DashboardLayout navItems={navItems}>
          <Settings />
        </DashboardLayout>
      </Route>
      <Route path="/manage-topics" component={ManageTopics} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
