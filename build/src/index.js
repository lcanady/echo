"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_room_1 = require("./lib/build-room");
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
console.log((0, build_room_1.directions)((0, build_room_1.digger)({}, 3)));
//# sourceMappingURL=index.js.map