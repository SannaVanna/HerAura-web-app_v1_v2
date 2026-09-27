import { CommunityPost, Course } from '../types';

const DB_NAME = 'HerAuraDB';
const DB_VERSION = 1;
const STORE_POSTS = 'community_posts';
const STORE_COURSE_PROGRESS = 'course_progress';
const STORE_COURSES = 'courses';

export interface CourseProgressRecord {
  courseId: string;
  completed: boolean;
  completedModuleIds: string[];
  progress: number;
  lastUpdated: string;
}

class IndexedDBService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isSupported: boolean = typeof window !== 'undefined' && 'indexedDB' in window;

  /**
   * Initializes and opens the IndexedDB database.
   */
  private async getDB(): Promise<IDBDatabase> {
    if (!this.isSupported) {
      throw new Error('IndexedDB is not supported in this environment.');
    }

    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Store for community posts
          if (!db.objectStoreNames.contains(STORE_POSTS)) {
            const postStore = db.createObjectStore(STORE_POSTS, { keyPath: 'id' });
            postStore.createIndex('category', 'category', { unique: false });
            postStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          // Store for course completion status & module progress
          if (!db.objectStoreNames.contains(STORE_COURSE_PROGRESS)) {
            db.createObjectStore(STORE_COURSE_PROGRESS, { keyPath: 'courseId' });
          }

          // Store for complete courses catalog with local status
          if (!db.objectStoreNames.contains(STORE_COURSES)) {
            const courseStore = db.createObjectStore(STORE_COURSES, { keyPath: 'id' });
            courseStore.createIndex('category', 'category', { unique: false });
          }
        };

        request.onsuccess = (event: Event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          resolve(db);
        };

        request.onerror = (event: Event) => {
          console.error('IndexedDB open failed:', (event.target as IDBOpenDBRequest).error);
          this.dbPromise = null;
          reject((event.target as IDBOpenDBRequest).error);
        };

        request.onblocked = () => {
          console.warn('IndexedDB opening was blocked.');
        };
      } catch (err) {
        this.dbPromise = null;
        reject(err);
      }
    });

    return this.dbPromise;
  }

  // ==========================================
  // COMMUNITY POSTS PERSISTENCE
  // ==========================================

  /**
   * Retrieves all community posts stored in IndexedDB.
   */
  async getAllPosts(): Promise<CommunityPost[]> {
    if (!this.isSupported) return [];

    try {
      const db = await this.getDB();
      return new Promise<CommunityPost[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_POSTS, 'readonly');
        const store = transaction.objectStore(STORE_POSTS);
        const request = store.getAll();

        request.onsuccess = () => {
          const posts = (request.result as CommunityPost[]) || [];
          // Preserve reverse chronological ordering or ID ordering
          resolve(posts);
        };

        request.onerror = () => {
          console.error('Error fetching posts from IndexedDB:', request.error);
          reject(request.error);
        };
      });
    } catch (err) {
      console.warn('Failed to read posts from IndexedDB, falling back:', err);
      return [];
    }
  }

  /**
   * Saves or updates a single community post in IndexedDB.
   */
  async savePost(post: CommunityPost): Promise<void> {
    if (!this.isSupported) return;

    try {
      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_POSTS, 'readwrite');
        const store = transaction.objectStore(STORE_POSTS);
        const request = store.put(post);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error('Error saving post to IndexedDB:', request.error);
          reject(request.error);
        };
      });
    } catch (err) {
      console.warn('Failed to save post to IndexedDB:', err);
    }
  }

  /**
   * Saves a batch of community posts into IndexedDB.
   */
  async saveAllPosts(posts: CommunityPost[]): Promise<void> {
    if (!this.isSupported || !posts.length) return;

    try {
      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_POSTS, 'readwrite');
        const store = transaction.objectStore(STORE_POSTS);

        posts.forEach((post) => store.put(post));

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => {
          console.error('Error batch saving posts to IndexedDB:', transaction.error);
          reject(transaction.error);
        };
      });
    } catch (err) {
      console.warn('Failed to batch save posts in IndexedDB:', err);
    }
  }

  /**
   * Alias for saveAllPosts to match convenient plural naming.
   */
  async savePosts(posts: CommunityPost[]): Promise<void> {
    return this.saveAllPosts(posts);
  }

  /**
   * Deletes a community post from IndexedDB.
   */
  async deletePost(id: string): Promise<void> {
    if (!this.isSupported) return;

    try {
      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_POSTS, 'readwrite');
        const store = transaction.objectStore(STORE_POSTS);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('Failed to delete post from IndexedDB:', err);
    }
  }

  // ==========================================
  // COURSE COMPLETION & PROGRESS PERSISTENCE
  // ==========================================

  /**
   * Saves the completion status and completed module IDs for a course.
   */
  async saveCourseProgress(
    courseId: string,
    completedModuleIds: string[],
    completed: boolean,
    progress: number = 0
  ): Promise<void> {
    if (!this.isSupported) return;

    const record: CourseProgressRecord = {
      courseId,
      completed,
      completedModuleIds,
      progress,
      lastUpdated: new Date().toISOString(),
    };

    try {
      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_COURSE_PROGRESS, 'readwrite');
        const store = transaction.objectStore(STORE_COURSE_PROGRESS);
        const request = store.put(record);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('Failed to save course progress to IndexedDB:', err);
    }
  }

  /**
   * Retrieves completion status for all courses stored in IndexedDB.
   */
  async getAllCourseProgress(): Promise<Record<string, CourseProgressRecord>> {
    if (!this.isSupported) return {};

    try {
      const db = await this.getDB();
      return new Promise<Record<string, CourseProgressRecord>>((resolve, reject) => {
        const transaction = db.transaction(STORE_COURSE_PROGRESS, 'readonly');
        const store = transaction.objectStore(STORE_COURSE_PROGRESS);
        const request = store.getAll();

        request.onsuccess = () => {
          const records = (request.result as CourseProgressRecord[]) || [];
          const progressMap: Record<string, CourseProgressRecord> = {};
          records.forEach((r) => {
            progressMap[r.courseId] = r;
          });
          resolve(progressMap);
        };

        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('Failed to get course progress from IndexedDB:', err);
      return {};
    }
  }

  /**
   * Saves the entire course list with current module completion states.
   */
  async saveAllCourses(courses: Course[]): Promise<void> {
    if (!this.isSupported || !courses.length) return;

    try {
      const db = await this.getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_COURSES, 'readwrite');
        const store = transaction.objectStore(STORE_COURSES);

        courses.forEach((c) => store.put(c));

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (err) {
      console.warn('Failed to save courses to IndexedDB:', err);
    }
  }

  /**
   * Retrieves all courses with saved completion status from IndexedDB.
   */
  async getAllCourses(): Promise<Course[]> {
    if (!this.isSupported) return [];

    try {
      const db = await this.getDB();
      return new Promise<Course[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_COURSES, 'readonly');
        const store = transaction.objectStore(STORE_COURSES);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve((request.result as Course[]) || []);
        };

        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('Failed to load courses from IndexedDB:', err);
      return [];
    }
  }

  /**
   * Checks if offline mode is currently active.
   */
  isOffline(): boolean {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return !navigator.onLine;
    }
    return false;
  }
}

export const indexedDBService = new IndexedDBService();
