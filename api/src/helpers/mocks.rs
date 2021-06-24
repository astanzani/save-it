use std::{env, sync::Mutex};

use async_trait::async_trait;
use mongodb::{self, error::Error, Database};

use crate::{
    server::ServicesContainer,
    services::{bookmarks::BookmarksServiceTrait, users::UsersServiceTrait},
    types::{
        BookmarkRequestWithCreatorId, BookmarkResponse, FindOneResult, ParsedMetadata,
        RegisterUserRequest, UserResponse,
    },
};

struct UserServiceMock {}

#[async_trait]
impl UsersServiceTrait for UserServiceMock {
    async fn create(&self, _user: RegisterUserRequest) -> Result<String, Error> {
        Ok(String::from("inserted-id"))
    }

    async fn get_by_id(&self, _id: &str) -> Result<FindOneResult<UserResponse>, Error> {
        Ok(FindOneResult::Found(UserResponse {
            id: String::from("id"),
            email: String::from("email"),
            display_name: String::from("Display Name"),
            first_name: String::from("First Name"),
            last_name: String::from("Last Name"),
        }))
    }

    async fn get_by_email(&self, _email: &str) -> Result<FindOneResult<UserResponse>, Error> {
        Ok(FindOneResult::Found(UserResponse {
            id: String::from("id"),
            email: String::from("email"),
            display_name: String::from("Display Name"),
            first_name: String::from("First Name"),
            last_name: String::from("Last Name"),
        }))
    }

    async fn get_hashed_password(&self, _id: &str) -> Result<String, Error> {
        // Hash of 'password'
        Ok(String::from(
            "$2y$10$Ojl6IKvw5yu2Zpbq921cNOpb7couXgkI8Q28iyZSFFeGHphdgIhEG",
        ))
    }
}

struct BookmarksServiceMock {}

#[async_trait]
impl BookmarksServiceTrait for BookmarksServiceMock {
    async fn create(&self, _bookmark: BookmarkRequestWithCreatorId) -> Result<String, Error> {
        Ok(String::from("inserted-id"))
    }

    async fn create_many(
        &self,
        _bookmarks: Vec<BookmarkRequestWithCreatorId>,
    ) -> Result<Vec<String>, Error> {
        Ok(vec![String::from("id")])
    }

    async fn get_all_by_user_id(&self, _user_id: &str) -> Result<Vec<BookmarkResponse>, Error> {
        let mut results: Vec<BookmarkResponse> = Vec::new();
        results.push(BookmarkResponse {
            id: String::from("bookmark-id"),
            url: String::from("https://url.com"),
            creator_id: String::from("user-id"),
            metadata: ParsedMetadata {
                title: None,
                description: None,
                image: None,
            },
        });

        Ok(results)
    }
}

// Used by tests
#[allow(dead_code)]
pub fn get_services_mock() -> ServicesContainer {
    ServicesContainer {
        user_service: Mutex::new(Box::new(UserServiceMock {})),
        bookmarks_service: Mutex::new(Box::new(BookmarksServiceMock {})),
    }
}

// Used by tests
#[allow(dead_code)]
pub async fn get_test_db() -> Database {
    let db_uri = env::var("MONGO_TEST_URI").expect("Missing MONGO_TEST_URI env var");
    let client = mongodb::Client::with_uri_str(&db_uri).await.unwrap();
    let db = client.database("save-it-test-db");
    db
}

// Used by tests
#[allow(dead_code)]
pub async fn drop_test_db(db: &Database) {
    db.drop(None).await.unwrap();
}
