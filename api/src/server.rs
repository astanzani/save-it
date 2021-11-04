use actix::Actor;
use actix_files::NamedFile;
use actix_web::{web, App, HttpRequest, HttpServer};
use std::{env, io, path::PathBuf, sync::Mutex};

use crate::controllers;
use crate::loaders;
use crate::services::email::EmailService;
use crate::services::{
    bookmarks::{BookmarksService, BookmarksServiceTrait},
    users::{UsersService, UsersServiceTrait},
};

const DEFAULT_PORT: &str = "8080";
const USERS_COLLECTION: &str = "Users";
const BOOKMARKS_COLLECTION: &str = "Bookmarks";

pub struct ServicesContainer {
    pub user_service: Mutex<Box<dyn UsersServiceTrait>>,
    pub bookmarks_service: Mutex<Box<dyn BookmarksServiceTrait>>,
    pub email_service: Mutex<EmailService>,
}

pub struct AppState {
    pub services_container: ServicesContainer,
}

pub async fn start() -> io::Result<()> {
    let addr = get_server_addr();

    let db = loaders::mongo::load().await;
    let users_collection = db.collection(USERS_COLLECTION);
    let bookmarks_collection = db.collection(BOOKMARKS_COLLECTION);

    let ws_server = controllers::feed::WsServer::new().start();

    HttpServer::new(move || {
        let mut path = std::env::current_dir().unwrap();
        let static_path: PathBuf = ["app", "build", "static"].iter().collect();
        path.push(static_path);
        // Server is multithreaded so this will be create many times, maybe init outside HttpServer::new ?
        let services_container = ServicesContainer {
            user_service: Mutex::new(Box::new(UsersService::new(users_collection.clone()))),
            bookmarks_service: Mutex::new(Box::new(BookmarksService::new(
                bookmarks_collection.clone(),
            ))),
            email_service: Mutex::new(EmailService {}),
        };

        App::new()
            .data(AppState { services_container })
            .data(ws_server.clone())
            .service(
                web::scope("api/v1")
                    .configure(controllers::user::config)
                    .configure(controllers::bookmarks::config)
                    .configure(controllers::feed::config)
                    .configure(controllers::unfurl::config)
                    .configure(controllers::healthcheck::config),
            )
            .service(actix_files::Files::new("/static", path))
            // Routes are defined client side by React, so send index.html for any route that has no match.
            .route("/{filename:.*}", web::get().to(index))
    })
    // .workers(1)
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

async fn index(req: HttpRequest) -> Result<NamedFile, io::Error> {
    let file_path: PathBuf = req.match_info().query("filename").parse().unwrap();

    // This kinda sucks, but it is what it is
    if file_path.starts_with("favicon.ico") == true {
        let mut path = std::env::current_dir().unwrap();
        let favicon_path: PathBuf = ["app", "build", "favicon.ico"].iter().collect();
        path.push(favicon_path);
        return Ok(NamedFile::open(path)?);
    }

    if file_path.starts_with("manifest.json") == true {
        let mut path = std::env::current_dir().unwrap();
        let manifest_path: PathBuf = ["app", "build", "manifest.json"].iter().collect();
        path.push(manifest_path);
        return Ok(NamedFile::open(path)?);
    }

    let mut path = std::env::current_dir().unwrap();
    let index_path: PathBuf = ["app", "build", "index.html"].iter().collect();
    path.push(index_path);
    Ok(NamedFile::open(path)?)
}
