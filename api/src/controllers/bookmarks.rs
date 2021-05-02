use actix_web::{web, HttpResponse};
use mongodb::error::ErrorKind;

use crate::server::AppState;
use crate::types::BookmarkRequest;
use crate::{middlewares::auth::AuthorizedUser, types::BookmarkRequestWithCreatorId};

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
) -> HttpResponse {
    let bookmark = bookmark.into_inner();
    let bookmark_with_creator_id = BookmarkRequestWithCreatorId {
        url: bookmark.url,
        creator_id: user.id,
    };

    let bookmarks_service = &data.services_container.bookmarks_service.lock().unwrap();
    let insert_result = bookmarks_service.create(bookmark_with_creator_id).await;

    match insert_result {
        Ok(_inserted_id) => HttpResponse::Created().finish(),
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
