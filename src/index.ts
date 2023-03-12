import express from "express";
import { createServer } from "http";
import { createConnection } from "telnetlib";
import { generate } from "./lib/build-room";

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// const server = createServer(app);

// server.listen(3000, () => {
//   const client = createConnection(
//     {
//       host: "endless.digibear.io",
//       port: 2065,
//     },
//     () => {
//       // connect to the robot.
//       client.write("connect echo animefan\rm");

//       client.on("data", (data) => {
//         console.log(data.toString());
//       });
//     }
//   );

//   console.log("Bot COnnected.");
// });
console.log(generate(3));
