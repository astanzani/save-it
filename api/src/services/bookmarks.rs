use async_trait::async_trait;
use futures::StreamExt;
use mongodb::{
    bson::{self, doc, Bson},
    error::Error,
    Collection,
};

use crate::types::{BookmarkDB, BookmarkRequestWithCreatorId, BookmarkResponse};

#[async_trait]
pub trait BookmarksServiceTrait {
    async fn create(&self, bookmark: BookmarkRequestWithCreatorId) -> Result<String, Error>;
    async fn get_all_by_user_id(&self, user_id: &str) -> Result<Vec<BookmarkResponse>, Error>;
}

pub struct BookmarksService {
    collection: Collection,
}

impl BookmarksService {
    pub fn new(collection: Collection) -> BookmarksService {
        BookmarksService { collection }
    }
}

#[async_trait]
impl BookmarksServiceTrait for BookmarksService {
    async fn create(&self, bookmark: BookmarkRequestWithCreatorId) -> Result<String, Error> {
        let bookmark_serialized = bson::to_bson(&bookmark)?;
        let bookmark_doc = bookmark_serialized.as_document().unwrap();

        let result = self
            .collection
            .insert_one(bookmark_doc.to_owned(), None)
            .await?;

        let inserted_id: bson::oid::ObjectId = bson::from_bson(result.inserted_id).unwrap();

        let inserted_id = inserted_id.to_string();

        Ok(String::from(inserted_id))
    }

    async fn get_all_by_user_id(&self, user_id: &str) -> Result<Vec<BookmarkResponse>, Error> {
        let mut cursor = self
            .collection
            .find(doc! { "creatorId": user_id }, None)
            .await?;

        let mut results: Vec<BookmarkResponse> = Vec::new();

        while let Some(doc) = cursor.next().await {
            let bookmark: BookmarkDB = bson::from_bson(Bson::Document(doc.unwrap())).unwrap();
            let bookmark = BookmarkResponse {
                id: bookmark.id.to_string(),
                url: bookmark.url,
                creator_id: bookmark.creator_id,
            };

            results.push(bookmark);
        }

        Ok(results)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::helpers::mocks;
    use crate::types::BookmarkRequestWithCreatorId;
    use serial_test::serial;

    fn get_mock_bookmark() -> BookmarkRequestWithCreatorId {
        BookmarkRequestWithCreatorId {
            url: String::from("bookmark-url"),
            creator_id: String::from("user-id"),
        }
    }

    #[actix_rt::test]
    #[serial]
    async fn creates_new_bookmark() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Bookmarks");

        let service = BookmarksService::new(collection);

        let bookmark = get_mock_bookmark();

        let inserted_id = service.create(bookmark).await;

        assert_eq!(inserted_id.is_ok(), true);

        mocks::drop_test_db(&db).await;
    }

    #[actix_rt::test]
    #[serial]
    async fn gets_all_bookmarks_for_user() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Bookmarks");

        let my_bookmark = get_mock_bookmark();
        let doc = bson::to_bson(&my_bookmark)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();
        collection.insert_one(doc, None).await.unwrap().inserted_id;

        let other_user_bookmark = BookmarkRequestWithCreatorId {
            url: String::from("other-bookmark-url"),
            creator_id: String::from("other-user-id"),
        };
        let other_doc = bson::to_bson(&other_user_bookmark)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();
        collection
            .insert_one(other_doc, None)
            .await
            .unwrap()
            .inserted_id;

        let service = BookmarksService::new(collection);

        let found = service.get_all_by_user_id("user-id").await.unwrap();
        let found_bookmark = found.get(0).unwrap();

        assert_eq!(found.len(), 1);
        assert_eq!(found_bookmark.url, "bookmark-url");
    }
}
