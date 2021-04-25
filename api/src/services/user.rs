use mongodb::{
    bson::{self, doc, Bson},
    error::Error,
    Collection,
};

use crate::types::{FindOneResult, RegisterUserRequest, UserDB, UserResponse};

pub struct UserService {
    collection: Collection,
}

impl UserService {
    pub fn new(collection: Collection) -> UserService {
        UserService { collection }
    }

    pub async fn create(&self, user: RegisterUserRequest) -> Result<String, Error> {
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

    pub async fn get_by_id(&self, id: &str) -> Result<FindOneResult<UserResponse>, Error> {
        let object_id = bson::oid::ObjectId::with_string(id).unwrap();

        let result = self
            .collection
            .find_one(doc! { "_id": object_id }, None)
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

    pub async fn get_by_email(&self, email: &str) -> Result<FindOneResult<UserDB>, Error> {
        let result = self
            .collection
            .find_one(doc! { "email": email }, None)
            .await?;

        match result {
            Some(document) => {
                let user: UserDB = bson::from_bson(Bson::Document(document)).unwrap();
                Ok(FindOneResult::Found(user))
            }
            None => Ok(FindOneResult::NotFound),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::RegisterUserRequest;
    use mongodb::Database;
    use serial_test::serial;
    use std::env;

    async fn setup() -> Database {
        let db_uri = env::var("MONGO_TEST_URI").expect("Missing MONGO_TEST_URI env var");
        let client = mongodb::Client::with_uri_str(&db_uri).await.unwrap();
        let db = client.database("save-it-test-db");
        db
    }

    async fn cleanup(db: &Database) {
        db.drop(None).await.unwrap();
    }

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
        let db = setup().await;
        let collection = db.collection("Users");

        let service = UserService::new(collection);

        let new_user = get_mock_user();

        let inserted_id = service.create(new_user).await;

        assert_eq!(inserted_id.is_ok(), true);

        cleanup(&db).await;
    }

    #[actix_rt::test]
    #[serial]
    async fn gets_user_by_id() {
        let db = setup().await;
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

        let service = UserService::new(collection);

        let found_user = service.get_by_id(&id).await.unwrap();

        if let FindOneResult::Found(u) = found_user {
            assert_eq!(u.id, id);
        } else {
            panic!("Did not find user");
        }
    }

    #[actix_rt::test]
    #[serial]
    async fn gets_user_by_email() {
        let db = setup().await;
        let collection = db.collection("Users");

        let user = get_mock_user();

        let doc = bson::to_bson(&user)
            .unwrap()
            .as_document()
            .unwrap()
            .to_owned();

        collection.insert_one(doc, None).await.unwrap().inserted_id;

        let service = UserService::new(collection);

        let found_user = service.get_by_email(&user.email).await.unwrap();

        if let FindOneResult::Found(u) = found_user {
            assert_eq!(u.email, user.email);
        } else {
            panic!("Did not find user");
        }
    }
}
