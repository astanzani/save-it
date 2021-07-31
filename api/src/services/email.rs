use sendgrid::{v3::*, SendgridError};
use std::env;
use thiserror::Error;

use crate::helpers::password_reset::PasswordResetToken;

#[derive(Error, Debug)]
pub enum EmailServiceError {
    #[error("Unknown error")]
    Unknown,
}

pub struct EmailService {}

impl EmailService {
    pub fn send_forgot_password_email(
        &self,
        to_address: &str,
        token: PasswordResetToken,
        host: &str,
    ) -> Result<(), EmailServiceError> {
        let api_key = env::var("SENDGRID_API_KEY").expect("MISSING SENDGRID API KEY");
        let from_address = env::var("SENDGRID_FROM").expect("MISSING FROM EMAIL");
        let content = Content::new()
            .set_content_type("text/html")
            .set_value(email_template(host, &token.token));
        let from = Email::new(from_address);
        let to = Email::new(to_address);
        let personalization = Personalization::new(to);
        let message = Message::new(from)
            .set_subject("Test Email")
            .add_content(content)
            .add_personalization(personalization);
        Sender::new(api_key)
            .send(&message)
            .map_err(map_sendgrid_error)?;

        Ok(())
    }
}

fn email_template(host: &str, token: &str) -> String {
    let url = format!("https://{}/forgotpassword?token={}", host, token);

    format!(
        r#"<div>
        <p>Please use the following link to reset your password:</p>
        </br>
        <a href={}>Reset Password</a>
    </div>"#,
        url
    )
}

fn map_sendgrid_error(error: SendgridError) -> EmailServiceError {
    match error {
        _ => EmailServiceError::Unknown,
    }
}
