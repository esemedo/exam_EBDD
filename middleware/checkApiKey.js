const { UNAUTHORIZED_STATUS, FORBIDDEN_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");

exports.checkApiKey =  (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(UNAUTHORIZED_STATUS).json(new ErrorResponseDTO("Il manque la clé API !", {}, UNAUTHORIZED_STATUS));
    }
        if (apiKey !== process.env.API_KEY) {
        return res.status(FORBIDDEN_STATUS).json(new ErrorResponseDTO("La clé d'API est invalide !", {}, FORBIDDEN_STATUS));
        }
        next();
};
