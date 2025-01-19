const z = require("zod")
const {stringValidator, emailValidator, arrayValidator, numberValidator} = require("../lib/validators");
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const { checkValidation } = require("../utils/checkValidation");

const orderValidationPOST = z.object({
    email: emailValidator(50),
    products: arrayValidator( z.object({name: stringValidator(10), quantity: numberValidator}), 1),
});

exports.postOrdersValidation = async (req,res,next) => {
    try {
        await checkValidation(orderValidationPOST, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};


const orderValidationDELETE = z.object({
    number_order: stringValidator(10),
  });


exports.deleteOrdersValidation = async (req,res,next) => {
    try {
        await checkValidation(orderValidationDELETE, req.params)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};

const orderValidationPUT = z.object({
    number_order: stringValidator(10),
    products: arrayValidator( z.object({name: stringValidator(10), quantity: numberValidator}), 1),
  })

exports.putOrdersValidation = async (req,res,next) => {
    try {
        await checkValidation(orderValidationPUT, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};