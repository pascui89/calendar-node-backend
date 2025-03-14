const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        const DB_CNN = process.env.DB_CNN;
        console.log('DB_CNN: ', DB_CNN);
        await mongoose.connect(DB_CNN);
        console.log('Database online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = { 
    dbConnection
};