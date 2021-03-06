use actix_web::{
    cookie::{Cookie, CookieBuilder, SameSite},
    web, HttpRequest, HttpResponse,
};
use bcrypt;

use crate::helpers::{jwt::generate_jwt, password_reset::generate_password_reset_token};
use crate::middlewares::auth::AuthorizedUser;
use crate::server::AppState;
use crate::types::{FindOneResult, LoginRequest, RegisterUserRequest, ResetPasswordRequest};
use crate::{errors::user::UserApiError, types::ForgotPasswordRequest};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/users/register").route(web::post().to(register_user)));
    cfg.service(web::resource("/users/login").route(web::post().to(login_user)));
    cfg.service(web::resource("/users/current").route(web::get().to(get_current_user)));
    cfg.service(web::resource("/users/logout").route(web::post().to(logout)));
    cfg.service(web::resource("/users/forgotpassword").route(web::post().to(forgot_password)));
    cfg.service(web::resource("/users/resetpassword").route(web::post().to(reset_password)));
}

async fn register_user(
    data: web::Data<AppState>,
    user: web::Json<RegisterUserRequest>,
) -> Result<HttpResponse, UserApiError> {
    let mut user_info = user.into_inner();

    if user_info.email.is_empty()
        || user_info.email.is_empty()
        || user_info.password.is_empty()
        || user_info.first_name.is_empty()
        || user_info.last_name.is_empty()
    {
        return Err(UserApiError::BadRegisterRequest);
    }

    let hashed_pass = bcrypt::hash(user_info.password, 10).map_err(|_| UserApiError::Unknown)?;
    user_info.password = hashed_pass;

    let user_service = &data.services_container.user_service.lock().unwrap();
    let inserted_id = user_service
        .create(user_info)
        .await
        .map_err(|_| UserApiError::Unknown)?;

    let token = generate_jwt(&inserted_id).map_err(|_| UserApiError::Unknown)?;
    let auth_cookie = build_auth_cookie(&token);
    Ok(HttpResponse::Created()
        .header("x-auth-token", token.clone())
        .cookie(auth_cookie)
        .finish())
}

async fn login_user(
    data: web::Data<AppState>,
    login_info: web::Json<LoginRequest>,
) -> Result<HttpResponse, UserApiError> {
    let user_service = &data.services_container.user_service.lock().unwrap();
    let login_info = login_info.into_inner();
    let email = login_info.email;
    let password = login_info.password;

    if email.is_empty() || password.is_empty() {
        return Err(UserApiError::BadLoginRequest);
    }

    let on_user_found = |id, hashed_password| {
        let authenticated =
            bcrypt::verify(password, hashed_password).map_err(|_| UserApiError::Unknown)?;

        match authenticated {
            true => {
                let token = generate_jwt(id).map_err(|_| UserApiError::Unknown)?;

                let auth_cookie = build_auth_cookie(&token);
                Ok(HttpResponse::NoContent()
                    .header("x-auth-token", token.clone())
                    .cookie(auth_cookie)
                    .finish())
            }
            false => Err(UserApiError::WrongLoginInfo),
        }
    };

    let result = user_service
        .get_by_email(&email)
        .await
        .map_err(|_| UserApiError::Unknown)?;

    match result {
        FindOneResult::Found(user) => {
            let hashed_password = user_service
                .get_hashed_password(&user.id.to_string())
                .await
                .unwrap();
            on_user_found(&user.id.to_string(), &hashed_password)
        }
        FindOneResult::NotFound => Err(UserApiError::WrongLoginInfo),
    }
}

