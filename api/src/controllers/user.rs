use actix_web::{
    cookie::{Cookie, CookieBuilder, SameSite},
    web, HttpResponse, Responder,
};
use bcrypt;
use mongodb::error::ErrorKind;

use crate::helpers::jwt::generate_jwt;
use crate::middlewares::auth::AuthorizedUser;
use crate::server::AppState;
use crate::types::{FindOneResult, LoginRequest, RegisterUserRequest};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/users/register").route(web::post().to(register_user)));
    cfg.service(web::resource("/users/login").route(web::post().to(login_user)));
    cfg.service(web::resource("/users/current").route(web::get().to(get_current_user)));
    cfg.service(web::resource("/users/logout").route(web::post().to(logout)));
}

async fn register_user(
    data: web::Data<AppState>,
    user: web::Json<RegisterUserRequest>,
) -> HttpResponse {
    let on_success = |inserted_id: &str| {
        let token = generate_jwt(inserted_id);
        match token {
            Ok(token) => {
                let auth_cookie = build_auth_cookie(&token);
                HttpResponse::Created()
                    .header("x-auth-token", token.clone())
                    .cookie(auth_cookie)
                    .finish()
            }
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    };

    let mut user_info = user.into_inner();
    let hashed_pass = bcrypt::hash(user_info.password, 10).unwrap();
    user_info.password = hashed_pass;

    let user_service = &data.services_container.user_service.lock().unwrap();
    let insert_result = user_service.create(user_info).await;

    match insert_result {
        Ok(inserted_id) => on_success(&inserted_id),
        Err(err) => match err.kind.as_ref() {
            ErrorKind::WriteError(_) => HttpResponse::BadRequest().finish(),
            _ => HttpResponse::InternalServerError().finish(),
        },
    }
}

async fn login_user(
    data: web::Data<AppState>,
    login_info: web::Json<LoginRequest>,
) -> HttpResponse {
    let user_service = &data.services_container.user_service.lock().unwrap();
    let login_info = login_info.into_inner();
    let email = login_info.email;
    let password = login_info.password;

    let on_user_found = |id, hashed_password| {
        let authenticated = bcrypt::verify(password, hashed_password).unwrap();

        match authenticated {
            true => {
                let token = generate_jwt(id);
                match token {
                    Ok(token) => {
                        let auth_cookie = build_auth_cookie(&token);
                        HttpResponse::Ok()
                            .header("x-auth-token", token.clone())
                            .cookie(auth_cookie)
                            .finish()
                    }
                    Err(_) => HttpResponse::InternalServerError().finish(),
                }
            }
            false => HttpResponse::Unauthorized().finish(),
        }
    };

    let result = user_service.get_by_email(&email).await;

    match result {
        Ok(result) => match result {
            FindOneResult::Found(user) => {
                let hashed_password = user_service
                    .get_hashed_password(&user.id.to_string())
                    .await
                    .unwrap();
                on_user_found(&user.id.to_string(), &hashed_password)
            }
            FindOneResult::NotFound => HttpResponse::Unauthorized().finish(),
        },
        _ => HttpResponse::InternalServerError().finish(),
    }
}

async fn get_current_user(data: web::Data<AppState>, auth_user: AuthorizedUser) -> HttpResponse {
    let on_user_found = |user| HttpResponse::Ok().json(user);

    let user_service = &data.services_container.user_service.lock().unwrap();
    let result = user_service.get_by_id(&auth_user.id).await;

    match result {
        Ok(result) => match result {
            FindOneResult::Found(user) => on_user_found(user),
            FindOneResult::NotFound => HttpResponse::Unauthorized().finish(),
        },
        _ => HttpResponse::InternalServerError().finish(),
    }
}

async fn logout() -> HttpResponse {
    let auth_cookie = CookieBuilder::new("authorization", "")
        .secure(true)
        .http_only(true)
        .same_site(SameSite::Strict)
        .expires(time::OffsetDateTime::now_utc())
        .path("/")
        .finish();
    HttpResponse::NoContent().cookie(auth_cookie).finish()
}

fn build_auth_cookie<'a>(token: &'a str) -> Cookie<'a> {
    CookieBuilder::new("authorization", token)
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Strict)
        .max_age(time::Duration::weeks(24))
        .path("/")
        .finish()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::server::ServicesContainer;
    use crate::services::user::UserServiceTrait;
    use crate::types::UserResponse;
    use actix_web::{body::Body, http, web};
    use async_trait::async_trait;
    use mongodb::error::Error;
    use serde_json::json;
    use std::sync::Mutex;

    struct UserServiceMock {}

    #[async_trait]
    impl UserServiceTrait for UserServiceMock {
        async fn create(&self, _user: RegisterUserRequest) -> Result<String, Error> {
            Ok(String::from("inserted-id"))
        }

        async fn get_by_id(&self, _id: &str) -> Result<FindOneResult<UserResponse>, Error> {
            Ok(FindOneResult::Found(UserResponse {
                id: String::from("id"),
                email: String::from("email"),
                display_name: String::from("Display Name"),
                first_name: String::from("First Name"),
                last_name: String::from("Last Name"),
            }))
        }

        async fn get_by_email(&self, _email: &str) -> Result<FindOneResult<UserResponse>, Error> {
            Ok(FindOneResult::Found(UserResponse {
                id: String::from("id"),
                email: String::from("email"),
                display_name: String::from("Display Name"),
                first_name: String::from("First Name"),
                last_name: String::from("Last Name"),
            }))
        }

        async fn get_hashed_password(&self, _id: &str) -> Result<String, Error> {
            // Hash of 'password'
            Ok(String::from(
                "$2y$10$Ojl6IKvw5yu2Zpbq921cNOpb7couXgkI8Q28iyZSFFeGHphdgIhEG",
            ))
        }
    }

    #[actix_rt::test]
    async fn registers_new_user() {
        let services_container = ServicesContainer {
            user_service: Mutex::new(Box::new(UserServiceMock {})),
        };
        let app_state = AppState { services_container };

        let data = web::Data::new(app_state);
        let user = RegisterUserRequest {
            first_name: String::from("Req"),
            last_name: String::from("Req"),
            display_name: String::from("Req"),
            email: String::from("req_email"),
            password: String::from("password"),
        };

        let json = web::Json(user);

        let response = register_user(data, json).await;

        let auth_cookie = response.cookies().find(|c| c.name() == "authorization");
        let auth_header = response.headers().get("x-auth-token");

        assert_eq!(response.status(), http::StatusCode::CREATED);
        assert_eq!(auth_cookie.is_some(), true);
        assert_eq!(auth_header.is_some(), true);
    }

    #[actix_rt::test]
    async fn logs_user_in() {
        let services_container = ServicesContainer {
            user_service: Mutex::new(Box::new(UserServiceMock {})),
        };
        let app_state = AppState { services_container };

        let data = web::Data::new(app_state);

        let login_req = LoginRequest {
            email: String::from("email"),
            password: String::from("password"),
        };
        let json = web::Json(login_req);

        let response = login_user(data, json).await;

        assert_eq!(response.status(), http::StatusCode::OK);
    }

    #[actix_rt::test]
    async fn gets_current_user() {
        let services_container = ServicesContainer {
            user_service: Mutex::new(Box::new(UserServiceMock {})),
        };
        let app_state = AppState { services_container };

        let data = web::Data::new(app_state);
        let auth_user = AuthorizedUser {
            id: String::from("id"),
        };

        let mut response = get_current_user(data, auth_user).await;
        let json = response.take_body();
        let json = json.as_ref().unwrap();

        assert_eq!(response.status(), http::StatusCode::OK);
        assert_eq!(
            &Body::from(json!({
                "id":"id",
                "firstName": "First Name",
                "lastName": "Last Name",
                "displayName": "Display Name",
                "email": "email"
            })),
            json
        );
    }

    #[actix_rt::test]
    async fn logs_user_out() {
        let response = logout().await;
        let auth_cookie = response
            .cookies()
            .find(|c| c.name() == "authorization")
            .unwrap();
        let expires_at = auth_cookie.expires().unwrap();
        let now = time::OffsetDateTime::now_utc();
        let expired = expires_at < now;

        assert_eq!(response.status(), http::StatusCode::NO_CONTENT);
        assert!(expired, true);
    }
}
