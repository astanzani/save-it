use rand::Rng;
use serde::{Deserialize, Serialize};
use std::{str, time};

#[derive(Deserialize, Serialize, Clone)]
pub struct PasswordResetToken {
    pub token: String,
    pub expires: i64,
}

pub fn generate_password_reset_token() -> Result<PasswordResetToken, str::Utf8Error> {
    let token: String = rand::thread_rng()
        .sample_iter(rand::distributions::Alphanumeric)
        .take(20)
        .map(char::from)
        .collect();

    let expires = time::SystemTime::now()
        .duration_since(time::UNIX_EPOCH)
        .unwrap()
        .as_millis()
        + 300000;

    Ok(PasswordResetToken {
        token: String::from(token),
        expires: expires as i64,
    })
}
