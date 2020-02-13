const bcrypt = require('bcryptjs');

const encrypt = (plaintext) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintext, salt);

}

const decrypt = (plaintext, ciphertext) => {
    return bcrypt.compareSync(plaintext, ciphertext)
}
    

module.exports = { encrypt, decrypt };