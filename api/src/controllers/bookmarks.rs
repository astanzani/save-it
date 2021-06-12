use actix::Addr;
use actix_web::{web, HttpResponse};
use cached::proc_macro::cached;
use mongodb::error::ErrorKind;
use scraper::Html;

use crate::helpers::metadata_parser::MetadataParser;
use crate::types::{BookmarkRequest, ParsedMetadata};
use crate::{middlewares::auth::AuthorizedUser, types::BookmarkRequestWithCreatorId};
use crate::{
    server::AppState,
    types::{BookmarkResponse, FeedEvent},
};

use super::feed::WsServer;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/bookmarks")
            .route(web::get().to(get_bookmarks))
            .route(web::post().to(add_bookmark)),
    );
}

async fn add_bookmark(
    data: web::Data<AppState>,
    bookmark: web::Json<BookmarkRequest>,
    user: AuthorizedUser,
    srv: web::Data<Addr<WsServer>>,
) -> HttpResponse {
    let bookmark = bookmark.into_inner();
    let metadata = unfurl_url(bookmark.url.clone()).await;
    let bookmark_with_creator_id = BookmarkRequestWithCreatorId {
        url: ensure_url(&bookmark.url),
        creator_id: String::from(&user.id),
        metadata: metadata.clone(),
    };

    let bookmarks_service = &data.services_container.bookmarks_service.lock().unwrap();

    let insert_result = bookmarks_service.create(bookmark_with_creator_id).await;

    match insert_result {
        Ok(inserted_id) => {
            let inserted_bookmark = BookmarkResponse {
                id: String::from(&inserted_id),
                url: String::from(&bookmark.url),
                creator_id: String::from(&user.id),
                metadata: metadata.clone(),
            };
            let event = FeedEvent {
                kind: String::from("BOOKMARKS/ADD"),
                data: inserted_bookmark.clone(),
                user_id: String::from(&user.id),
            };
            let _ = srv.do_send(event);
            HttpResponse::Created().json(inserted_bookmark.clone())
        }
        Err(err) => match err.kind.as_ref() {
            ErrorKind::WriteError(_) => HttpResponse::BadRequest().finish(),
            _ => HttpResponse::InternalServerError().finish(),
        },
    }
}

async fn get_bookmarks(data: web::Data<AppState>, user: AuthorizedUser) -> HttpResponse {
    let bookmarks_service = &data.services_container.bookmarks_service.lock().unwrap();

    let bookmarks = bookmarks_service
        .get_all_by_user_id(&user.id)
        .await
        .unwrap();

    HttpResponse::Ok().json(bookmarks)
}

fn ensure_url(url: &str) -> String {
    if url.starts_with("http") {
        return String::from(url);
    }

    let mut s = String::from("https://");
    s.push_str(url);

    return s;
}

#[cached(time = 1800)]
async fn unfurl_url(url: String) -> ParsedMetadata {
    let body = fetch_url(url).await;

    match body {
        None => ParsedMetadata {
            title: None,
            description: None,
            image: None,
        },
        Some(body) => parse_metadata_from_html(body),
    }
}

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

fn parse_metadata_from_html(html_body: String) -> ParsedMetadata {
    let html = Html::parse_fragment(&html_body);
    let metadata_parser = MetadataParser::new(&html);
    let parsed_metadata = metadata_parser.parse();

    parsed_metadata
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{controllers, helpers::mocks};
    use actix::Actor;
    use actix_web::{body::Body, http, web};
    use serde_json::json;

    #[actix_rt::test]
    async fn adds_new_bookmark() {
        let services_container = mocks::get_services_mock();
        let app_state = AppState { services_container };

        let data = web::Data::new(app_state);
        let bookmark = BookmarkRequest {
            url: String::from("https://url.com"),
        };
        let auth_user = AuthorizedUser {
            id: String::from("id"),
        };
        let json = web::Json(bookmark);
        let ws_server = controllers::feed::WsServer::new().start();

        let response = add_bookmark(data, json, auth_user, web::Data::new(ws_server)).await;
        assert_eq!(response.status(), http::StatusCode::CREATED);
    }

    #[actix_rt::test]
    async fn gets_all_bookmarks() {
        let services_container = mocks::get_services_mock();
        let app_state = AppState { services_container };

        let data = web::Data::new(app_state);
        let auth_user = AuthorizedUser {
            id: String::from("id"),
        };

        let mut response = get_bookmarks(data, auth_user).await;
        let json = response.take_body();
        let json = json.as_ref().unwrap();

        assert_eq!(response.status(), http::StatusCode::OK);
        assert_eq!(
            &Body::from(json!([{
                "id":"bookmark-id",
                "url": "https://url.com",
                "creatorId": "user-id",
                "metadata": json!({
                    "title": null,
                    "description": null,
                    "image": null,
                })
            }])),
            json
        );
    }
}
