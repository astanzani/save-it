use async_trait::async_trait;
use mongodb::{
    bson::{self, doc, Bson},
    error::Error,
    Collection,
};
use thiserror::Error;

use crate::helpers::password_reset::{self, PasswordResetToken};
use crate::types::{FindOneResult, RegisterUserRequest, UserDB, UserResponse};

#[derive(Error, Debug)]
pub enum UsersServiceError {
    #[error("Unknown error")]
    Unknown,
}

#[async_trait]
pub trait UsersServiceTrait {
    async fn create(&self, user: RegisterUserRequest) -> Result<String, Error>;
    async fn get_by_id(&self, id: &str) -> Result<FindOneResult<UserResponse>, UsersServiceError>;
    async fn get_by_email(&self, email: &str) -> Result<FindOneResult<UserResponse>, Error>;
    async fn get_hashed_password(&self, id: &str) -> Result<String, Error>;
    async fn update_reset_password_token(
        &self,
        email: &str,
        token: Option<PasswordResetToken>,
    ) -> Result<(), UsersServiceError>;
    async fn update_password(&self, email: &str, password: &str) -> Result<(), UsersServiceError>;
    async fn is_reset_password_token_valid(
        &self,
        email: &str,
        token: &str,
    ) -> Result<bool, UsersServiceError>;
}

pub struct UsersService {
    collection: Collection,
}

impl UsersService {
    pub fn new(collection: Collection) -> UsersService {
        UsersService { collection }
    }
}

#[async_trait]
impl UsersServiceTrait for UsersService {
    async fn create(&self, user: RegisterUserRequest) -> Result<String, Error> {
        let user_serialized = bson::to_bson(&user)?;
        let user_doc = user_serialized.as_document().unwrap();

        let result = self
            .collection
            .insert_one(user_doc.to_owned(), None)
            .await?;

        let inserted_id: bson::oid::ObjectId = bson::from_bson(result.inserted_id).unwrap();

        let inserted_id = inserted_id.to_string();

        Ok(String::from(inserted_id))
    }

    async fn get_by_id(&self, id: &str) -> Result<FindOneResult<UserResponse>, UsersServiceError> {
        let object_id = bson::oid::ObjectId::with_string(id).unwrap();

        let result = self
            .collection
            .find_one(doc! { "_id": object_id }, None)
            .await
            .map_err(|_| UsersServiceError::Unknown)?;

        match result {
            Some(document) => {
                let user: UserDB = bson::from_bson(Bson::Document(document)).unwrap();
                let user = UserResponse {
                    id: user.id.to_string(),
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    display_name: user.display_name,
                };
                Ok(FindOneResult::Found(user))
            }
            None => Ok(FindOneResult::NotFound),
        }
    }

    async fn get_by_email(&self, email: &str) -> Result<FindOneResult<UserResponse>, Error> {
        let result = self
            .collection
            .find_one(doc! { "email": email }, None)
            .await?;

        match result {
            Some(document) => {
                let user: UserDB = bson::from_bson(Bson::Document(document)).unwrap();
                let user = UserResponse {
                    id: user.id.to_string(),
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    display_name: user.display_name,
                };
                Ok(FindOneResult::Found(user))
            }
            None => Ok(FindOneResult::NotFound),
        }
    }

    async fn get_hashed_password(&self, id: &str) -> Result<String, Error> {
        let object_id = bson::oid::ObjectId::with_string(id).unwrap();

        let result = self
            .collection
            .find_one(doc! { "_id": object_id }, None)
            .await?;

        let user_doc = result.unwrap();
        let user: UserDB = bson::from_bson(Bson::Document(user_doc)).unwrap();
        Ok(user.password)
    }

    async fn update_reset_password_token(
        &self,
        email: &str,
        token: Option<PasswordResetToken>,
    ) -> Result<(), UsersServiceError> {
        match token {
            Some(token) => {
                self.collection
                    .update_one(
                        doc! { "email": email },
                        doc! {"$set": {"resetPasswordToken": bson::to_bson(&token)
                        .map_err(|_| UsersServiceError::Unknown)?}},
                        None,
                    )
                    .await
                    .map_err(|_| UsersServiceError::Unknown)?;

                Ok(())
            }
            None => {
                self.collection
                    .update_one(
                        doc! { "email": email },
                        doc! {"$unset": {"resetPasswordToken": ""}},
                        None,
                    )
                    .await
                    .map_err(|_| UsersServiceError::Unknown)?;

                Ok(())
            }
        }
    }

    async fn update_password(&self, email: &str, password: &str) -> Result<(), UsersServiceError> {
        self.collection
            .update_one(
                doc! { "email": email },
                doc! {"$set": { "password": password }},
                None,
            )
            .await
            .map_err(|_| UsersServiceError::Unknown)?;

        Ok(())
    }

