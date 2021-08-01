use actix::prelude::*;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

use crate::helpers::password_reset::PasswordResetToken;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisterUserRequest {
    pub first_name: String,
    pub last_name: String,
    pub display_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserResponse {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub display_name: String,
    pub email: String,
}

#[derive(Deserialize, Serialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize, Serialize)]
pub struct ForgotPasswordRequest {
    pub email: String,
}

#[derive(Deserialize, Serialize)]
pub struct ResetPasswordRequest {
    pub email: String,
    pub password: String,
    pub token: String,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UserDB {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub first_name: String,
    pub last_name: String,
    pub display_name: String,
    pub email: String,
    pub password: String,
    pub reset_password_token: Option<PasswordResetToken>,
}

pub enum FindOneResult<T> {
    Found(T),
    NotFound,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookmarkRequest {
    pub url: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportBookmarksRequest {
    pub bookmarks: Vec<BookmarkRequest>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookmarkRequestWithCreatorId {
    pub url: String,
    pub creator_id: String,
    pub metadata: ParsedMetadata,
    pub created_at: i64,
}

#[derive(Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct BookmarkResponse {
    pub id: String,
    pub url: String,
    pub creator_id: String,
    pub metadata: ParsedMetadata,
    pub created_at: i64,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookmarkDB {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub url: String,
    pub creator_id: String,
    pub metadata: ParsedMetadata,
    pub created_at: i64,
}

#[derive(Deserialize, Serialize, Message)]
#[serde(rename_all = "camelCase")]
#[rtype(result = "()")]
pub struct FeedEvent<T> {
    pub kind: String,
    pub user_id: String,
    pub data: T,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct ParsedMetadata {
    pub title: Option<String>,
    pub description: Option<String>,
    pub image: Option<String>,
}
