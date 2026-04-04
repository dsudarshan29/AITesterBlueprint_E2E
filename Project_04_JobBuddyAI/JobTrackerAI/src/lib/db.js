import { openDB } from 'idb';

const DB_NAME = 'JobTrackerDB';
const STORE_NAME = 'jobs';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('status', 'status');
        store.createIndex('dateApplied', 'dateApplied');
      }
    },
  });
}

export async function getJobsDB() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function addJobDB(job) {
  const db = await initDB();
  await db.add(STORE_NAME, job);
  return job;
}

export async function updateJobDB(job) {
  const db = await initDB();
  await db.put(STORE_NAME, job);
  return job;
}

export async function deleteJobDB(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
  return id;
}

export async function clearAllJobsDB() {
  const db = await initDB();
  await db.clear(STORE_NAME);
}

export async function batchAddJobsDB(jobs) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all([
    ...jobs.map((job) => tx.store.put(job)),
    tx.done
  ]);
}
