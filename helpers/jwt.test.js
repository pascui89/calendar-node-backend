const jwt = require('jsonwebtoken');
const { generateJWT } = require('../helpers/jwt');
require('dotenv').config();

describe('generateJWT Helper Function', () => {
  it('should generate a valid JWT', async () => {
    const uid = '123';
    const name = 'Test User';
    const token = await generateJWT(uid, name);

    expect(token).toBeDefined();

    // Verificar el token
    const decoded = jwt.verify(token, process.env.SECRET_JWT_SEED);
    expect(decoded.uid).toBe(uid);
    expect(decoded.name).toBe(name);
  });

  it('should throw an error if the token cannot be generated', async () => {
    jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => {
        callback(new Error('The token could not be generated'), null);
    });

    await expect(generateJWT('123', 'Test User')).rejects.toBe('The token could not be generated');

    jwt.sign.mockRestore();
  });
});