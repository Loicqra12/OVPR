const User = require('../models/User');
const Announce = require('../models/Announce');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const Setting = require('../models/Setting');
const { generateToken, verify2FACode } = require('../utils/auth');
const { sendEmail } = require('../services/emailService');
const { createExcelReport } = require('../utils/excel');

class AdminController {
  // Authentification
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await User.findOne({ email, role: 'admin' });

      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Générer et envoyer le code 2FA
      const code2FA = await admin.generate2FACode();
      await sendEmail({
        to: admin.email,
        subject: 'Code d\'authentification OVPR',
        template: '2fa',
        data: { code: code2FA }
      });

      res.json({ message: 'Code 2FA envoyé' });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async verify2FA(req, res) {
    try {
      const { email, code } = req.body;
      const admin = await User.findOne({ email, role: 'admin' });

      if (!admin || !verify2FACode(code, admin.twoFactorSecret)) {
        return res.status(401).json({ message: 'Code 2FA invalide' });
      }

      const token = generateToken(admin);
      res.json({ token });
    } catch (error) {
      console.error('Erreur de vérification 2FA:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Gestion des annonces
  async getAnnounces(req, res) {
    try {
      const { page = 1, limit = 10, status, category, search } = req.query;
      const query = {};

      if (status) query.status = status;
      if (category) query.category = category;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const announces = await Announce.find(query)
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Announce.countDocuments(query);

      res.json({
        announces,
        total,
        pages: Math.ceil(total / limit)
      });
    } catch (error) {
      console.error('Erreur de récupération des annonces:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async getReportedAnnounces(req, res) {
    try {
      const announces = await Announce.find({ reported: true })
        .populate('owner', 'name email')
        .populate('reports.user', 'name email')
        .sort({ 'reports.createdAt': -1 });

      res.json(announces);
    } catch (error) {
      console.error('Erreur de récupération des annonces signalées:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Gestion des utilisateurs
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, status, role, search } = req.query;
      const query = {};

      if (status) query.status = status;
      if (role) query.role = role;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('-password -twoFactorSecret')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await User.countDocuments(query);

      res.json({
        users,
        total,
        pages: Math.ceil(total / limit)
      });
    } catch (error) {
      console.error('Erreur de récupération des utilisateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { 
          status,
          statusReason: reason,
          statusUpdatedAt: Date.now()
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Envoyer une notification à l'utilisateur
      await Notification.create({
        recipient: user._id,
        type: 'account_status',
        title: 'Mise à jour du statut de votre compte',
        message: `Votre compte a été ${status}. ${reason || ''}`,
        priority: 'high'
      });

      res.json(user);
    } catch (error) {
      console.error('Erreur de mise à jour du statut:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Alertes et notifications
  async getAlerts(req, res) {
    try {
      const alerts = await Notification.find({ type: 'alert' })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json(alerts);
    } catch (error) {
      console.error('Erreur de récupération des alertes:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async getRecentActivity(req, res) {
    try {
      const activities = await Activity.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(50);

      res.json(activities);
    } catch (error) {
      console.error('Erreur de récupération des activités:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Configuration
  async getSettings(req, res) {
    try {
      const settings = await Setting.find();
      res.json(settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {}));
    } catch (error) {
      console.error('Erreur de récupération des paramètres:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async updateSettings(req, res) {
    try {
      const updates = req.body;
      const operations = Object.entries(updates).map(([key, value]) => ({
        updateOne: {
          filter: { key },
          update: { $set: { value } },
          upsert: true
        }
      }));

      await Setting.bulkWrite(operations);
      res.json({ message: 'Paramètres mis à jour' });
    } catch (error) {
      console.error('Erreur de mise à jour des paramètres:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Export des données
  async exportAnnounces(req, res) {
    try {
      const announces = await Announce.find()
        .populate('owner', 'name email')
        .lean();

      const workbook = await createExcelReport('Annonces', announces, [
        { header: 'ID', key: '_id' },
        { header: 'Titre', key: 'title' },
        { header: 'Propriétaire', key: 'owner.name' },
        { header: 'Statut', key: 'status' },
        { header: 'Créé le', key: 'createdAt' }
      ]);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=announces.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Erreur d\'export des annonces:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}

module.exports = new AdminController();
