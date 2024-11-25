const User = require('../models/User');
const Announce = require('../models/Announce');
const Transaction = require('../models/Transaction');

class StatsController {
  async getDashboardStats(req, res) {
    try {
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

      const [
        totalUsers,
        newUsers,
        totalAnnounces,
        newAnnounces,
        totalTransactions,
        successRate
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ createdAt: { $gte: lastMonth } }),
        Announce.countDocuments(),
        Announce.countDocuments({ createdAt: { $gte: lastMonth } }),
        Transaction.countDocuments(),
        this.calculateSuccessRate()
      ]);

      const stats = {
        users: {
          total: totalUsers,
          new: newUsers,
          growth: ((newUsers / totalUsers) * 100).toFixed(1)
        },
        announces: {
          total: totalAnnounces,
          new: newAnnounces,
          growth: ((newAnnounces / totalAnnounces) * 100).toFixed(1)
        },
        transactions: {
          total: totalTransactions,
          successRate
        }
      };

      res.json(stats);
    } catch (error) {
      console.error('Erreur de récupération des statistiques:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async getUserStats(req, res) {
    try {
      const now = new Date();
      const last12Months = new Date(now.setMonth(now.getMonth() - 11));

      const monthlyUsers = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: last12Months }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      const usersByStatus = await User.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const usersByRole = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        monthlyGrowth: monthlyUsers,
        statusDistribution: usersByStatus,
        roleDistribution: usersByRole
      });
    } catch (error) {
      console.error('Erreur de récupération des statistiques utilisateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async getAnnounceStats(req, res) {
    try {
      const now = new Date();
      const last12Months = new Date(now.setMonth(now.getMonth() - 11));

      const monthlyAnnounces = await Announce.aggregate([
        {
          $match: {
            createdAt: { $gte: last12Months }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      const announcesByCategory = await Announce.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]);

      const announcesByStatus = await Announce.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        monthlyGrowth: monthlyAnnounces,
        categoryDistribution: announcesByCategory,
        statusDistribution: announcesByStatus
      });
    } catch (error) {
      console.error('Erreur de récupération des statistiques des annonces:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async getTransactionStats(req, res) {
    try {
      const now = new Date();
      const last12Months = new Date(now.setMonth(now.getMonth() - 11));

      const monthlyTransactions = await Transaction.aggregate([
        {
          $match: {
            createdAt: { $gte: last12Months }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      const transactionsByType = await Transaction.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      res.json({
        monthlyGrowth: monthlyTransactions,
        typeDistribution: transactionsByType
      });
    } catch (error) {
      console.error('Erreur de récupération des statistiques des transactions:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async getGeographicStats(req, res) {
    try {
      const announcesByRegion = await Announce.aggregate([
        {
          $group: {
            _id: '$region',
            count: { $sum: 1 }
          }
        }
      ]);

      const usersByRegion = await User.aggregate([
        {
          $group: {
            _id: '$region',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        announceDistribution: announcesByRegion,
        userDistribution: usersByRegion
      });
    } catch (error) {
      console.error('Erreur de récupération des statistiques géographiques:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Méthode utilitaire pour calculer le taux de succès
  async calculateSuccessRate() {
    try {
      const [totalAnnounces, resolvedAnnounces] = await Promise.all([
        Announce.countDocuments(),
        Announce.countDocuments({ status: 'resolved' })
      ]);

      return totalAnnounces > 0 
        ? ((resolvedAnnounces / totalAnnounces) * 100).toFixed(1)
        : 0;
    } catch (error) {
      console.error('Erreur de calcul du taux de succès:', error);
      return 0;
    }
  }
}

module.exports = new StatsController();
