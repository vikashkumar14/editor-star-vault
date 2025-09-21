
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./components/AdminLogin";
import UserLogin from "./components/UserLogin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import MaterialPreview from "./pages/MaterialPreview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/preview/:id" element={<MaterialPreview />} />
              <Route path="/material/:id" element={<MaterialDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedAdminRoute />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
