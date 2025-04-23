use mongodb::bson;

use crate::db::mongo::MongoDB;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;

pub async fn run(addr: &str, db_url: &str) {
    // Connect to MongoDB using the URL from the .env file
    let mongo_db = match MongoDB::new(db_url, "tictactoe_db").await {
        Ok(db) => std::sync::Arc::new(db),
        Err(e) => {
            eprintln!("Error connecting to MongoDB: {}", e);
            return;
        }
    };

    println!("[INFO] Server running on http://{}", addr);
    println!("[INFO] Connected to MongoDB");

    let listener = TcpListener::bind(addr).expect("Failed to bind address");

    for stream in listener.incoming() { // Note: TcpListener::incoming is blocking; consider using async alternatives.
        match stream {
            Ok(stream) => {
                let mongo_db = std::sync::Arc::clone(&mongo_db);
                thread::spawn(move || {
                    handle_connection(stream, &mongo_db);
                });
            }
            Err(e) => eprintln!("[ERROR] Connection failed: {}", e),
        }
    }
}
// Removed duplicate function definition
fn handle_connection(mut stream: TcpStream, mongo_db: &MongoDB) {
    let mut buffer = [0; 1024];
    if let Ok(_) = stream.read(&mut buffer) {
        let request_text = String::from_utf8_lossy(&buffer[..]);

        println!("[REQUEST]\n{}", request_text);

        // Handle routes and MongoDB interactions here
        let request_line = request_text.lines().next().unwrap_or("");
        let parts: Vec<&str> = request_line.split_whitespace().collect();

        if parts.len() < 2 {
            let response = "HTTP/1.1 400 Bad Request\r\nContent-Length: 0\r\n\r\n";
            stream.write_all(response.as_bytes()).unwrap();
            return;
        }

        let method = parts[0];
        let path = parts[1];

        let response = match (method, path) {
            ("GET", "/") => {
                // Fetch data from MongoDB
                let game_state = fetch_game_state(mongo_db);

                // Format the response with correct Content-Length header
                let body = game_state; // game_state is a String
                let content_length = body.len();

                format!(
                    "HTTP/1.1 200 OK\r\nContent-Length: {}\r\n\r\n{}",
                    content_length, body
                )
            }
            _ => {
                format!("HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\n\r\nNot Found",)
            }
        };

        stream.write_all(response.as_bytes()).unwrap();
        stream.flush().unwrap();
    }
}

fn fetch_game_state(mongo_db: &MongoDB) -> String {
    // Perform a MongoDB query to fetch the game state (example)
    let _collection: mongodb::Collection<bson::Document> = mongo_db.get_database().collection("games");

    // Here we just return a placeholder JSON string. You can modify this to fetch actual game data.
    let game_state =
        r#"{"player_1": "Alice", "player_2": "Bob", "board": ["X", "O", "X"], "winner": "Alice"}"#;

    game_state.to_string() // Convert to string to return as HTTP response body
}