    async fn is_reset_password_token_valid(
        &self,
        email: &str,
        token: &str,
    ) -> Result<bool, UsersServiceError> {
        let user = self
            .collection
            .find_one(doc! { "email": email }, None)
            .await
            .map_err(|_| UsersServiceError::Unknown)?;

        match user {
            None => Ok(false),
            Some(doc) => {
                let user: UserDB = bson::from_bson(Bson::Document(doc)).unwrap();
                let saved_token = user.reset_password_token;

                match saved_token {
                    None => Ok(false),
                    Some(saved_token) => {
                        if token != saved_token.token {
                            return Ok(false);
                        }

                        let now = std::time::SystemTime::now()
                            .duration_since(std::time::UNIX_EPOCH)
                            .unwrap()
                            .as_millis() as i64;

                        match now.cmp(&saved_token.expires) {
                            std::cmp::Ordering::Equal => Ok(true),
                            std::cmp::Ordering::Less => Ok(true),
                            std::cmp::Ordering::Greater => Ok(false),
                        }
                    }
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::helpers::mocks;
    use crate::types::RegisterUserRequest;
    use serial_test::serial;

    fn get_mock_user() -> RegisterUserRequest {
        RegisterUserRequest {
            first_name: String::from("First"),
            last_name: String::from("Last"),
            display_name: String::from("Display Name"),
            email: String::from("email@email.com"),
            password: String::from("password"),
        }
    }

    #[actix_rt::test]
    #[serial]
    async fn creates_new_user() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Users");

        let service = UsersService::new(collection);

        let new_user = get_mock_user();

        let inserted_id = service.create(new_user).await;

        assert_eq!(inserted_id.is_ok(), true);

        mocks::drop_test_db(&db).await;
    }

    #[actix_rt::test]
    #[serial]
    async fn gets_user_by_id() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Users");

        let user = get_mock_user();

        let doc = bson::to_bson(&user)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();

        let inserted = collection.insert_one(doc, None).await.unwrap().inserted_id;
        let id: bson::oid::ObjectId = bson::from_bson(inserted).unwrap();
        let id = id.to_string();

        let service = UsersService::new(collection);

        let found_user = service.get_by_id(&id).await.unwrap();

        if let FindOneResult::Found(u) = found_user {
            assert_eq!(u.id, id);
            mocks::drop_test_db(&db).await;
        } else {
            mocks::drop_test_db(&db).await;
            panic!("Did not find user");
        }
    }

    #[actix_rt::test]
    #[serial]
    async fn gets_user_by_email() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Users");

        let user = get_mock_user();

        let doc = bson::to_bson(&user)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();

        collection.insert_one(doc, None).await.unwrap().inserted_id;

        let service = UsersService::new(collection);

        let found_user = service.get_by_email(&user.email).await.unwrap();

        if let FindOneResult::Found(u) = found_user {
            assert_eq!(u.email, user.email);
            mocks::drop_test_db(&db).await;
        } else {
            mocks::drop_test_db(&db).await;
            panic!("Did not find user");
        }
    }

    #[actix_rt::test]
    #[serial]
    async fn gets_user_hashed_password() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Users");

        let user = get_mock_user();

        let doc = bson::to_bson(&user)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();

        let inserted = collection.insert_one(doc, None).await.unwrap().inserted_id;
        let id: bson::oid::ObjectId = bson::from_bson(inserted).unwrap();
        let id = id.to_string();

        let service = UsersService::new(collection);

        let hashed_password = service.get_hashed_password(&id).await.unwrap();

        assert_eq!(hashed_password, "password");
        mocks::drop_test_db(&db).await;
    }

    #[actix_rt::test]
    #[serial]
    async fn updates_user_password() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Users");

        let user = get_mock_user();

        let doc = bson::to_bson(&user)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();
        let inserted = collection.insert_one(doc, None).await.unwrap().inserted_id;
        let id: bson::oid::ObjectId = bson::from_bson(inserted).unwrap();
        let id = id.to_string();

        let service = UsersService::new(collection);

        service
            .update_password("email@email.com", "new-password")
            .await
            .unwrap();

        let new_pass = service.get_hashed_password(&id).await.unwrap();

        assert_eq!(new_pass, "new-password");
        mocks::drop_test_db(&db).await;
    }

    #[actix_rt::test]
    #[serial]
    async fn updates_reset_password_token() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Users");

        let user = get_mock_user();

        let doc = bson::to_bson(&user)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();
        collection.insert_one(doc, None).await.unwrap();

        let service = UsersService::new(collection);

        service
            .update_reset_password_token(
                "email@email.com",
                Some(PasswordResetToken {
                    token: String::from("abc"),
                    expires: 10000000000000,
                }),
            )
            .await
            .unwrap();

        let res = service
            .is_reset_password_token_valid("email@email.com", "abc")
            .await
            .unwrap();

        assert_eq!(res, true);
        mocks::drop_test_db(&db).await;
    }

    #[actix_rt::test]
    #[serial]
    async fn rejects_invalid_token_value() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Users");

        let user = get_mock_user();

        let doc = bson::to_bson(&user)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();
        collection.insert_one(doc, None).await.unwrap();

        let service = UsersService::new(collection);

        service
            .update_reset_password_token(
                "email@email.com",
                Some(PasswordResetToken {
                    token: String::from("invalid"),
                    expires: 10000000000000,
                }),
            )
            .await
            .unwrap();

        let res = service
            .is_reset_password_token_valid("email@email.com", "abc")
            .await
            .unwrap();

        assert_eq!(res, false);
        mocks::drop_test_db(&db).await;
    }

    #[actix_rt::test]
    #[serial]
    async fn rejects_expired_token_value() {
        let db = mocks::get_test_db().await;
        let collection = db.collection("Users");

        let user = get_mock_user();

        let doc = bson::to_bson(&user)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();
        collection.insert_one(doc, None).await.unwrap();

        let service = UsersService::new(collection);

        service
            .update_reset_password_token(
                "email@email.com",
                Some(PasswordResetToken {
                    token: String::from("abc"),
                    expires: 100000000,
                }),
            )
            .await
            .unwrap();

        let res = service
            .is_reset_password_token_valid("email@email.com", "abc")
            .await
            .unwrap();

        assert_eq!(res, false);
        mocks::drop_test_db(&db).await;
    }
}
