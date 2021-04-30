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
    let header_token = req.headers().get("authorization");

    if let Some(t) = header_token {
        let t = t.to_str().unwrap();
        return Some(String::from(t));
    }

    // Tries to get jwt from cookies
    let cookie_token: Option<Cookie> = req.cookie("authorization");

    if let Some(t) = cookie_token {
        let t = t.value().to_string();
        return Some(t);
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::helpers::jwt::generate_jwt;
    use actix_web::dev::Payload;
    use actix_web::test::TestRequest;
    use actix_web::{cookie::CookieBuilder, test};

    #[actix_rt::test]
    async fn parses_user_data_from_cookie() {
        let jwt = generate_jwt("user-id").unwrap();
        let cookie = CookieBuilder::new("authorization", jwt).finish();
        let request = test::TestRequest::default();
        let request = request.cookie(cookie).to_http_request();

        let mut payload = Payload::None;

        let auth_user = AuthorizedUser::from_request(&request, &mut payload)
            .await
            .expect("Could not get auth user from request");

        assert_eq!(auth_user.id, "user-id");
    }

    #[actix_rt::test]
    async fn parses_user_data_from_header() {
        let jwt = generate_jwt("user-id").unwrap();
        let request = TestRequest::with_header("authorization", jwt).to_http_request();

        let mut payload = Payload::None;

        let auth_user = AuthorizedUser::from_request(&request, &mut payload)
            .await
            .expect("Could not get auth user from request");

        assert_eq!(auth_user.id, "user-id");
    }

    #[actix_rt::test]
    async fn returns_error_if_cannot_parse_jwt() {
        let jwt = "wrong-jwt";
        let request = TestRequest::with_header("authorization", jwt).to_http_request();

        let mut payload = Payload::None;

        let result = AuthorizedUser::from_request(&request, &mut payload).await;

        assert_eq!(result.is_err(), true);
    }
}
