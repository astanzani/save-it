use actix::prelude::*;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

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
#[serde(rename_all = "camelCase")]
pub struct UserDB {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub first_name: String,
    pub last_name: String,
    pub display_name: String,
    pub email: String,
    pub password: String,
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
pub struct BookmarkRequestWithCreatorId {
    pub url: String,
    pub creator_id: String,
    pub metadata: ParsedMetadata,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookmarkResponse {
    pub id: String,
    pub url: String,
    pub creator_id: String,
    pub metadata: ParsedMetadata,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookmarkDB {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub url: String,
    pub creator_id: String,
    pub metadata: ParsedMetadata,
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
