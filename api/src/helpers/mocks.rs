use std::sync::Mutex;

use async_trait::async_trait;
use mongodb::error::Error;

use crate::{
    server::ServicesContainer,
    services::{bookmarks::BookmarksServiceTrait, users::UsersServiceTrait},
    types::{
        BookmarkRequestWithCreatorId, BookmarkResponse, FindOneResult, RegisterUserRequest,
        UserResponse,
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

    async fn get_all_by_user_id(&self, _user_id: &str) -> Result<Vec<BookmarkResponse>, Error> {
        let results: Vec<BookmarkResponse> = Vec::new();

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
