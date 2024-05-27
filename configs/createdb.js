const bcrypt = require('bcrypt');
const sql = require('mssql');

const config = {
    user: 'sa',
    password: '12345',
    server: 'LAPTOP-F1O7HE3A\\SQLEXPRESS',
    database: 'demo',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

const users = [
    { username: 'john_doe', email: 'john.doe@example.com', password: 'password1' },
    { username: 'jane_smith', email: 'jane.smith@example.com', password: 'password2' },
];

async function insertUsers() {
    try {
        await sql.connect(config);
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await new sql.Request()
                .input('UserName', sql.NVarChar, user.username)
                .input('UserEmail', sql.NVarChar, user.email)
                .input('PasswordHash', sql.NVarChar, hashedPassword)
                .query('INSERT INTO Users (UserName, UserEmail, PasswordHash) VALUES (@UserName, @UserEmail, @PasswordHash)');
        }
        console.log('Users inserted successfully');
    } catch (err) {
        console.error('Error inserting users:', err);
    } finally {
        sql.close();
    }
}
insertUsers();
