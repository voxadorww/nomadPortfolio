import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-31ffd1db/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-31ffd1db/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error("Sign up error:", error);
      return c.json({ error: error.message }, 400);
    }
    
    // Initialize user profile
    await kv.set(`profile:${data.user.id}`, {
      name,
      email,
      bio: "Roblox scripter and adventure seeker 🚀",
      avatar: null,
    });
    
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error("Sign up error:", error);
    return c.json({ error: "Failed to sign up" }, 500);
  }
});

// Get user profile
app.get("/make-server-31ffd1db/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const profile = await kv.get(`profile:${user.id}`);
    return c.json({ profile: profile || { name: user.user_metadata?.name, email: user.email, bio: "" } });
  } catch (error) {
    console.error("Get profile error:", error);
    return c.json({ error: "Failed to get profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-31ffd1db/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const updates = await c.req.json();
    const currentProfile = await kv.get(`profile:${user.id}`) || {};
    const updatedProfile = { ...currentProfile, ...updates };
    
    await kv.set(`profile:${user.id}`, updatedProfile);
    
    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Update profile error:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Get all projects for authenticated user
app.get("/make-server-31ffd1db/projects", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const projects = await kv.getByPrefix(`projects:${user.id}:`);
    return c.json({ projects: projects || [] });
  } catch (error) {
    console.error("Get projects error:", error);
    return c.json({ error: "Failed to get projects" }, 500);
  }
});

// Get public projects
app.get("/make-server-31ffd1db/projects/public", async (c) => {
  try {
    const projects = await kv.getByPrefix(`projects:`);
    return c.json({ projects: projects || [] });
  } catch (error) {
    console.error("Get public projects error:", error);
    return c.json({ error: "Failed to get projects" }, 500);
  }
});

// Create a new project
app.post("/make-server-31ffd1db/projects", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const projectData = await c.req.json();
    const projectId = crypto.randomUUID();
    
    const project = {
      id: projectId,
      userId: user.id,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`projects:${user.id}:${projectId}`, project);
    
    return c.json({ success: true, project });
  } catch (error) {
    console.error("Create project error:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// Update a project
app.put("/make-server-31ffd1db/projects/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const projectId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingProject = await kv.get(`projects:${user.id}:${projectId}`);
    if (!existingProject) {
      return c.json({ error: "Project not found" }, 404);
    }
    
    const updatedProject = {
      ...existingProject,
      ...updates,
      id: projectId,
      userId: user.id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`projects:${user.id}:${projectId}`, updatedProject);
    
    return c.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Update project error:", error);
    return c.json({ error: "Failed to update project" }, 500);
  }
});

// Delete a project
app.delete("/make-server-31ffd1db/projects/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const projectId = c.req.param('id');
    await kv.del(`projects:${user.id}:${projectId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

Deno.serve(app.fetch);