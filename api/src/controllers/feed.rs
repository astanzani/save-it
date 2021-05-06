use std::{
    collections::HashMap,
    time::{Duration, Instant},
};

use crate::middlewares::auth::AuthorizedUser;
use actix::prelude::*;
use actix_web::{web, HttpRequest, HttpResponse};
use actix_web_actors::ws;
use rand::{self, rngs::ThreadRng, Rng};

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(60);
/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(120);

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/feed").route(web::get().to(start_feed)));
}

fn start_feed(
    req: HttpRequest,
    stream: web::Payload,
    _authorized_user: AuthorizedUser,
    srv: web::Data<Addr<WsServer>>,
) -> HttpResponse {
    ws::start(
        WsSession {
            id: 0,
            hb: Instant::now(),
            addr: srv.get_ref().clone(),
        },
        &req,
        stream,
    )
    .unwrap()
}

struct WsSession {
    id: usize,
    hb: Instant,
    addr: Addr<WsServer>,
}

impl Actor for WsSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);

        let addr = ctx.address();
        self.addr
            .send(Connect {
                addr: addr.recipient(),
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(res) => act.id = res,
                    // something is wrong with chat server
                    _ => ctx.stop(),
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn stopping(&mut self, _: &mut Self::Context) -> Running {
        Running::Stop
    }
}

impl WsSession {
    fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            // check client heartbeats
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                // heartbeat timed out
                println!("Websocket Client heartbeat failed, disconnecting!");

                // notify chat server
                act.addr.do_send(Disconnect { id: act.id });

                // stop actor
                ctx.stop();

                // don't try to send a ping
                return;
            }

            ctx.ping(b"");
        });
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Message(pub String);

/// New chat session is created
#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
    pub addr: Recipient<Message>,
}

/// Session is disconnected
#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: usize,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Event {
    pub id: String,
}

pub struct WsServer {
    sessions: HashMap<usize, Recipient<Message>>,
    rng: ThreadRng,
}

/// Make actor from `ChatServer`
impl Actor for WsServer {
    /// We are going to use simple Context, we just need ability to communicate
    /// with other actors.
    type Context = Context<Self>;
}

impl Handler<Connect> for WsServer {
    type Result = usize;

    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        println!("New connection");

        let id = self.rng.gen::<usize>();
        self.sessions.insert(id, msg.addr);

        // notify all users in same room
        self.send_message(&id, "Connected");

        // register session with random id

        // send id back
        id
    }
}

/// Handler for Disconnect message.
impl Handler<Disconnect> for WsServer {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        println!("Disconnected");

        let mut rooms: Vec<String> = Vec::new();

        // remove address
        // if self.sessions.remove(&msg.id).is_some() {
        //     self.send_message(&msg.id, "Disconnected");
        // }
    }
}

impl Handler<Event> for WsServer {
    type Result = ();

    fn handle(&mut self, msg: Event, ctx: &mut Self::Context) -> Self::Result {
        println!("Handling event: {}", &msg.id);
        self.send_message(&0, &msg.id);
    }
}

impl WsServer {
    pub fn new() -> WsServer {
        println!("NEW SERVER");
        WsServer {
            sessions: HashMap::new(),
            rng: rand::thread_rng(),
        }
    }
}

impl WsServer {
    fn send_message(&self, id: &usize, message: &str) {
        let count = &self.sessions.len();
        println!("COUNT: {}", count);
        for (id, rec) in &self.sessions {
            println!("ID: {}", &id);
            let _ = rec.do_send(Message(message.to_owned()));
        }
    }
}

impl Handler<Message> for WsSession {
    type Result = ();

    fn handle(&mut self, msg: Message, ctx: &mut Self::Context) {
        ctx.text(msg.0);
    }
}

/// WebSocket message handler
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        let msg = match msg {
            Err(_) => {
                ctx.stop();
                return;
            }
            Ok(msg) => msg,
        };

        // println!("WEBSOCKET MESSAGE: {:?}", msg);
        match msg {
            ws::Message::Ping(msg) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            ws::Message::Pong(_) => {
                self.hb = Instant::now();
            }
            ws::Message::Text(text) => {
                let m = text.trim();
                ctx.text(m);
            }
            ws::Message::Binary(_) => println!("Unexpected binary"),
            ws::Message::Close(reason) => {
                ctx.close(reason);
                ctx.stop();
            }
            ws::Message::Continuation(_) => {
                ctx.stop();
            }
            ws::Message::Nop => (),
        }
    }
}
