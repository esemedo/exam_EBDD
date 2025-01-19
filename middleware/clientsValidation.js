const z = require("zod")
const {stringValidator, emailValidator} = require("../lib/validators");
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const { checkValidation } = require("../utils/checkValidation");

const clientValidationPOST = z.object({
  firstname: stringValidator(50),
  lastname: stringValidator(50),
  address: stringValidator(50),
  email: emailValidator(50),
});

exports.postClientsValidation = async (req,res,next) => {
    try {
        await checkValidation(clientValidationPOST, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};


const clientValidationDELETE = z.object({
    email: emailValidator(50),
  });


exports.deleteClientsValidation = async (req,res,next) => {
    try {
        await checkValidation(clientValidationDELETE, req.params)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};

const clientValidationGET = z.object({
    email: emailValidator(50),
  });


exports.getClientsValidation = async (req,res,next) => {
    try {
        await checkValidation(clientValidationGET, req.params)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};


const clientValidationPUT = z.object({
    email: emailValidator(50),
    firstname: stringValidator(50).optional(),
    lastname: stringValidator(50).optional(),
    address: stringValidator(50).optional(),
  }).refine(
    (data) => Object.keys(data).length > 1,
    { message: "Il n'y a rien à mettre à jour." }
  );


exports.putClientsValidation = async (req,res,next) => {
    try {
        await checkValidation(clientValidationPUT, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};


const getClientValidationGETQuery = z.object({
    email: emailValidator(50).optional(),
    firstname: stringValidator(50).optional(),
    lastname: stringValidator(50).optional(),
    address: stringValidator(50).optional(),
});


exports.getClientsValidationQuery = async (req,res,next) => {
    try {
        await checkValidation(getClientValidationGETQuery, req.query)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};