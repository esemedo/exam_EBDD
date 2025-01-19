const z = require("zod")
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const { checkValidation } = require("../utils/checkValidation");
const { dateValidator } = require("../lib/validators");


const statisticValidationGET = z.object({
    start_date: dateValidator,
    end_date: dateValidator,
});

exports.getStatisticsValidation = async (req,res,next) => {
    try {
        await checkValidation(statisticValidationGET, req.query)
        next()
    } catch (error) {
        return res.status(BADREQUEST_STATUS).json(new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS))
    }
};


