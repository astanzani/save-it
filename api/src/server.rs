use actix_files::NamedFile;
use actix_web::{web, App, HttpServer};
use std::{env, io, path::PathBuf, sync::Mutex};

use crate::controllers;
use crate::loaders;
use crate::services::user::{UserService, UserServiceTrait};

const DEFAULT_PORT: &str = "8080";
const USERS_COLLECTION: &str = "Users";

pub struct ServicesContainer {
    pub user_service: Mutex<Box<dyn UserServiceTrait>>,
}

pub struct AppState {
    pub services_container: ServicesContainer,
}

pub async fn start() -> io::Result<()> {
    let addr = get_server_addr();

    let db = loaders::mongo::load().await;
    let users_collection = db.collection(USERS_COLLECTION);

    HttpServer::new(move || {
        let mut path = std::env::current_dir().unwrap();
        let static_path: PathBuf = ["app", "build", "static"].iter().collect();
        path.push(static_path);
        let services_container = ServicesContainer {
            user_service: Mutex::new(Box::new(UserService::new(users_collection.clone()))),
        };
        App::new()
            .data(AppState { services_container })
            .service(web::scope("api/v1").configure(controllers::user::config))
            .service(actix_files::Files::new("/static", path))
            // Routes are defined client side by React, so send index.html for any route that has no match.
            .route("/{filename:.*}", web::get().to(index))
    })
    .bind(addr)?
    .run()
    .await
}

fn get_server_addr() -> String {
    let port = env::var("PORT").unwrap_or_else(|_err| String::from(DEFAULT_PORT));
    let mut addr = "0.0.0.0:".to_string();
    addr.push_str(&port);

    addr
}

async fn index() -> Result<NamedFile, io::Error> {
    let mut path = std::env::current_dir().unwrap();
    let index_path: PathBuf = ["app", "build", "index.html"].iter().collect();
    path.push(index_path);
    Ok(NamedFile::open(path)?)
}
