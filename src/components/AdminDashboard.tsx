import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  LogOut, 
  Rocket,
  Eye,
  LayoutDashboard
} from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { ProjectModal } from './ProjectModal';
import { StarfieldBackground } from './StarfieldBackground';
import { API_URL, getAuthHeaders, supabase } from '../utils/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  robloxLink?: string;
  createdAt: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [viewingProject, setViewingProject] = useState<Project | undefined>();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'preview'>('dashboard');

  // Get all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags))
  ).sort();

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: await getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags.includes(selectedTag));
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedTag]);

  // Create project
  const handleCreateProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Failed to create project');

      await fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  // Update project
  const handleUpdateProject = async (projectData: Omit<Project, 'id'>) => {
    if (!editingProject) return;

    try {
      const response = await fetch(`${API_URL}/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Failed to update project');

      await fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to delete project');

      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Starfield background */}
      <StarfieldBackground />

      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-primary to-secondary border-b border-primary/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-lg">Admin Dashboard</h1>
                <p className="text-white/70 text-xs">Manage your portfolio</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-1">
                <button
                  onClick={() => setView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    view === 'dashboard'
                      ? 'bg-white text-primary shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm">Dashboard</span>
                </button>
                <button
                  onClick={() => setView('preview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    view === 'preview'
                      ? 'bg-white text-primary shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Preview</span>
                </button>
              </div>

              {/* Sign out */}
              <motion.button
                onClick={handleSignOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Dashboard header */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 flex items-center gap-3"
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              My Projects
            </span>
            <Sparkles className="w-8 h-8 text-accent" />
          </motion.h2>
          <p className="text-muted-foreground">
            Manage your Roblox scripting portfolio
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Add button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingProject(undefined);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </motion.button>
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedTag
                ? 'No projects match your filters'
                : 'Start by adding your first project!'}
            </p>
            {!searchQuery && !selectedTag && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Project
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={(p) => {
                    setEditingProject(p);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteProject}
                  onClick={setViewingProject}
                  showActions={true}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Project form modal */}
        <AnimatePresence>
          {showForm && (
            <ProjectForm
              project={editingProject}
              onSave={editingProject ? handleUpdateProject : handleCreateProject}
              onClose={() => {
                setShowForm(false);
                setEditingProject(undefined);
              }}
            />
          )}
        </AnimatePresence>

        {/* Project view modal */}
        <AnimatePresence>
          {viewingProject && (
            <ProjectModal
              project={viewingProject}
              onClose={() => setViewingProject(undefined)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}