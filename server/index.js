const express = require("express");
const mysql = require("mysql");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const cors = require("cors");
server.listen(4000);
app.use(cors()); // CORS 미들웨어 추가

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:19002/",
    methods: ["GET", "POST"],
  },
});

const db = mysql.createPool({
  host: "localhost",
  user: "dureotkd",
  password: "slsksh33",
  database: "native",
});

io.on("connection", function (socket) {
  socket.emit("test", { asd: "zzzzzzzzzzzzz" });
  socket.on("my other event", function (data) {
    console.log("response to my other event: ", data);
  });
});

app.get("/", function (req, res) {
  res.send("express-!!");
});

app.get("/getPhotoShop", (req, res) => {
  db.query(`SELECT * FROM native.photo_shop`, (err, data) => {
    if (!err) res.send(data);
    else res.send(err);
  });
});

app.get("/getWishPoint", (req, res) => {
  const shopSeq = req.query.shopSeq;
  db.query(
    `SELECT COUNT(*) as cnt FROM wish
  WHERE shop_seq = ${shopSeq}
  `,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/getUser", function (req, res) {
  db.query(`SELECT * FROM native.photo_shop`, (err, data) => {
    if (!err) res.send(data);
    else res.send(err);
  });
});

app.get("/DeleteWishPhotoShop", function (req, res) {
  const shopSeq = req.query.shopSeq;
  const userNo = req.query.userNo;
  db.query(
    `DELETE FROM native.wish 
  WHERE shop_seq = ${shopSeq} AND user_no = ${userNo}`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/CheckDupWish", function (req, res) {
  const shopSeq = req.query.shopSeq;
  const userNo = req.query.userNo;
  db.query(
    `SELECT * FROM native.wish 
  WHERE shop_seq = ${shopSeq} AND user_no = ${userNo}
  LIMIT 1`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/ReserveSuccessMsg", (req, res) => {
  const msg = req.query.msg;
  const roomSeq = req.query.roomSeq;
  const sendUser = req.query.sendUser;
  const receiveUser = req.query.receiveUser;
  const imageUri = req.query.imageUri;
  db.query(
    `INSERT INTO chat VALUES('','${msg}','${roomSeq}',NOW(),'${sendUser}','${receiveUser}','N','','','${imageUri}')`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/ReserveSuccess", (req, res) => {
  const shopSeq = req.query.shopSeq;
  const userNo = req.query.userNo;
  const type = req.query.type;
  db.query(
    `INSERT INTO reservation VALUES('','${shopSeq}','${userNo}',NOW(),NOW(),'${type}','Y')`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/WishPhotoShop", (req, res) => {
  const userNo = req.query.userNo;
  const shopSeq = req.query.shopSeq;

  db.query(
    `INSERT INTO wish VALUES('','${userNo}','${shopSeq}',NOW(),'Y')`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/doLogin", (req, res) => {
  const loginId = req.query.loginId;
  const loginPw = req.query.loginPw;

  db.query(
    ` 
  SELECT 
    *
  FROM 
    user a
  WHERE 
    a.id = '${loginId}' AND a.pw = '${loginPw}'`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/getLoginUser", (req, res) => {
  const loginId = req.query.loginId;

  db.query(
    ` 
  SELECT 
    *
  FROM 
    user a
  WHERE 
    a.id = '${loginId}' `,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/joinUser", (req, res) => {
  const loginId = req.query.loginId;
  const loginPw = req.query.loginPw;
  const loginPwC = req.query.loginPwC;
  db.query(
    `INSERT INTO user VALUES('','손님','손님','${loginId}','${loginPw}','client')`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/getInsertMsg", (req, res) => {
  const msg = req.query.msg;
  const roomSeq = req.query.roomSeq;
  const sendUser = req.query.sendUser;
  const receiveUser = req.query.receiveUser;
  const isRead = req.query.isRead;
  db.query(
    `INSERT INTO chat VALUES('','${msg}','${roomSeq}',NOW(),'${sendUser}','${receiveUser}','${isRead}','','','')`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/getWishList", (req, res) => {
  const userNo = req.query.userNo;

  db.query(
    `SELECT * FROM native.wish a , native.photo_shop b
  WHERE a.shop_seq = b.seq AND a.state = 'Y' AND b.state = 'Y'
  AND a.user_no = ${userNo}
  `,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/getReservationList", (req, res) => {
  const userNo = req.query.userNo;

  db.query(
    `SELECT * FROM native.reservation a , native.photo_shop b
  WHERE a.shop_seq = b.seq AND a.state = 'Y' AND b.state = 'Y'
  AND a.user_no = ${userNo}
  `,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

app.get("/getChatMsg", (req, res) => {
  const room_seq = req.query.room_seq;
  db.query(
    ` 
  SELECT 
    a.* , b.title
  FROM 
    chat a , chat_room b
  WHERE 
    a.room_seq = b.seq
  AND 
    b.seq = ${room_seq}
  ORDER BY a.reg_date ASC`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});
app.get("/getChatRoom", (req, res) => {
  const seq = req.query.seq;

  db.query(
    `
  SELECT 
    *
  FROM (
	  SELECT 
      a.* , b.title , b.host_user , b.seq AS room_group
    FROM 
      chat a , chat_room b
    WHERE 
      a.room_seq = b.seq
    AND (a.send_user = 2  OR a.receive_user = 2)
    ORDER BY 
      a.reg_date DESC
    LIMIT 
      18446744073709551615
  ) AS msg_desc
  GROUP BY room_group`,
    (err, data) => {
      if (!err) res.send(data);
      else res.send(err);
    }
  );
});

io.on("connection", function (socket) {
  socket.emit("news", { message: "Hello World?" });
  socket.on("my other event", function (data) {
    console.log("response to my other event: ", data);
  });
});
