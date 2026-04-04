import { useState, useEffect, useCallback } from 'react';
import { getJobsDB, addJobDB, updateJobDB, deleteJobDB, batchAddJobsDB } from '../lib/db';
import { generateId } from '../lib/utils';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getJobsDB();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs from database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async (jobData) => {
    try {
      const newJob = {
        id: generateId(),
        status: 'Wishlist',
        dateApplied: new Date().toISOString(),
        ...jobData,
      };
      await addJobDB(newJob);
      setJobs((prev) => [...prev, newJob]);
    } catch (err) {
      setError('Failed to add job.');
      console.error(err);
    }
  };

  const updateJob = async (id, updates) => {
    try {
      const jobToUpdate = jobs.find((j) => j.id === id);
      if (!jobToUpdate) throw new Error('Job not found');
      
      const updatedJob = { ...jobToUpdate, ...updates };
      await updateJobDB(updatedJob);
      setJobs((prev) => prev.map((j) => (j.id === id ? updatedJob : j)));
    } catch (err) {
      setError('Failed to update job.');
      console.error(err);
    }
  };

  const deleteJob = async (id) => {
    try {
      await deleteJobDB(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      setError('Failed to delete job.');
      console.error(err);
    }
  };

  // Optimistic UI update for drag and drop
  const moveJob = async (jobId, newStatus) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job || job.status === newStatus) return;

    // Optimistically update state
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );

    try {
      // Persist to DB
      await updateJobDB({ ...job, status: newStatus });
    } catch (err) {
      // Revert on error
      setError('Failed to move job.');
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: job.status } : j))
      );
      console.error(err);
    }
  };

  const importJobs = async (importedJobs) => {
      try {
          await batchAddJobsDB(importedJobs);
          await fetchJobs();
      } catch (err) {
          setError('Failed to import jobs. Invalid data format or db error.');
          console.error(err);
      }
  };

  return { jobs, loading, error, addJob, updateJob, deleteJob, moveJob, importJobs };
}
