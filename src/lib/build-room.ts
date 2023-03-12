import config from "../../config.json";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 6 });

interface Room {
  name?: string;
  description?: string;
  north?: Room;
  east?: Room;
  south?: Room;
  west?: Room;
  ds?: number;
  scavDS?: number;
  buildings?: Building[];
  exterior?: string;
}

interface Building {
  name?: string;
  description?: string;
  out?: string;
  type: string;
  ds?: number;
  scavDS?: number;
  exterior?: string;
}

type BuildingType =
  | "groceryStore"
  | "hardwareStore"
  | "pharmacy"
  | "policeStation"
  | "school"
  | "warehouse"
  | "officeBuilding"
  | "residental";

const digger = (room: Room, count?: number, id?: string) => {
 
  function getWeightedNumber() {
    const rand = Math.random();
    if (rand < 0.2) {
      return 8;
    } else if (rand < 0.7) {
      return 10;
    } else {
      return 12;
    }
  }

  const buildingTypes: BuildingType[] = [
    "groceryStore",
    "hardwareStore",
    "pharmacy",
    "policeStation",
    "school",
    "warehouse",
    "officeBuilding",
    "residental",
  ];
  const building = (room: Room): Building => {
    const type =
      buildingTypes[Math.floor(Math.random() * buildingTypes.length)];

    return {
      name:
        config.locations[type].names[
          Math.floor(Math.random() * config.locations[type].names.length)
        ] +
        " - " +
        uid() + " - " + id,
      description:
        config.locations[type].descriptions[
          Math.floor(Math.random() * config.locations[type].descriptions.length)
        ],
      type,
      exterior:
        config.locations[type].exteriors[
          Math.floor(Math.random() * config.locations[type].exteriors.length)
        ],
      ds: getWeightedNumber(),
      scavDS: getWeightedNumber(),
      out: room.name || "none",
    };
  };

  room.name =
    config.names.streets[
      Math.floor(Math.random() * config.names.streets.length)
    ] +
    " - " +
    uid() + " - " + id;

  room.description =
    config.descriptions.streets[
      Math.floor(Math.random() * config.descriptions.streets.length)
    ];
  room.ds = getWeightedNumber();
  room.scavDS = getWeightedNumber();
  room.exterior =
    config.exterior.streets[
      Math.floor(Math.random() * config.exterior.streets.length)
    ];

  room.buildings ||= [];
  for (let i = 0; i < Math.floor(Math.random() * 6); i++) {
    const rand = Math.random() * 6;
    if (rand > 2) room.buildings.push(Object.assign({}, building(room)));
  }

  // This is our exit condition
  if (count && count < 1) return room;

  // Roll for the north exit.
  let randomness = Math.floor(Math.random() * 6);
  if (randomness > 2 && room.north === undefined && count && count - 1 > 0) {
    room.north = {
      name:
        config.names.streets[
          Math.floor(Math.random() * config.names.streets.length)
        ] +
        " - " +
        uid() + " - " + id,
      description:
        config.descriptions.streets[
          Math.floor(Math.random() * config.descriptions.streets.length)
        ],
      ds: getWeightedNumber(),
      scavDS: getWeightedNumber(),
      exterior:
        config.exterior.streets[
          Math.floor(Math.random() * config.exterior.streets.length)
        ],
      south: room,
    };

    digger(room.north, count ? count - 1 : undefined, id);
  }

  // Roll for the east exit.
  randomness = Math.floor(Math.random() * 6);
  if (randomness > 2 && room.east === undefined && count && count - 1 > 0) {
    room.east = {
      name:
        config.names.streets[
          Math.floor(Math.random() * config.names.streets.length)
        ] +
        " - " +
        uid() + " - " + id,
      description:
        config.descriptions.streets[
          Math.floor(Math.random() * config.descriptions.streets.length)
        ],
      ds: 0,
      scavDS: 0,
      exterior:
        config.exterior.streets[
          Math.floor(Math.random() * config.exterior.streets.length)
        ],
      west: room,
    };

    digger(room.east, count ? count - 1 : undefined,id);
  }

  // Roll for the south exit.
  randomness = Math.floor(Math.random() * 6);
  if (randomness > 2 && room.south === undefined && count && count - 1 > 0) {
    room.south = {
      name:
        config.names.streets[
          Math.floor(Math.random() * config.names.streets.length)
        ] +
        " - " +
        uid() + " - " + id,
      description:
        config.descriptions.streets[
          Math.floor(Math.random() * config.descriptions.streets.length)
        ],
      ds: 0,
      scavDS: 0,
      exterior:
        config.exterior.streets[
          Math.floor(Math.random() * config.exterior.streets.length)
        ],
      north: room,
    };

    digger(room.south, count ? count - 1 : undefined, id);
  }

  // Roll for the west exit.
  randomness = Math.floor(Math.random() * 6);
  if (randomness > 2 && room.west === undefined && count && count - 1 > 0) {
    room.west = {
      name:
        config.names.streets[
          Math.floor(Math.random() * config.names.streets.length)
        ] +
        " - " +
        uid() + " - " + id,
      description:
        config.descriptions.streets[
          Math.floor(Math.random() * config.descriptions.streets.length)
        ],
      ds: 0,
      scavDS: 0,
      exterior:
        config.exterior.streets[
          Math.floor(Math.random() * config.exterior.streets.length)
        ],
      east: room,
    };

    digger(room.west, count ? count - 1 : undefined, id);
  }

  return room;
};

