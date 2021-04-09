use dotenv::dotenv;
use std::io;

mod controllers;
mod helpers;
mod loaders;
mod middlewares;
mod server;
mod services;
mod types;

#[actix_web::main]
async fn main() -> io::Result<()> {
    dotenv().ok();

    server::start().await
}
