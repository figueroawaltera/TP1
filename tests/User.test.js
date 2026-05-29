const User = require("../src/User");
const crypto = require('crypto');

let juan;

beforeEach(()=>{
    juan = new User("Juan Gardey", "LIFIA, UNLP", "jgardey@lifia.ar", "123");
})

describe("Un usuario", () =>{
    it("deberia tener su clave encriptada", () => {
        const hashEsperado =
            crypto
                .createHash('sha256')
                .update("123")
                .digest('base64');

        expect(
            juan.getEncryptedPassword()
        ).toBe(hashEsperado);
    })
})