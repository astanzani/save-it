use std::collections::BTreeMap;
use std::env;

use hmac::{Hmac, NewMac};
use jwt::{Error, SignWithKey, VerifyWithKey};
use sha2::Sha256;

use crate::middlewares::auth::AuthorizedUser;

pub fn parse_jwt(token: &str) -> Result<AuthorizedUser, Error> {
    let secret = env::var("SECRET").expect("Missing secret env var");
    let key: Hmac<Sha256> = Hmac::new_varkey(secret.as_bytes()).unwrap();
    let claims: BTreeMap<String, String> = token.verify_with_key(&key)?;
    let id = claims.get("_id").unwrap();

    Ok(AuthorizedUser {
        id: String::from(id),
    })
}

pub fn generate_jwt(id: &str) -> Result<String, Error> {
    let secret = env::var("SECRET").expect("Missing secret env var");
    let key: Hmac<Sha256> = Hmac::new_varkey(secret.as_bytes()).unwrap();
    let mut claims = BTreeMap::new();
    claims.insert("_id", id);

    let token = claims.sign_with_key(&key)?;

    Ok(token)
}
