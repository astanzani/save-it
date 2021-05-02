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

// TODO: Tests