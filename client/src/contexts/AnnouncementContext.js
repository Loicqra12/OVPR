import React, { createContext, useContext, useState, useEffect } from 'react';
import { announcementService } from '../services/announcementService';

const AnnouncementContext = createContext();

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements doit être utilisé à l\'intérieur d\'un AnnouncementProvider');
  }
  return context;
};

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les annonces au montage du composant
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des annonces');
      console.error('Erreur de chargement des annonces:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (announcementData) => {
    try {
      setLoading(true);
      const newAnnouncement = await announcementService.createAnnouncement(announcementData);
      setAnnouncements(prev => [...prev, newAnnouncement]);
      return { success: true, announcement: newAnnouncement };
    } catch (err) {
      setError('Erreur lors de la création de l\'annonce');
      console.error('Erreur de création d\'annonce:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAnnouncement = async (id, updateData) => {
    try {
      setLoading(true);
      const updatedAnnouncement = await announcementService.updateAnnouncement(id, updateData);
      setAnnouncements(prev =>
        prev.map(announcement =>
          announcement.id === id ? updatedAnnouncement : announcement
        )
      );
      return { success: true, announcement: updatedAnnouncement };
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'annonce');
      console.error('Erreur de mise à jour d\'annonce:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      setLoading(true);
      await announcementService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
      return { success: true };
    } catch (err) {
      setError('Erreur lors de la suppression de l\'annonce');
      console.error('Erreur de suppression d\'annonce:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getAnnouncementsByStatus = (status) => {
    return announcements.filter(announcement => announcement.status === status);
  };

  const getAnnouncementsByUser = (userId) => {
    return announcements.filter(announcement => announcement.userId === userId);
  };

  const getAnnouncementsByCategory = (category) => {
    return announcements.filter(announcement => announcement.category === category);
  };

  const searchAnnouncements = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    return announcements.filter(announcement =>
      announcement.title.toLowerCase().includes(term) ||
      announcement.description.toLowerCase().includes(term)
    );
  };

  const value = {
    announcements,
    loading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getAnnouncementsByStatus,
    getAnnouncementsByUser,
    getAnnouncementsByCategory,
    searchAnnouncements,
    refreshAnnouncements: fetchAnnouncements
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export default AnnouncementContext;
