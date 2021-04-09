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
