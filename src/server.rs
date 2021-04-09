use actix_cors::Cors;
use actix_web::{http::header::HeaderName, web, App, HttpServer, Responder};
use std::{env, io, str::FromStr, sync::Mutex};

use crate::controllers;
use crate::loaders;
use crate::services::user::UserService;
use std::collections::HashSet;

const DEFAULT_PORT: &str = "8080";
const USERS_COLLECTION: &str = "Users";

pub struct ServicesContainer {
    pub user_service: Mutex<UserService>,
}

pub struct AppState {
    pub services_container: ServicesContainer,
}

pub async fn start() -> io::Result<()> {
    let addr = get_server_addr();

    let db = loaders::mongo::load().await;
    let users_collection = db.collection(USERS_COLLECTION);

    HttpServer::new(move || {
        let mut exposed_headers: HashSet<HeaderName> = HashSet::new();
        exposed_headers.insert(HeaderName::from_str("x-auth-token").unwrap());
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allow_any_header()
            .allow_any_method()
            .expose_headers(exposed_headers)
            .supports_credentials();
        let services_container = ServicesContainer {
            user_service: Mutex::new(UserService::new(users_collection.clone())),
        };
        App::new()
            .data(AppState { services_container })
            .route("/", web::get().to(index))
            .service(web::scope("api/v1").configure(controllers::user::config))
            .wrap(cors)
    })
    .bind(addr)?
    .run()
    .await
}

fn get_server_addr() -> String {
    let port = env::var("port").unwrap_or_else(|_err| String::from(DEFAULT_PORT));
    let mut addr = "127.0.0.1:".to_string();
    addr.push_str(&port);

    addr
}

async fn index() -> impl Responder {
    format!("Hello")
}
