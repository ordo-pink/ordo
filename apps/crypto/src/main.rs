use std::net::SocketAddr;

use chacha20poly1305::aead::OsRng;
use chacha20poly1305::{aead::Aead, KeyInit, XChaCha20Poly1305};
use http_body_util::{BodyExt, Full};
use hyper::body::{Body, Frame};
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{body::Bytes, Method};
use hyper::{body::Incoming as IncomingBody, Request, Response, StatusCode};
use rand::RngCore;
use tokio::net::TcpListener;

type GenericError = Box<dyn std::error::Error + Send + Sync>;
type Result<T> = std::result::Result<T, GenericError>;
type BoxBody = http_body_util::combinators::BoxBody<Bytes, hyper::Error>;

fn full<T: Into<Bytes>>(chunk: T) -> BoxBody {
    Full::new(chunk.into())
        .map_err(|never| match never {})
        .boxed()
}

static NOTFOUND: &[u8] = b"Not Found";

async fn register_routes(
    req: Request<IncomingBody>,
    key: [u8; 32],
    nonce: [u8; 24],
) -> Result<Response<BoxBody>> {
    match (req.method(), req.uri().path()) {
        (&Method::POST, "/return_the_same") => return_the_same(req).await,
        (&Method::POST, "/return_the_same/mapped") => return_the_same_mapped(req).await,
        (&Method::POST, "/encrypt") => enc(req, key, nonce).await,
        (&Method::POST, "/decrypt") => dec(req, key, nonce).await,
        _ => {
            // Return 404 not found response.
            Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(full(NOTFOUND))
                .unwrap())
        }
    }
}

fn encrypt(bytes: &Bytes, key: &[u8; 32], nonce: &[u8; 24]) -> Result<Bytes> {
    let cipher = XChaCha20Poly1305::new(key.into());
    Ok(Bytes::from_iter(
        cipher.encrypt(nonce.into(), bytes.as_ref()).unwrap(),
    ))
}

fn decrypt(bytes: &Bytes, key: &[u8; 32], nonce: &[u8; 24]) -> Result<Bytes> {
    let cipher = XChaCha20Poly1305::new(key.into());
    Ok(Bytes::from_iter(
        cipher.decrypt(nonce.into(), bytes.as_ref()).unwrap(),
    ))
}

async fn enc(
    req: Request<IncomingBody>,
    key: [u8; 32],
    nonce: [u8; 24],
) -> Result<Response<BoxBody>> {
    let frame_stream = req.into_body().map_frame(move |frame| {
        let frame = if let Ok(data) = frame.into_data() {
            encrypt(&data, &key, &nonce).unwrap()
        } else {
            Bytes::new()
        };
        Frame::data(frame)
    });

    Ok(Response::new(frame_stream.boxed()))
}

async fn dec(
    req: Request<IncomingBody>,
    key: [u8; 32],
    nonce: [u8; 24],
) -> Result<Response<BoxBody>> {
    let frame_stream = req.into_body().map_frame(move |frame| {
        let frame = if let Ok(data) = frame.into_data() {
            decrypt(&data, &key, &nonce).unwrap()
        } else {
            Bytes::new()
        };
        Frame::data(frame)
    });

    Ok(Response::new(frame_stream.boxed()))
}

async fn return_the_same(req: Request<IncomingBody>) -> Result<Response<BoxBody>> {
    Ok(Response::new(req.into_body().boxed()))
}

async fn return_the_same_mapped(req: Request<IncomingBody>) -> Result<Response<BoxBody>> {
    let frame_stream = req.into_body().map_frame(|frame| {
        let frame = if let Ok(data) = frame.into_data() {
            // Convert every byte in every Data frame to uppercase
            data.iter().map(|byte| byte.to_be()).collect::<Bytes>()
        } else {
            Bytes::new()
        };

        Frame::data(frame)
    });

    Ok(Response::new(frame_stream.boxed()))
}

#[tokio::main]
async fn main() -> Result<()> {
    let addr: SocketAddr = "127.0.0.1:1337".parse().unwrap();

    let mut key = [0u8; 32];
    let mut nonce = [0u8; 24];
    OsRng.fill_bytes(&mut key);
    OsRng.fill_bytes(&mut nonce);

    let listener = TcpListener::bind(&addr).await?;
    println!("Listening on http://{}", addr);
    loop {
        let (stream, _) = listener.accept().await?;

        tokio::task::spawn(async move {
            let service = service_fn(move |req| register_routes(req, key, nonce));

            if let Err(err) = http1::Builder::new()
                .max_buf_size(8 * 1024)
                .serve_connection(stream, service)
                .await
            {
                println!("Failed to serve connection: {:?}", err);
            }
        });
    }
}
