
const formatZodIssue = (message) => {
    const pathString = message.join(' ')
    return `${pathString}`
}

exports.checkValidation =async (validation, data)=>{
    try {
        await validation.parseAsync(data);
      } catch (error) {
        const { errors } = error ;
        const errorMessages = errors.map((issue) => issue.message);
        const message = formatZodIssue(errorMessages)
        throw new Error(message, {cause: errors})
    }
}