import express from 'express'

import { usuario } from './data/usuario.js'

const router = express.Router()

class HttpError extends Error {
    constructor(message, code=400) {
        super(message);
        this.code = code;
    }
}

router.get('/usuario', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.json(usuario)
    } 
    if (! usuario.find(obj => obj.cod == id)) {
        throw new HttpError('Usuário não existe ;-;'); 
    }
    return res.json(usuario.find(obj => obj.cod == id));
});

export default router;