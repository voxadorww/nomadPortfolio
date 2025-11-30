import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Code2, Rocket, Zap, Heart, Sparkles } from 'lucide-react';
import { API_URL, getAuthHeaders } from '../utils/supabase/client';

interface Profile {
  name: string;
  email: string;
  bio: string;
}

export function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: await getAuthHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile(data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary via-secondary to-accent rounded-full mb-6 shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="text-6xl">👨‍💻</span>
          </motion.div>
          
          <h1 className="mb-2">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              About {profile?.name || 'Nomad'}
            </span>
          </h1>
          
          <p className="text-muted-foreground">
            {profile?.email}
          </p>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-8 mb-8 shadow-lg"
        >
          <h2 className="mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            My Story
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {profile?.bio || 'Roblox scripter and adventure seeker 🚀'}
          </p>
        </motion.div>

        {/* Skills/Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
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
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
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
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
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
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
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

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl border border-border p-8 text-center"
        >
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-muted-foreground">
              Always exploring new scripting techniques and game mechanics
            </span>
            <Sparkles className="w-5 h-5 text-secondary" />
          </p>
        </motion.div>
      </div>
    </div>
  );
}
