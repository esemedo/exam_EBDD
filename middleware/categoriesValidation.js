const z = require("zod")
const {stringValidator} = require("../lib/validators");
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const { checkValidation } = require("../utils/checkValidation");

//POST
const categoryValidationPOST = z.object({
    name_category: stringValidator(50),
});

exports.postCategoriesValidation = async (req,res,next) => {
    try {
        await checkValidation(categoryValidationPOST, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};

//DELETE

const categoryValidationDELETE = z.object({
    name_category: stringValidator(50),
  });


exports.deleteCategoriesValidation = async (req,res,next) => {
    try {
        await checkValidation(categoryValidationDELETE, req.params)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};


//GET

const categoryValidationGET = z.object({
    category: stringValidator(50).optional(),
  });


exports.getCategoriesValidation = async (req,res,next) => {
    try {
        await checkValidation(categoryValidationGET, req.query)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};


//PUT

const categoryValidationPUT = z.object({
    name_category: stringValidator(50),
    new_name_category: stringValidator(50),
  })

exports.putCategoriesValidation = async (req,res,next) => {
    try {
        await checkValidation(categoryValidationPUT, req.body)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};