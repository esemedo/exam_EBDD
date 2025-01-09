class ErrorResponseDTO{
    status;
    message;
    error;
  
    constructor(message, error, status) {
      this.message = message;
      this.error = error;
      this.status = status;
    }
  }

module.exports = ErrorResponseDTO