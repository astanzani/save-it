use actix_web::{
    cookie::{CookieBuilder, SameSite},
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
}

async fn register_user(
    data: web::Data<AppState>,
    user: web::Json<RegisterUserRequest>,
) -> impl Responder {
    let on_success = |inserted_id: &str| {
        let token = generate_jwt(inserted_id);
        match token {
            Ok(token) => HttpResponse::Created()
                .header("x-auth-token", token)
                .finish(),
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
) -> impl Responder {
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
                        // Allow http when running in debug mode
                        let secure = if cfg!(debug_assertions) { false } else { true };
                        let auth_cookie = CookieBuilder::new("auth", token.clone())
                            .http_only(true)
                            .secure(secure)
                            .same_site(SameSite::Lax)
                            .max_age(time::Duration::week())
                            .finish();
                        // TODO: Remove token header ? (maybe needed for chrome ext)
                        HttpResponse::Ok()
                            .header("x-auth-token", token)
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
            FindOneResult::Found(user) => on_user_found(&user.id.to_string(), &user.password),
            FindOneResult::NotFound => HttpResponse::Unauthorized().finish(),
        },
        _ => HttpResponse::InternalServerError().finish(),
    }
}

async fn get_current_user(data: web::Data<AppState>, auth_user: AuthorizedUser) -> impl Responder {
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
