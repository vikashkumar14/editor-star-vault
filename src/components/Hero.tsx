import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Sparkles, Terminal, Layers, Zap, Download, Box } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-background to-background" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        {/* Floating orbs */}
        <div className="orb orb-primary w-[500px] h-[500px] -top-20 -left-20 animate-float" />
        <div className="orb orb-accent w-[400px] h-[400px] top-1/3 -right-20 animate-float-delayed" />
        <div className="orb orb-primary w-[300px] h-[300px] bottom-20 left-1/3 animate-float-slow opacity-30" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-foreground">
                Developer Resources Hub
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
              <span className="block text-foreground">Build Better</span>
              <span className="block gradient-text-animated">
                Ship Faster
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Access premium{" "}
              <span className="text-primary font-semibold">code snippets</span>,{" "}
              <span className="text-accent font-semibold">UI components</span>, and{" "}
              <span className="font-semibold">design assets</span>. 
              Everything you need to create stunning projects.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/materials">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-6 text-base font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground btn-3d group"
                >
                  Explore Resources
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/gallery">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-6 text-base font-bold rounded-xl border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  <Layers className="mr-2 w-5 h-5" />
                  View Gallery
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">500+ Snippets</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Download className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Free Downloads</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Instant Access</span>
              </div>
            </div>
          </div>

          {/* Right - 3D Floating Cards */}
          <div className="relative hidden lg:block h-[500px] perspective-1000">
            {/* Main Code Card */}
            <div className="absolute top-8 left-8 w-80 glass-card rounded-2xl p-6 card-3d animate-float shadow-3d">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-xs font-mono text-muted-foreground overflow-hidden">
                <code className="text-primary">const</code> <code className="text-accent">Button</code> = () =&gt; {"{"}
                <br />  <code className="text-primary">return</code> (
                <br />    &lt;<code className="text-accent">button</code> 
                <br />      <code className="text-muted-foreground">className</code>=<code className="text-green-500">"btn"</code>
                <br />    &gt;
                <br />      Click Me
                <br />    &lt;/<code className="text-accent">button</code>&gt;
                <br />  );
                <br />{"}"};
              </pre>
            </div>

            {/* UI Component Card */}
            <div className="absolute top-32 right-4 w-64 glass-card rounded-2xl p-5 card-3d animate-float-delayed shadow-3d">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">UI Components</span>
                <Box className="w-4 h-4 text-accent" />
              </div>
              <div className="space-y-2">
                <div className="h-8 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded-lg bg-primary/30" />
                  <div className="h-8 flex-1 rounded-lg bg-accent/30" />
                </div>
                <div className="h-8 rounded-lg bg-muted" />
              </div>
            </div>

            {/* Terminal Card */}
            <div className="absolute bottom-12 left-16 w-72 glass-card rounded-2xl p-5 card-3d animate-float-slow shadow-3d">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-foreground">Terminal</span>
              </div>
              <div className="font-mono text-xs space-y-1">
                <p className="text-muted-foreground">
                  <span className="text-green-500">$</span> npm install gyaan-ui
                </p>
                <p className="text-muted-foreground">
                  <span className="text-accent">✓</span> Package installed
                </p>
                <p className="text-muted-foreground animate-pulse">
                  <span className="text-primary">▋</span>
                </p>
              </div>
            </div>

            {/* Stats Badge */}
            <div className="absolute bottom-8 right-12 glass-card rounded-full px-5 py-3 card-3d animate-float border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">10K+</p>
                  <p className="text-xs text-muted-foreground">Developers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
