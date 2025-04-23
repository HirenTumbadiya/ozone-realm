use mongodb::{Client, Database, Collection};
use mongodb::bson::{doc, Bson};
use crate::model::user::User;
use crate::auth::hash::hash_password;
use crate::auth::jwt;

pub async fn create_user(client: &Client, email: &str, username: &str, password: &str) -> Result<User, Box<dyn std::error::Error>> {
    let db: Database = client.database("tictactoe_db");  // Name your database
    let collection: Collection<User> = db.collection("users"); // "users" collection

    // Hash the password
    let password_hash = hash_password(password)?;

    // Create user object
    let new_user = User {
        id: None,  // MongoDB will automatically generate an _id
        username: username.to_owned(),
        email: email.to_owned(),
        password_hash,
    };

    // Insert the new user into the collection
    collection.insert_one(&new_user, None).await?;

    Ok(new_user)  // Return the created user (excluding password)
}

pub async fn find_user_by_email(client: &Client, email: &str) -> Result<Option<User>, Box<dyn std::error::Error>> {
    let db: Database = client.database("tictactoe_db");
    let collection: Collection<User> = db.collection("users");

    // Query MongoDB for user by email
    let user = collection.find_one(doc! { "email": email }, None).await?;

    Ok(user)
}
