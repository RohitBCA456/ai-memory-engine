// src/services/memory.service.js
import api from './api';

export const memoryService = {
  // Fetch stats for the Dashboard cards
  getStats: () => api.get('/retrieval-service/stats'),

  // Fetch all memories for the Memory Explorer table
  getAllMemories: () => api.get('/retrieval-service/all'),

  // Call your Deletion Service (Port 4006 via Gateway)
  deleteMemory: (memoryId) => api.post('/deletion-service/delete', { memoryId }),
};