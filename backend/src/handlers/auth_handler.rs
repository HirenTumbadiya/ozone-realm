use hyper::{Body, Request, Response};
use serde::{Deserialize, Serialize};
use crate::db::user::{create_user, find_user_by_email};
use crate::auth::hash::hash_password;
use crate::auth::jwt::create_token;
use mongodb::Client;
use hyper::StatusCode;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct RegisterResponse {
    pub message: String,
    pub token: Option<String>,
}

pub async fn register(req: Request<Body>, client: Arc<Client>) -> Result<Response<Body>, hyper::Error> {
    // Parse the request body
    let body_bytes = hyper::body::to_bytes(req.into_body()).await?;
    let register_info: RegisterRequest = match serde_json::from_slice(&body_bytes) {
        Ok(data) => data,
        Err(_) => {
            let response = RegisterResponse {
                message: "Invalid request body".to_string(),
                token: None,
            };
            return Ok(Response::new(Body::from(serde_json::to_string(&response).unwrap())));
        }
    };

    // Extract user data
    let username = &register_info.username;
    let email = &register_info.email;
    let password = &register_info.password;

    // Check if user already exists
    match find_user_by_email(&client, &email).await {
        Ok(Some(_)) => {
            let response = RegisterResponse {
                message: "User with this email already exists.".to_string(),
                token: None,
            };
            return Ok(Response::new(Body::from(serde_json::to_string(&response).unwrap())));
        }
        Ok(None) => {},
        Err(_) => {
            let response = RegisterResponse {
                message: "Database error.".to_string(),
                token: None,
            };
            return Ok(Response::new(Body::from(serde_json::to_string(&response).unwrap())));
        }
    }

    // Hash the password
    let password_hash = match hash_password(password) {
        Ok(hash) => hash,
        Err(_) => {
            let response = RegisterResponse {
                message: "Error hashing password.".to_string(),
                token: None,
            };
            return Ok(Response::new(Body::from(serde_json::to_string(&response).unwrap())));
        }
    };

    // Insert user into database
    match create_user(&client, &email, &username, &password_hash).await {
        Ok(user) => {
            // Generate JWT
            let token = match create_token(&user.id.unwrap().to_string()) {
                Ok(token) => token,
                Err(_) => {
                    let response = RegisterResponse {
                        message: "Error creating token.".to_string(),
                        token: None,
                    };
                    return Ok(Response::new(Body::from(serde_json::to_string(&response).unwrap())));
                }
            };

            let response = RegisterResponse {
                message: "User registered successfully.".to_string(),
                token: Some(token),
            };
            Ok(Response::new(Body::from(serde_json::to_string(&response).unwrap())))
        }
        Err(_) => {
            let response = RegisterResponse {
                message: "Error saving user to database.".to_string(),
                token: None,
            };
            Ok(Response::new(Body::from(serde_json::to_string(&response).unwrap())))
        }
    }
}
