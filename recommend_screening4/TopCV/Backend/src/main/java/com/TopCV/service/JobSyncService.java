package com.TopCV.service;

import java.util.List;

public interface JobSyncService {
    
    /**
     * Sync all jobs từ PostgreSQL sang Python service
     */
    void syncAllJobsToPython();
    
    /**
     * Sync single job sang Python service
     */
    void syncJobToPython(Integer jobId);
    
    /**
     * Get all active jobs từ database
     */
    List<Object> getAllActiveJobs();
} 