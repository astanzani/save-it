use mongodb::{Client, Database};
use std::env;

pub async fn load() -> Database {
    let mongo_uri = env::var("MONGO_URI").expect("Missing database URI");
    let db_name = env::var("MONGO_DB_NAME").expect("Missing database name");
    let client = Client::with_uri_str(&mongo_uri)
        .await
        .expect("Could not connect to database");

    client.database(&db_name)
}
