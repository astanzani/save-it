use actix_web::{error::ResponseError, http::StatusCode, HttpResponse};
use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum UserApiError {
    #[error("Invalid 'email' or 'password'")]
    BadLoginRequest,
    #[error("Wrong email or password")]
    WrongLoginInfo,
    #[error("Unknown error")]
    Unknown,
}

impl UserApiError {
    pub fn name(&self) -> String {
        match self {
            Self::WrongLoginInfo => "WrongLoginInfo".to_string(),
            Self::BadLoginRequest => "BadLoginRequest".to_string(),
            Self::Unknown => "Unknown".to_string(),
        }
    }
}

#[derive(Serialize)]
struct UserApiErrorResponse {
    code: u16,
    error: String,
    message: String,
}

impl ResponseError for UserApiError {
    fn status_code(&self) -> StatusCode {
        match *self {
            Self::WrongLoginInfo => StatusCode::UNAUTHORIZED,
            Self::BadLoginRequest => StatusCode::BAD_REQUEST,
            Self::Unknown => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let status_code = self.status_code();
        let error_response = UserApiErrorResponse {
            code: status_code.as_u16(),
            message: self.to_string(),
            error: self.name(),
        };

        HttpResponse::build(status_code).json(error_response)
    }
}
