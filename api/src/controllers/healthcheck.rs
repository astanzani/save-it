use actix_web::{web, HttpResponse};
use serde_json::json;
use std::env;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/healthcheck").route(web::get().to(healthcheck)));
}

async fn healthcheck() -> HttpResponse {
    let app_name = env::var("CARGO_PKG_NAME").unwrap();
    let app_version = env::var("CARGO_PKG_VERSION").unwrap();

    HttpResponse::Ok().json(json!({
      "app": app_name,
      "version": app_version
    }))
}
