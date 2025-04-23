use mongodb::{bson::doc, options::{ClientOptions, ServerApi, ServerApiVersion}, Client};

pub struct MongoDB {
    client: Client,
}

impl MongoDB {
    pub async fn new(uri: &str, db_name: &str) -> mongodb::error::Result<Self> {
        let mut client_options = ClientOptions::parse(uri).await?;

        let server_api = ServerApi::builder().version(ServerApiVersion::V1).build();
        client_options.server_api = Some(server_api);

        let client = Client::with_options(client_options)?;
        client
            .database(db_name)
            .run_command(doc! {"ping": 1}, None)
            .await?;

        println!("Pinged the MongoDB server. Connection successful!");

        Ok(MongoDB { client })
    }
    pub fn get_database(&self) -> mongodb::Database {
        self.client.database("tictactoe_db")
    }
}
