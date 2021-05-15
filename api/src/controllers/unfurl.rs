use actix_web::{client::Client, web, HttpRequest, HttpResponse};
use scraper::{Html, Selector};
use serde::Deserialize;

use crate::middlewares::auth::AuthorizedUser;

#[derive(Deserialize)]
struct QueryUrl {
    url: String,
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/unfurl").route(web::get().to(unfurl_url)));
}

async fn unfurl_url(
    req: HttpRequest,
    _user: AuthorizedUser,
    query: web::Query<QueryUrl>,
) -> HttpResponse {
    let url = query.url.clone();
    let client = Client::default();

    println!("XABLAU: {}", url);

    let response = client
        .get(url)
        .set_header("Accept", "text/html")
        .send()
        .await;

    match response {
        Ok(mut r) => {
            let body = r.body().await.unwrap().to_ascii_lowercase();
            let html = String::from_utf8(body).unwrap();
            HttpResponse::Ok().body(html)
        }
        Err(e) => {
            println!("ERR: {}", e);
            HttpResponse::NotFound().finish()
        }
    }
}
