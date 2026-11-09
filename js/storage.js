// Save SkillMap data in IndexedDB and keep a LocalStorage fallback.
const SkillMapStorage = {
  key: "skillmapStudentData",
  databaseName: "SkillMapDatabase",
  storeName: "studentData",
  database: null,

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

  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, 1);

      request.onupgradeneeded = function () {
        const database = request.result;
        if (!database.objectStoreNames.contains(SkillMapStorage.storeName)) {
          database.createObjectStore(SkillMapStorage.storeName, { keyPath: "id" });
        }
      };

      request.onsuccess = function () {
        resolve(request.result);
      };

      request.onerror = function () {
        reject(request.error || new Error("Could not open the browser database."));
      };
    });
  },

  readRecord() {
    return new Promise((resolve, reject) => {
      const transaction = this.database.transaction(this.storeName, "readonly");
      const request = transaction.objectStore(this.storeName).get("student");
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Could not read the browser database."));
    });
  },

  writeRecord(data) {
    if (!this.database) return Promise.resolve(false);

    return new Promise((resolve, reject) => {
      const transaction = this.database.transaction(this.storeName, "readwrite");
      transaction.objectStore(this.storeName).put({ id: "student", data });
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error || new Error("Could not save to the browser database."));
      transaction.onabort = () => reject(transaction.error || new Error("The browser database save was cancelled."));
    });
  },

  async initialize() {
    if (!window.indexedDB) {
      console.warn("IndexedDB is unavailable; SkillMap will use LocalStorage.");
      return false;
    }

    try {
      this.database = await this.openDatabase();
      const savedRecord = await this.readRecord();

      if (savedRecord && savedRecord.data) {
        localStorage.setItem(this.key, JSON.stringify(savedRecord.data));
      } else {
        const localData = this.getData();
        const hasSavedData = Boolean(localData.profile || localData.careerId || Object.keys(localData.currentSkills).length);
        if (hasSavedData) await this.writeRecord(localData);
      }
      return true;
    } catch (error) {
      this.database = null;
      console.error("IndexedDB is unavailable; SkillMap will use LocalStorage:", error.message);
      return false;
    }
  },

  async saveData(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
    try {
      return await this.writeRecord(data);
    } catch (error) {
      console.error("The local copy is saved, but IndexedDB could not be updated:", error.message);
      return false;
    }
  },

  async updateData(key, value) {
    const data = this.getData();
    data[key] = value;
    await this.saveData(data);
    return data;
  },

  async reset() {
    localStorage.removeItem(this.key);
    if (!this.database) return;

    try {
      await new Promise((resolve, reject) => {
        const transaction = this.database.transaction(this.storeName, "readwrite");
        transaction.objectStore(this.storeName).delete("student");
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error("Could not reset the browser database."));
      });
    } catch (error) {
      console.error("Could not clear IndexedDB:", error.message);
    }
  }
};

SkillMapStorage.ready = SkillMapStorage.initialize();