import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Code2, 
  Sparkles, 
  ChevronDown, 
  Github, 
  Mail,
  ExternalLink,
  Zap,
  Heart,
  Menu,
  X
} from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { AdminLoginModal } from './AdminLoginModal';
import { StarfieldBackground } from './StarfieldBackground';
import { API_URL, getAuthHeaders } from '../utils/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  robloxLink?: string;
  createdAt: string;
}

interface Profile {
  name: string;
  bio: string;
}

interface PublicSiteProps {
  onAdminLogin: () => void;
}

export function PublicSite({ onAdminLogin }: PublicSiteProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | undefined>();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  // Fetch projects and profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsResponse = await fetch(`${API_URL}/projects/public`, {
          headers: await getAuthHeaders(),
        });
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects || []);
        }

        // Fetch profile (try to get the first user's profile)
        const profileResponse = await fetch(`${API_URL}/profile`, {
          headers: await getAuthHeaders(),
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData.profile);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Featured projects (first 3)
  const featuredProjects = projects.slice(0, 3);
  const otherProjects = projects.slice(3);

  // Hidden admin access (triple-click the logo)
  const handleLogoClick = () => {
    setAdminClickCount(prev => prev + 1);
    if (adminClickCount >= 2) {
      setShowAdminLogin(true);
      setAdminClickCount(0);
    }
    // Reset counter after 2 seconds
    setTimeout(() => setAdminClickCount(0), 2000);
  };

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Triple click to access admin */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer select-none"
              whileHover={{ scale: 1.05 }}
              onClick={handleLogoClick}
              title="Nomad's Portfolio"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                itsnomad.lol
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('home')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-border overflow-hidden"
              >
                <div className="py-4 space-y-2">
                  {['home', 'projects', 'about', 'contact'].map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item)}
                      className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors capitalize"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Animated background */}
        <StarfieldBackground />

        {/* Hero content */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl mb-8 shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Rocket className="w-16 h-16 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Hey, I'm Nomad! 👋
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A <span className="text-primary">Roblox scripter</span> creating immersive experiences 
              through <span className="text-secondary">Lua</span> and creative problem-solving
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('projects')}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                View My Work
                <ChevronDown className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 bg-card border border-border text-foreground rounded-xl hover:bg-muted transition-colors"
              >
                Get in Touch
              </motion.button>
            </div>

            {/* Fun stats or badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Code2 className="w-5 h-5 text-primary" />
                <span>Lua Expert</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-5 h-5 text-accent" />
                <span>Performance Focused</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="w-5 h-5 text-secondary" />
                <span>Player-First Design</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section id="featured" className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="mb-4 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-accent" />
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Featured Projects
                </span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Check out some of my favorite projects that showcase my scripting skills
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard
                    project={project}
                    onClick={setViewingProject}
                    showActions={false}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Section */}
      <section id="projects" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                All Projects
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A collection of Roblox experiences I've built and contributed to
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
              />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-muted-foreground">Projects coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 6) * 0.1 }}
                >
                  <ProjectCard
                    project={project}
                    onClick={setViewingProject}
                    showActions={false}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary via-secondary to-accent rounded-full mb-6 shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="text-6xl">👨‍💻</span>
            </motion.div>

            <h2 className="mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-8 shadow-lg mb-8"
          >
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-center text-lg">
              {profile?.bio || "Roblox scripter and adventure seeker 🚀\n\nI specialize in creating engaging gameplay mechanics and optimized systems using Lua. When I'm not scripting, I'm exploring new game design patterns and pushing the boundaries of what's possible in Roblox."}
            </p>
          </motion.div>

          {/* Skills */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border border-border p-6 shadow-md"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">Lua Scripting</h3>
              <p className="text-muted-foreground text-sm">
                Expert in Roblox Lua scripting, creating efficient and optimized game mechanics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border border-border p-6 shadow-md"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="mb-2">Game Development</h3>
              <p className="text-muted-foreground text-sm">
                Building immersive Roblox experiences from concept to completion.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6 shadow-md"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="mb-2">Performance</h3>
              <p className="text-muted-foreground text-sm">
                Focused on optimizing scripts for smooth gameplay and minimal lag.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6 shadow-md"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">Passion</h3>
              <p className="text-muted-foreground text-sm">
                Driven by a love for creating fun and engaging player experiences.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Let's Work Together!
              </span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have a Roblox project in mind? Looking for a skilled scripter? 
              Let's create something amazing together!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.a
                href="mailto:contact@itsnomad.lol"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Me
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-muted-foreground">© 2025 itsnomad.lol</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm">Built with passion for Roblox</span>
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>

            {/* Hidden admin trigger - tiny dot in footer */}
            <button
              onClick={() => setShowAdminLogin(true)}
              className="w-2 h-2 bg-muted-foreground/20 rounded-full hover:bg-primary transition-colors"
              title="Admin"
            />
          </div>
        </div>
      </footer>

      {/* Project view modal */}
      <AnimatePresence>
        {viewingProject && (
          <ProjectModal
            project={viewingProject}
            onClose={() => setViewingProject(undefined)}
          />
        )}
      </AnimatePresence>

      {/* Hidden admin login modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <AdminLoginModal
            onClose={() => setShowAdminLogin(false)}
            onLogin={onAdminLogin}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