const directions = (room: Room, distinct = new Set(), id?: string) => {
  let output = "";

  // Save the current location before we get started.
  if (distinct.size === 0) {
    output += `@wait 0= &start me=[loc(me)]\n`;
    output += `@wait 0= &uid me=${id}\n`;
    output += `@wait 0= @create Zone Parent - ${id}\n`;
    output += `@wait 0= &zone me = [lastcreate(me, thing)]\n`;
  }

  if (!distinct.has(room.name)) {
    output += `@wait 0= @dig/tel ${room.name}\n`;
    output += `@wait 0= &ds here = ${room.ds}\n`;
    output += `@wait 0= &exterior here = ${room.exterior}\n`
    output += `@wait 0= @chzone here = [v(zone)]\n`;
    output += `@wait 0= &scavds here= ${room.scavDS}\n`;
    output += `@wait 0= @desc here = ${room.description}\n`;
    distinct.add(room.name);
  }

  // Generate biuldings!
  room.buildings?.forEach((building) => {
    output += `@wait 0= @dig/tel ${building.name}\n`;
    output += `@wait 0= &ds here = ${building.ds}\n`;
    output += `@wait 0= &scavds here= ${building.scavDS}\n`;
    output += `@wait 0= @chzone here = [v(zone)]\n`;
    output += `@wait 0= &exterior here = ${building.exterior}\n`;
    output += `@wait 0= @desc here = ${building.description}\n`;
    output += `@wait 0= &type here = ${building.type}\n`;
    output += `@wait 0= @open Out\\;o\\;leave\\;exit = [search(name=${
      room.name
    })],${building.name?.split(" - ")[0]}\\;${building.name
      ?.split(" - ")[0]
      .split(" ")[1]
      .slice(0, 2)}\n`;

    output += `@wait 0= @desc [search(name=${building.name})] = ${building.exterior}\n`;
  });

  // dig surrounding rooms.
  if (room.north && !distinct.has(room.north.name)) {
    output += `@wait 0= @dig/tel ${room.north.name}\n`;
    output += `@wait 0= &ds here = ${room.north.ds}\n`;
    output += `@wait 0= &scavds here= ${room.north.scavDS}\n`;
    output += `@wait 0= @desc here = ${room.north.description}\n`;
    output += `@wait 0= &exterior here = ${room.north.exterior}\n`;
    output += `@wait 0= @chzone here = [v(zone)]\n`;
    output += `@wait 0= @open South\\;s = [search(name=${room.name})],North\\;n\n`;
    distinct.add(room.north.name);
    output += directions(room.north, distinct, id);
  }

  if (room.south && !distinct.has(room.south.name)) {
    output += `@wait 0= @dig/tel ${room.south.name}\n`;
    output += `@wait 0= &ds here = ${room.south.ds}\n`;
    output += `@wait 0= &scavds here= ${room.south.scavDS}\n`;
    output += `@wait 0= @desc here = ${room.south.description}\n`;
    output += `@wait 0= &exterior here = ${room.south.exterior}\n`;
    output += `@wait 0= @chzone here = [v(zone)]\n`;
    output += `@wait 0= @open North\\;n = [search(name=${room.name})],South\\\;s\n`;
    output += `@wait 0= @fo me = {&street [lastcreate(me, exit)] = 1}\n`;
    distinct.add(room.south.name);
    output += directions(room.south, distinct, id);
  }

  if (room.east && !distinct.has(room.east.name)) {
    output += `@wait 0= @dig/tel ${room.east.name}\n`;
    output += `@wait 0= &ds here = ${room.east.ds}\n`;
    output += `@wait 0= &scavds here= ${room.east.scavDS}\n`;
    output += `@wait 0= @desc here = ${room.east.description}\n`;
    output += `@wait 0= &exterior here = ${room.east.exterior}\n`;
    output += `@wait 0= @chzone here = [v(zone)]\n`;
    output += `@wait 0= @open West\\;w = [search(name=${room.name})],East\\;e\n`;
    output += `@wait 0= @fo me= {&street [lastcreate(me,exit)] = 1}\n`;
    distinct.add(room.east.name);
    output += directions(room.east, distinct, id);
  }

  if (room.west && !distinct.has(room.west.name)) {
    output += `@wait 0= @dig/tel ${room.west.name}\n`;
    output += `@wait 0= &ds here = ${room.west.ds}\n`;
    output += `@wait 0= &scavds here= ${room.west.scavDS}\n`;
    output += `@wait 0= @desc here = ${room.west.description}\n`;
    output += `@wait 0= &exterior here = ${room.west.exterior}\n`;
    output += `@wait 0= @chzone here = [v(zone)]\n`;
    output += `@wait 0= @open East\\;e = [search(name=${room.name})],West\\;w\n`;
    distinct.add(room.west.name);
    output += directions(room.west, distinct, id);
  }

  return output;
};

export const generate = (count: number) => {
  const id = uid();
  const start = digger({}, count, id);
const distinct = new Set();
  let output = directions(start, distinct ,id);
  output += `@wait 0= @dolist search(name=North)= &street ##=1\n`;
  output += `@wait 0= @dolist search(name=South)= &street ##=1\n`;
  output += `@wait 0= @dolist search(name=East)= &street ##=1\n`;
  output += `@wait 0= @dolist search(name=West)= &street ##=1\n`;
  output += `@wait 0= @open Safehouse\\;sh = [v(start)], block-${id}\\;${id}\n`;
  output += `@wait 0= @tel me=[v(start)]\n`;

  return output;
};
