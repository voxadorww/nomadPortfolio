import { motion } from 'motion/react';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  robloxLink?: string;
}

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onClick?: (project: Project) => void;
  showActions?: boolean;
}

export function ProjectCard({ project, onEdit, onDelete, onClick, showActions = true }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="bg-card rounded-xl border border-border overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
      onClick={() => onClick?.(project)}
    >
      {/* Project image */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              className="text-6xl opacity-30"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🚀
            </motion.div>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="text-white">View Details</span>
        </div>
      </div>

      {/* Project info */}
      <div className="p-5">
        <h3 className="mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="flex gap-2">
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this project?')) {
                    onDelete(project.id);
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        )}

        {/* Roblox link indicator */}
        {project.robloxLink && !showActions && (
          <div className="flex items-center gap-2 text-accent text-sm mt-2">
            <ExternalLink className="w-4 h-4" />
            View on Roblox
          </div>
        )}
      </div>
    </motion.div>
  );
}
