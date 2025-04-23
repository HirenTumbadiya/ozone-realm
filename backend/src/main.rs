mod server;
mod db;

use dotenvy::dotenv;
use std::env;
use server::run;

#[tokio::main]
async fn main() {

    dotenv().ok();

    let db_url = env::var("MONGO_URI").unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
    

    let addr = "127.0.0.1:7878";

    run(addr, &db_url).await;
}
