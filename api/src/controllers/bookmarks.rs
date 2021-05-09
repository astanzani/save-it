use actix::Addr;
use actix_web::{web, HttpResponse};
use mongodb::error::ErrorKind;

use crate::types::BookmarkRequest;
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
    let bookmark_with_creator_id = BookmarkRequestWithCreatorId {
        url: String::from(&bookmark.url),
        creator_id: String::from(&user.id),
    };

    let bookmarks_service = &data.services_container.bookmarks_service.lock().unwrap();
    let insert_result = bookmarks_service.create(bookmark_with_creator_id).await;

    match insert_result {
        Ok(inserted_id) => {
            let event = FeedEvent {
                kind: String::from("BOOKMARKS/ADD"),
                data: BookmarkResponse {
                    id: String::from(&inserted_id),
                    url: String::from(&bookmark.url),
                    creator_id: String::from(&user.id),
                },
                user_id: String::from(&user.id),
            };
            let _ = srv.do_send(event);
            HttpResponse::Created().finish()
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

//TODO: Tests