async fn get_current_user(
    data: web::Data<AppState>,
    auth_user: AuthorizedUser,
) -> Result<HttpResponse, UserApiError> {
    let user_service = &data.services_container.user_service.lock().unwrap();
    let result = user_service.get_by_id(&auth_user.id).await;

    match result {
        Ok(result) => match result {
            FindOneResult::Found(user) => Ok(HttpResponse::Ok().json(user)),
            FindOneResult::NotFound => Err(UserApiError::SessionExpired),
        },
        _ => Err(UserApiError::Unknown),
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

async fn forgot_password(
    req: HttpRequest,
    data: web::Data<AppState>,
    forgot_password_info: web::Json<ForgotPasswordRequest>,
) -> Result<HttpResponse, UserApiError> {
    let user_service = &data.services_container.user_service.lock().unwrap();
    let email_service = &data.services_container.email_service.lock().unwrap();

    let user_result = user_service
        .get_by_email(&forgot_password_info.email)
        .await
        .map_err(|_| UserApiError::Unknown)?;

    match user_result {
        FindOneResult::NotFound => Err(UserApiError::BadForgotPasswordRequest),
        FindOneResult::Found(_user) => {
            let token = generate_password_reset_token().map_err(|_| UserApiError::Unknown)?;
            user_service
                .update_reset_password_token(&forgot_password_info.email, Some(token.clone()))
                .await
                .map_err(|_| UserApiError::Unknown)?;

            let conn_info = req.connection_info();
            let host = conn_info.host();

            email_service
                .send_forgot_password_email(&forgot_password_info.email, token.clone(), host)
                .map_err(|err| match err {
                    _ => UserApiError::Unknown,
                })?;

            Ok(HttpResponse::Ok().finish())
        }
    }
}

async fn reset_password(
    data: web::Data<AppState>,
    reset_password_info: web::Json<ResetPasswordRequest>,
) -> Result<HttpResponse, UserApiError> {
    if reset_password_info.token.is_empty() {
        return Err(UserApiError::ExpiredResetPasswordToken);
    }

    if reset_password_info.email.is_empty() || reset_password_info.password.is_empty() {
        return Err(UserApiError::BadResetPasswordRequest);
    }

    let user_service = &data.services_container.user_service.lock().unwrap();

    let is_token_valid = user_service
        .is_reset_password_token_valid(&reset_password_info.email, &reset_password_info.token)
        .await
        .map_err(|_| UserApiError::Unknown)?;

    match is_token_valid {
        false => Err(UserApiError::ExpiredResetPasswordToken),
        true => {
            let hashed_pass = bcrypt::hash(&reset_password_info.password, 10)
                .map_err(|_| UserApiError::Unknown)?;
            user_service
                .update_password(&reset_password_info.email, &hashed_pass)
                .await
                .map_err(|_| UserApiError::Unknown)?;
            user_service
                .update_reset_password_token(&reset_password_info.email, None)
                .await
                .map_err(|_| UserApiError::Unknown)?;

            Ok(HttpResponse::Ok().finish())
        }
    }
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
    use crate::helpers::mocks;
    use actix_web::{body::Body, http, web};
    use serde_json::json;

    #[actix_rt::test]
    async fn registers_new_user() {
        let services_container = mocks::get_services_mock();
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

        let response = register_user(data, json).await.unwrap();

        let auth_cookie = response.cookies().find(|c| c.name() == "authorization");
        let auth_header = response.headers().get("x-auth-token");

        assert_eq!(response.status(), http::StatusCode::CREATED);
        assert_eq!(auth_cookie.is_some(), true);
        assert_eq!(auth_header.is_some(), true);
    }

    #[actix_rt::test]
    async fn logs_user_in() {
        let services_container = mocks::get_services_mock();

        let app_state = AppState { services_container };

        let data = web::Data::new(app_state);

        let login_req = LoginRequest {
            email: String::from("email"),
            password: String::from("password"),
        };
        let json = web::Json(login_req);

        let response = login_user(data, json).await;

        assert_eq!(response.unwrap().status(), http::StatusCode::NO_CONTENT);
    }

    #[actix_rt::test]
    async fn gets_current_user() {
        let services_container = mocks::get_services_mock();

        let app_state = AppState { services_container };

        let data = web::Data::new(app_state);
        let auth_user = AuthorizedUser {
            id: String::from("id"),
        };

        let mut response = get_current_user(data, auth_user).await.unwrap();
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
