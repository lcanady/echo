"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directions = exports.digger = void 0;
const config_json_1 = __importDefault(require("../../config.json"));
const uuid_1 = require("uuid");
const digger = (room, count, dirs = "") => {
    function getWeightedNumber() {
        const rand = Math.random();
        if (rand < 0.2) {
            return 8;
        }
        else if (rand < 0.7) {
            return 10;
        }
        else {
            return 12;
        }
    }
    const buildingTypes = [
        "groceryStore",
        "hardwareStore",
        "pharmacy",
        "policeStation",
        "school",
        "warehouse",
        "officeBuilding",
        "residental",
    ];
    const building = (room) => {
        const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        return {
            name: config_json_1.default.locations[type].names[Math.floor(Math.random() * config_json_1.default.locations[type].names.length)],
            description: config_json_1.default.locations[type].descriptions[Math.floor(Math.random() * config_json_1.default.locations[type].descriptions.length)],
            type,
            exterior: config_json_1.default.locations[type].exteriors[Math.floor(Math.random() * config_json_1.default.locations[type].exteriors.length)],
            ds: getWeightedNumber(),
            scavDS: getWeightedNumber(),
            out: room.name || "none",
        };
    };
    room.name =
        config_json_1.default.names.streets[Math.floor(Math.random() * config_json_1.default.names.streets.length)] +
            " - " +
            (0, uuid_1.v4)();
    room.description =
        config_json_1.default.descriptions.streets[Math.floor(Math.random() * config_json_1.default.descriptions.streets.length)];
    room.ds = getWeightedNumber();
    room.scavDS = getWeightedNumber();
    room.exterior =
        config_json_1.default.exterior.streets[Math.floor(Math.random() * config_json_1.default.exterior.streets.length)];
    room.buildings || (room.buildings = []);
    for (let i = 0; i < Math.floor(Math.random() * 6); i++) {
        const rand = Math.random() * 6;
        if (rand > 3)
            room.buildings.push(Object.assign({}, building(room)));
    }
    // This is our exit condition
    if (count && count < 1)
        return room;
    // Roll for the north exit.
    let randomness = Math.floor(Math.random() * 6);
    if (randomness > 3 && room.north === undefined && count && count - 1 > 0) {
        room.north = {
            name: config_json_1.default.names.streets[Math.floor(Math.random() * config_json_1.default.names.streets.length)] +
                " - " +
                (0, uuid_1.v4)(),
            description: config_json_1.default.descriptions.streets[Math.floor(Math.random() * config_json_1.default.descriptions.streets.length)],
            ds: getWeightedNumber(),
            scavDS: getWeightedNumber(),
            exterior: config_json_1.default.exterior.streets[Math.floor(Math.random() * config_json_1.default.exterior.streets.length)],
            south: Object.assign({}, room),
        };
        (0, exports.digger)(room.north, count ? count - 1 : undefined);
    }
    // Roll for the east exit.
    randomness = Math.floor(Math.random() * 6);
    if (randomness > 3 && room.east === undefined && count && count - 1 > 0) {
        room.east = {
            name: config_json_1.default.names.streets[Math.floor(Math.random() * config_json_1.default.names.streets.length)] +
                " - " +
                (0, uuid_1.v4)(),
            description: config_json_1.default.descriptions.streets[Math.floor(Math.random() * config_json_1.default.descriptions.streets.length)],
            ds: 0,
            scavDS: 0,
            exterior: config_json_1.default.exterior.streets[Math.floor(Math.random() * config_json_1.default.exterior.streets.length)],
            west: Object.assign({}, room),
        };
        (0, exports.digger)(room.east, count ? count - 1 : undefined);
    }
    // Roll for the south exit.
    randomness = Math.floor(Math.random() * 6);
    if (randomness > 3 && room.south === undefined && count && count - 1 > 0) {
        room.south = {
            name: config_json_1.default.names.streets[Math.floor(Math.random() * config_json_1.default.names.streets.length)] +
                " - " +
                (0, uuid_1.v4)(),
            description: config_json_1.default.descriptions.streets[Math.floor(Math.random() * config_json_1.default.descriptions.streets.length)],
            ds: 0,
            scavDS: 0,
            exterior: config_json_1.default.exterior.streets[Math.floor(Math.random() * config_json_1.default.exterior.streets.length)],
            north: Object.assign({}, room),
        };
        (0, exports.digger)(room.south, count ? count - 1 : undefined);
    }
    // Roll for the west exit.
    randomness = Math.floor(Math.random() * 6);
    if (randomness > 3 && room.west === undefined && count && count - 1 > 0) {
        room.west = {
            name: config_json_1.default.names.streets[Math.floor(Math.random() * config_json_1.default.names.streets.length)] +
                " - " +
                (0, uuid_1.v4)(),
            description: config_json_1.default.descriptions.streets[Math.floor(Math.random() * config_json_1.default.descriptions.streets.length)],
            ds: 0,
            scavDS: 0,
            exterior: config_json_1.default.exterior.streets[Math.floor(Math.random() * config_json_1.default.exterior.streets.length)],
            east: Object.assign({}, room),
        };
        (0, exports.digger)(room.west, count ? count - 1 : undefined);
    }
    return room;
};
exports.digger = digger;
const directions = (room, prev) => {
    console.log(room.name);
    if (room.north &&
        room.north.name !== room.name &&
        room.north.name !== (prev === null || prev === void 0 ? void 0 : prev.name))
        (0, exports.directions)(room.north, room);
    if (room.east &&
        room.east.name !== room.name &&
        room.east.name !== (prev === null || prev === void 0 ? void 0 : prev.name))
        (0, exports.directions)(room.east, room);
    if (room.south &&
        room.south.name !== room.name &&
        room.south.name !== (prev === null || prev === void 0 ? void 0 : prev.name))
        (0, exports.directions)(room.south, room);
    if (room.west &&
        room.west.name !== room.name &&
        room.west.name !== (prev === null || prev === void 0 ? void 0 : prev.name))
        (0, exports.directions)(room.west, prev);
};
exports.directions = directions;
//# sourceMappingURL=build-room.js.map