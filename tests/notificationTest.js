const axios = require('axios');

const testNotifications = async () => {
    try {
        // Configuration
        const API_URL = 'http://localhost:5000/api';
        let authToken;

        // 1. Créer un compte utilisateur de test
        console.log('1. Création du compte utilisateur...');
        const userResponse = await axios.post(`${API_URL}/auth/register`, {
            email: 'test@example.com',
            password: 'Test123!',
            name: 'Utilisateur Test'
        });
        authToken = userResponse.data.token;
        console.log('✅ Compte créé avec succès');

        // Configuration des headers avec le token
        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        // 2. Créer un premier vélo (statut normal)
        console.log('\n2. Création du premier vélo...');
        const velo1 = await axios.post(`${API_URL}/items`, {
            name: 'Vélo de route Trek',
            type: 'vehicle',
            vehicleDetails: {
                type: 'velo',
                brand: 'Trek',
                model: 'Domane SL 6',
                year: '2023',
                color: 'Rouge',
                serialNumber: 'WTU123456789'
            },
            purchaseDate: '2023-01-15',
            purchasePrice: 3499.99,
            status: 'active'
        }, config);
        console.log('✅ Premier vélo créé');

        // 3. Attendre un peu
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 4. Créer un deuxième vélo avec le même numéro de série (simuler un vol)
        console.log('\n3. Création du deuxième vélo (correspondance)...');
        const velo2 = await axios.post(`${API_URL}/items`, {
            name: 'Vélo Trek occasion',
            type: 'vehicle',
            vehicleDetails: {
                type: 'velo',
                brand: 'Trek',
                model: 'Domane SL 6',
                year: '2023',
                color: 'Rouge',
                serialNumber: 'WTU123456789'
            },
            purchaseDate: '2023-09-15',
            purchasePrice: 2000.00,
            status: 'active'
        }, config);
        console.log('✅ Deuxième vélo créé');

        // 5. Attendre un peu
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 6. Changer le statut du premier vélo en "stolen"
        console.log('\n4. Changement du statut du premier vélo en "volé"...');
        await axios.patch(`${API_URL}/items/${velo1.data._id}`, {
            status: 'stolen'
        }, config);
        console.log('✅ Statut mis à jour');

        // 7. Vérifier les notifications
        console.log('\n5. Vérification des notifications...');
        const notifications = await axios.get(`${API_URL}/notifications`, config);
        console.log('Notifications reçues:', notifications.data);

        console.log('\n✨ Test terminé avec succès!');
        console.log('Vous devriez voir:');
        console.log('1. Une notification de correspondance pour le numéro de série');
        console.log('2. Une notification de changement de statut');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    }
};

// Exécuter les tests
testNotifications();
