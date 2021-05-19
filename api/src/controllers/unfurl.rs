use actix_web::{web, HttpRequest, HttpResponse};
use reqwest;
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::middlewares::auth::AuthorizedUser;

#[derive(Deserialize)]
struct QueryUrl {
    url: String,
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/unfurl").route(web::get().to(unfurl_url)));
}

async fn unfurl_url(_user: AuthorizedUser, query: web::Query<QueryUrl>) -> HttpResponse {
    let url = query.url.clone();

    println!("URL: {}", url);

    let body = fetch_url(&url).await;

    match body {
        None => HttpResponse::NotFound().finish(),
        Some(body) => {
            let link_unfurled = parse_metadata_from_html(&body);
            HttpResponse::Ok().json(link_unfurled)
        }
    }
}

async fn fetch_url(url: &str) -> Option<String> {
    let response = reqwest::get(url).await;

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

#[derive(Deserialize, Serialize)]
struct LinkUnfurled {
    title: Option<String>,
    description: Option<String>,
    image: Option<String>,
}

fn parse_metadata_from_html(html_body: &str) -> LinkUnfurled {
    let html = Html::parse_fragment(&html_body);

    let title = parse_title(&html);
    let description = parse_description(&html);
    let image = parse_image(&html);

    LinkUnfurled {
        title,
        description,
        image,
    }
}

fn parse_title(html: &Html) -> Option<String> {
    let title_selector = Selector::parse(r#"meta[name="title"]"#).unwrap();
    let title_el = html.select(&title_selector).next();

    match title_el {
        None => None,
        Some(title_el) => {
            let title = title_el.value().attr("content");
            match title {
                None => None,
                Some(title) => Some(String::from(title)),
            }
        }
    }
}

fn parse_description(html: &Html) -> Option<String> {
    let description_selector = Selector::parse(r#"meta[name="description"]"#).unwrap();
    let description_el = html.select(&description_selector).next();

    match description_el {
        None => None,
        Some(description_el) => {
            let description = description_el.value().attr("content");
            match description {
                None => None,
                Some(description) => Some(String::from(description)),
            }
        }
    }
}

fn parse_image(html: &Html) -> Option<String> {
    let image_selector = Selector::parse(r#"meta[itemprop="image"]"#).unwrap();
    let image_el = html.select(&image_selector).next();

    match image_el {
        None => None,
        Some(image_el) => {
            let image = image_el.value().attr("content");
            match image {
                None => None,
                Some(image) => Some(String::from(image)),
            }
        }
    }
}
