use axum::{
    body::boxed,
    extract::BodyStream,
    http::StatusCode,
    response::Response,
    routing::{on, MethodFilter},
    Router,
};
use axum_extra::body::AsyncReadBody;
use futures::StreamExt;
use std::net::SocketAddr;
use tokio::io::AsyncWriteExt;
use tracing_subscriber::prelude::__tracing_subscriber_SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

static MAX_BUF_SIZE: usize = 64 * 1024;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "ordo-crypto=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = Router::new().route("/return_the_same", on(MethodFilter::POST, return_the_same));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn return_the_same(mut stream: BodyStream) -> Result<Response, StatusCode> {
    let (rx, tx) = tokio::io::duplex(MAX_BUF_SIZE);
    let body = AsyncReadBody::new(rx);
    tokio::task::spawn(async move {
        futures::pin_mut!(tx);
        while let Some(chunk) = stream.next().await {
            tx.write_all(&chunk.unwrap())
                .await
                .expect("Dont able to write into stream ;(");
        }
    });

    Ok(Response::builder().body(boxed(body)).unwrap())
}
