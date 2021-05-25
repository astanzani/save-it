use actix_web::{web, HttpResponse};
use cached::proc_macro::cached;
use reqwest;
use scraper::Html;
use serde::Deserialize;

use crate::helpers::metadata_parser::MetadataParser;
use crate::middlewares::auth::AuthorizedUser;
use crate::types::ParsedMetadata;

#[derive(Deserialize)]
struct QueryUrl {
    url: String,
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/unfurl").route(web::get().to(unfurl_url)));
}

async fn unfurl_url(_user: AuthorizedUser, query: web::Query<QueryUrl>) -> HttpResponse {
    let url = query.url.clone();

    let body = fetch_url(url).await;

    match body {
        None => HttpResponse::NotFound().finish(),
        Some(body) => {
            let link_unfurled = parse_metadata_from_html(body);
            HttpResponse::Ok().json(link_unfurled)
        }
    }
}

#[cached(time = 1800)]
async fn fetch_url(url: String) -> Option<String> {
    let response = reqwest::get(&url).await;

    match response {
        Err(_e) => None,
        Ok(response) => {
            let body = response.text().await;
            match body {
                Err(_e) => None,
                Ok(body) => Some(body),
            }
        }
    }
}

#[cached(time = 1800)]
fn parse_metadata_from_html(html_body: String) -> ParsedMetadata {
    let html = Html::parse_fragment(&html_body);
    let metadata_parser = MetadataParser::new(&html);
    let parsed_metadata = metadata_parser.parse();

    parsed_metadata
}
