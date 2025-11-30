import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, FileText, Save, AlertCircle } from 'lucide-react';
import { API_URL, getAuthHeaders, supabase } from '../utils/supabase/client';

interface Profile {
  name: string;
  email: string;
  bio: string;
}

export function Settings() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          <p className="text-muted-foreground">
            Manage your account and profile information
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-8 shadow-lg"
        >
          <form onSubmit={handleSave} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block mb-2 text-card-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Your name"
                required
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block mb-2 text-card-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl cursor-not-allowed opacity-60"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-2">
                Email cannot be changed
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-2 text-card-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px] resize-y"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`px-4 py-3 rounded-xl border flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-accent/10 text-accent border-accent/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                {message.text}
              </motion.div>
            )}

            {/* Save button */}
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </form>
        </motion.div>

        {/* Sign out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <button
            onClick={handleSignOut}
            className="w-full px-6 py-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors border border-destructive/20"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
