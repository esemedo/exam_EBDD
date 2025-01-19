const z = require("zod")
const {stringValidator} = require("../lib/validators");
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const { checkValidation } = require("../utils/checkValidation");

const providerValidationPOST = z.object({
    name_provider: stringValidator(50),
});

exports.postProvidersValidation = async (req,res,next) => {
    try {
        await checkValidation(providerValidationPOST, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};


const providerValidationDELETE = z.object({
    name_provider: stringValidator(50),
  });


exports.deleteProvidersValidation = async (req,res,next) => {
    try {
        await checkValidation(providerValidationDELETE, req.params)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};

const providerValidationPUT = z.object({
    name_provider: stringValidator(50),
    new_name_provider: stringValidator(50),
  })

exports.putProvidersValidation = async (req,res,next) => {
    try {
        await checkValidation(providerValidationPUT, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};