use actix_web::{
    cookie::Cookie, dev::Payload, error::ErrorUnauthorized, Error, FromRequest, HttpMessage,
    HttpRequest,
};
use futures::future::{err, ok, Ready};

use crate::helpers::jwt::parse_jwt;

pub struct AuthorizedUser {
    pub id: String,
}

impl FromRequest for AuthorizedUser {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;
    type Config = ();

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        let token = get_jwt_from_req(&req);

        match token {
            Some(token) => {
                println!("TOKEN: : {}", &token);
                let authorized_user = parse_jwt(&token);
                match authorized_user {
                    Ok(authorized_user) => ok(authorized_user),
                    Err(_) => err(ErrorUnauthorized(
                        "Failed to parse authentication token from request",
                    )),
                }
            }
            None => err(ErrorUnauthorized(
                "Failed to parse authentication token from request",
            )),
        }
    }
}

fn get_jwt_from_req(req: &HttpRequest) -> Option<String> {
    // Tries to get jwt from header
    // TODO: Maybe remove ? (may be needed for chrome ext)
    let header_token = req.headers().get("authorization");

    if let Some(t) = header_token {
        println!("HEADER: {:?}", t);
        let t = t.to_str().unwrap();
        return Some(String::from(t));
    }

    // Tries to get jwt from cookies
    let cookie_token: Option<Cookie> = req.cookie("auth");

    if let Some(t) = cookie_token {
        println!("COOKIE: {:?}", t);
        let t = t.value().to_string();
        return Some(t);
    }

    None
}
