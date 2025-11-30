import { motion } from 'motion/react';
import { X, ExternalLink, Calendar, Tag } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  robloxLink?: string;
  createdAt?: string;
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card rounded-2xl shadow-2xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          {/* Project image */}
          <div className="aspect-video bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 relative overflow-hidden rounded-t-2xl">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="text-8xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🚀
                </motion.div>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title */}
          <h2 className="mb-4">{project.title}</h2>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            {project.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}
            {project.tags && project.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {project.tags.length} tag{project.tags.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-3">About This Project</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3">Technologies & Skills</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full border border-primary/20"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Roblox link */}
          {project.robloxLink && (
            <motion.a
              href={project.robloxLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <ExternalLink className="w-5 h-5" />
              View on Roblox
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
