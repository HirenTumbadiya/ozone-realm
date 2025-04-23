use hyper::{Body, Request, Response, Server};
use hyper::service::{make_service_fn, service_fn};
use std::convert::Infallible;
use std::sync::Arc;
use mongodb::Client;
use crate::handler::auth_handler::register;
use crate::db::mongo::MongoDB
use dotenv::dotenv;
use std::env;

mod handler;
mod db;
mod auth;
mod model;

#[tokio::main]
async fn main() {
    // Load environment variables from .env file
    dotenv().ok();
    
    // Initialize MongoDB client
    let client = Client::with_uri_str(&env::var("MONGO_URI").expect("MONGO_URI must be set")).await.unwrap();
    
    // Create a shared reference to MongoDB client
    let client = Arc::new(client);

    // Define the HTTP service
    let make_svc = make_service_fn(|_conn| {
        let client = Arc::clone(&client);
        async {
            Ok::<_, Infallible>(service_fn(move |req: Request<Body>| {
                // Route the request based on the path
                handle_request(req, client.clone())
            }))
        }
    });

    // Create and run the server
    let addr = ([127, 0, 0, 1], 3000).into();
    let server = Server::bind(&addr).serve(make_svc);
    
    println!("Listening on http://127.0.0.1:3000");
    
    // Start the server and await its completion
    if let Err(e) = server.await {
        eprintln!("Server error: {}", e);
    }
}

async fn handle_request(req: Request<Body>, client: Arc<Client>) -> Result<Response<Body>, Infallible> {
    match req.uri().path() {
        "/register" => {
            if req.method() == hyper::Method::POST {
                return register(req, client).await;
            }
        }
        _ => (),
    }

    Ok(Response::new(Body::from("Not Found")))
}
