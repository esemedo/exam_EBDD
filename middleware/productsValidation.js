const z = require("zod")
const {stringValidator, numberValidator} = require("../lib/validators");
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const { checkValidation } = require("../utils/checkValidation");

const productValidationPOST = z.object({
    category: stringValidator(50),
    provider: stringValidator(50),
    name_product: stringValidator(50),
    references_product: stringValidator(10),
    stock: numberValidator,
    price: numberValidator
});

exports.postProductsValidation = async (req,res,next) => {
    try {
        await checkValidation(productValidationPOST, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};


const productValidationDELETE = z.object({
    references_product: stringValidator(10),
});


exports.deleteProductsValidation = async (req,res,next) => {
    try {
        await checkValidation(productValidationDELETE, req.params)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};

const productValidationPUT = z.object({
    category: stringValidator(50).optional(),
    provider: stringValidator(50).optional(),
    name_product: stringValidator(50).optional(),
    references_product: stringValidator(10),
    stock: numberValidator.optional(),
    price: numberValidator.optional()
}).refine(
    (data) => Object.keys(data).length > 1,
    { message: "Il n'y a rien à mettre à jour." }
  );

exports.putProductsValidation = async (req,res,next) => {
    try {
        await checkValidation(productValidationPUT, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};