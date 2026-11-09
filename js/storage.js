// Keep a local copy, and sync it to Supabase when cloud settings are present.
const SkillMapStorage = {
  key: "skillmapStudentData",
  table: "student_analyses",
  cloudClient: null,
  userId: null,
  cloudStatus: "local",

  getData() {
    const savedData = localStorage.getItem(this.key);
    if (!savedData) return this.emptyData();

    try {
      return { ...this.emptyData(), ...JSON.parse(savedData) };
    } catch (error) {
      console.error("Could not read saved SkillMap data:", error);
      return this.emptyData();
    }
  },

  emptyData() {
    return {
      profile: null,
      careerId: "",
      currentSkills: {},
      completedSkills: [],
      learningSkills: []
    };
  },

  saveData(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
    return this.saveToCloud(data).catch((error) => {
      this.cloudStatus = "error";
      console.error("Cloud sync failed; the local copy is saved:", error.message);
      return false;
    });
  },

  async updateData(key, value) {
    const data = this.getData();
    data[key] = value;
    await this.saveData(data);
    return data;
  },

  async saveToCloud(data) {
    if (!this.cloudClient || !this.userId || !data.profile || !data.careerId) return false;

    const { error } = await this.cloudClient.from(this.table).upsert({
      user_id: this.userId,
      profile: data.profile,
      career_id: data.careerId,
      current_skills: data.currentSkills,
      completed_skills: data.completedSkills,
      learning_skills: data.learningSkills,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });

    if (error) {
      this.cloudStatus = "error";
      console.error("Could not sync SkillMap data:", error.message);
      return false;
    }
    this.cloudStatus = "connected";
    return true;
  },

  async initialize() {
    const config = window.SkillMapCloudConfig || {};
    if (!config.url || !config.publishableKey || !window.supabase) return;

    this.cloudClient = window.supabase.createClient(config.url, config.publishableKey);
    try {
      let { data, error } = await this.cloudClient.auth.getSession();
      if (error) throw error;
      if (!data.session) {
        ({ data, error } = await this.cloudClient.auth.signInAnonymously());
        if (error) throw error;
      }
      this.userId = data.session?.user?.id || data.user?.id;
      if (!this.userId) throw new Error("Could not start an anonymous student session.");

      const { data: savedRow, error: loadError } = await this.cloudClient
        .from(this.table)
        .select("profile, career_id, current_skills, completed_skills, learning_skills")
        .eq("user_id", this.userId)
        .maybeSingle();
      if (loadError) throw loadError;

      const localData = this.getData();
      const hasLocalData = Boolean(localData.profile || localData.careerId || Object.keys(localData.currentSkills).length);
      if (savedRow && !hasLocalData) {
        localStorage.setItem(this.key, JSON.stringify({
          ...this.emptyData(),
          profile: savedRow.profile,
          careerId: savedRow.career_id,
          currentSkills: savedRow.current_skills || {},
          completedSkills: savedRow.completed_skills || [],
          learningSkills: savedRow.learning_skills || []
        }));
      } else if (hasLocalData) {
        const saved = await this.saveToCloud(localData);
        if (!saved) throw new Error("Could not sync the local record to Supabase.");
      }
      this.cloudStatus = "connected";
    } catch (error) {
      this.cloudStatus = "error";
      console.error("Supabase is unavailable; SkillMap will use local storage:", error.message);
    }
  },

  async reset() {
    try {
      if (this.cloudClient && this.userId) {
        const { error } = await this.cloudClient.from(this.table).delete().eq("user_id", this.userId);
        if (error) console.error("Could not clear the cloud copy:", error.message);
        await this.cloudClient.auth.signOut();
      }
    } catch (error) {
      console.error("Could not clear the cloud copy:", error.message);
    } finally {
      localStorage.removeItem(this.key);
    }
  }
};

SkillMapStorage.ready = SkillMapStorage.initialize();