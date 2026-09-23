const FLOOR_DATA_CONST = [
  {
    person: "Zoey",
    category: "Pranie",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Rachel",
    category: "Lodówka",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Gabe",
    category: "Szuflada z rupieciami",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Josh",
    category: "Sieci fast food",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Ellie",
    category: "Komedie romantyczne",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Zoey",
    category: "Filmy",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Andrea",
    category: "Postacie Disneya",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Tanner",
    category: "Superbohaterowie",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Emma",
    category: "Teksty Taylor Swift",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Nolan",
    category: "Polskie potrawy",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Nic",
    category: "Gadżety kuchenne",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Syd",
    category: "Sławni, którzy zmarli przed 30",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Pat",
    category: "The Office",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "John",
    category: "Garaż",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Rachel",
    category: "Święta",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Nic",
    category: "Jedzenie z jarmarku",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Aimee",
    category: "Atrakcje Chicago",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Devin",
    category: "Diwy popu",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "John",
    category: "Sporty",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Ellie",
    category: "Książki",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Beth",
    category: "Gry wideo",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Joey",
    category: "Polscy sportowcy",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Nolan",
    category: "Matematyka",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Aimee",
    category: "Flagi Europy",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Syd",
    category: "Psy",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Beth",
    category: "Filmy Disney Channel",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Josh",
    category: "Slogany reklamowe",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Emma",
    category: "Konie",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Pat",
    category: "Panoramy miast",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Tanner",
    category: "Postacie z gier wideo",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Andrea",
    category: "Anime",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Frankie",
    category: "Postacie z Harry'ego Pottera",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Gabe",
    category: "Aplikacje",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Frankie",
    category: "Wesołe miasteczka",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Devin",
    category: "Kostiumy na Halloween",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Joey",
    category: "Pokémony",
    hasPlayed: false,
    isStillInTheGame: true,
  },
] as const;

export type GameDetails = {
  data: FloorData[];
};
type UsedCategories = (typeof FLOOR_DATA_CONST)[number]["category"];

type UnusedCategoriesFromConst = Exclude<Category, UsedCategories>;

export type Category =
  | "Tabliczka mnożenia"
  | "Pokémony"
  | "Owoce"
  | "Postacie Disneya"
  | "Gadżety kuchenne"
  | "Szuflada z rupieciami"
  | "Pranie"
  | "Diwy popu"
  | "Atrakcje Chicago"
  | "Gry planszowe"
  | "Postacie z Harry'ego Pottera"
  | "Kostiumy na Halloween"
  | "Superbohaterowie"
  | "Postacie z gier wideo"
  | "Panoramy miast"
  | "Filmy"
  | "Książki"
  | "Filmy Disney Channel"
  | "Slogany reklamowe"
  | "Teksty Taylor Swift"
  | "The Office"
  | "Święto Dziękczynienia"
  | "Psy"
  | "Konie"
  | "Komedie romantyczne"
  | "Wesołe miasteczka"
  | "Jedzenie z jarmarku"
  | "Sławni, którzy zmarli przed 30"
  | "Sieci fast food"
  | "Lodówka"
  | "Garaż"
  | "Święta"
  | "Sporty"
  | "Anime"
  | "Minecraft"
  | "Flagi Europy"
  // | "Chilis" // unused for now
  | "Matematyka"
  | "Aplikacje"
  | "Wyposażenie basenu"
  | "Gry wideo"
  | "Polskie potrawy"
  | "Polscy sportowcy"
  ;

/**
 * Anything the game will accept as a category key.
 *
 * The curated categories in this file are a closed union, which is what keeps
 * `CATEGORY_METADATA` exhaustive and gives contributors autocomplete. Community
 * categories only exist at runtime, so the game itself has to key off a plain
 * string. `string & {}` keeps the literal suggestions in editors while still
 * accepting a `community:<id>` key.
 *
 * Resolve one of these into something renderable with `resolveCategory` in
 * `app/categories/registry.ts` -- never index `CATEGORY_METADATA` directly.
 */
export type CategoryId = Category | (string & {});

export interface FloorData {
  person: string;
  category: CategoryId;
  hasPlayed: boolean;
  isStillInTheGame: boolean;
}

const EuropeanFlagsCategory: CategoryMetadata = {
  name: "Flagi Europy",
  folder: "european-flags",
  examples: [
    {
      name: "Niemcy",
      image: "germany.jpg",
      alternatives: ["Germany"],
    },
    {
      name: "Holandia",
      image: "netherlands.jpg",
      alternatives: ["Netherlands"],
    },
    {
      name: "Dania",
      image: "denmark.jpg",
      alternatives: ["Denmark"],
    },
    {
      name: "Irlandia",
      image: "ireland.jpg",
      alternatives: ["Ireland"],
    },
    {
      name: "Austria",
      image: "austria.jpg",
      alternatives: [],
    },
    {
      name: "Ukraina",
      image: "ukraine.jpg",
      alternatives: ["Ukraine"],
    },
    {
      name: "Francja",
      image: "france.jpg",
      alternatives: ["France"],
    },
    {
      name: "Szwajcaria",
      image: "switzerland.jpg",
      alternatives: ["Switzerland"],
    },
    {
      name: "Grecja",
      image: "greece.jpg",
      alternatives: ["Greece"],
    },
    {
      name: "Polska",
      image: "poland.jpg",
      alternatives: ["Poland"],
    },
    {
      name: "Hiszpania",
      image: "spain.jpg",
      alternatives: ["Spain"],
    },
    {
      name: "Włochy",
      image: "italy.jpg",
      alternatives: ["Italy"],
    },
    {
      name: "Portugalia",
      image: "portugal.jpg",
      alternatives: ["Portugal"],
    },
    {
      name: "Norwegia",
      image: "norway.jpg",
      alternatives: ["Norway"],
    },
    {
      name: "Finlandia",
      image: "finland.jpg",
      alternatives: ["Finland"],
    },
    {
      name: "Wielka Brytania",
      image: "united-kingdom.jpg",
      alternatives: ["United Kingdom"],
    },
    {
      name: "Belgia",
      image: "belgium.jpg",
      alternatives: ["Belgium"],
    },
    {
      name: "Rosja",
      image: "russia.jpg",
      alternatives: ["Russia"],
    },
    {
      name: "Szwecja",
      image: "sweden.jpg",
      alternatives: ["Sweden"],
    },
    {
      name: "Turcja",
      image: "turkey.jpg",
      alternatives: ["Turkey"],
    },
    {
      name: "Słowacja",
      image: "slovakia.jpg",
      alternatives: ["Slovakia"],
    },
    {
      name: "Estonia",
      image: "estonia.jpg",
      alternatives: [],
    },
    {
      name: "Słowenia",
      image: "slovenia.jpg",
      alternatives: ["Slovenia"],
    },
    {
      name: "Cypr",
      image: "cyprus.jpg",
      alternatives: ["Cyprus"],
    },
    {
      name: "Luksemburg",
      image: "luxembourg.jpg",
      alternatives: ["Luxembourg"],
    },
    {
      name: "Łotwa",
      image: "latvia.jpg",
      alternatives: ["Latvia"],
    },
    {
      name: "Litwa",
      image: "lithuania.jpg",
      alternatives: ["Lithuania"],
    },
    {
      name: "Rumunia",
      image: "romania.jpg",
      alternatives: ["Romania"],
    },
    {
      name: "Malta",
      image: "malta.jpg",
      alternatives: [],
    },
    {
      name: "Islandia",
      image: "iceland.jpg",
      alternatives: ["Iceland"],
    },
    {
      name: "Bułgaria",
      image: "bulgaria.jpg",
      alternatives: ["Bulgaria"],
    },
    {
      name: "Serbia",
      image: "serbia.jpg",
      alternatives: [],
    },
    {
      name: "Monako",
      image: "monaco.jpg",
      alternatives: ["Monaco"],
    },
    {
      name: "Węgry",
      image: "hungary.jpg",
      alternatives: ["Hungary"],
    },
    {
      name: "Czechy",
      image: "czech-republic.jpg",
      alternatives: ["Czech Republic", "Czechia"],
    },
    {
      name: "Chorwacja",
      image: "croatia.jpg",
      alternatives: ["Croatia"],
    },
    {
      name: "San Marino",
      image: "san-marino.jpg",
      alternatives: [],
    },
    {
      name: "Czarnogóra",
      image: "montenegro.jpg",
      alternatives: ["Montenegro"],
    },
    {
      name: "Watykan",
      image: "vatican-city.jpg",
      alternatives: ["Vatican City"],
    },
    {
      name: "Gruzja",
      image: "georgia.jpg",
      alternatives: ["Georgia"],
    },
    {
      name: "Albania",
      image: "albania.jpg",
      alternatives: [],
    },
    {
      name: "Kazachstan",
      image: "kazakhstan.jpg",
      alternatives: ["Kazakhstan"],
    },
    {
      name: "Kosowo",
      image: "kosovo.jpg",
      alternatives: ["Kosovo"],
    },
    {
      name: "Liechtenstein",
      image: "liechtenstein.jpg",
      alternatives: [],
    },
    {
      name: "Macedonia Północna",
      image: "north-macedonia.jpg",
      alternatives: ["North Macedonia"],
    },
    {
      name: "Andora",
      image: "andorra.jpg",
      alternatives: ["Andorra"],
    },
    {
      name: "Bośnia i Hercegowina",
      image: "bosnia-and-herzegovina.jpg",
      alternatives: ["Bosnia and Herzegovina", "Bosnia"],
    },
    {
      name: "Białoruś",
      image: "belarus.jpg",
      alternatives: ["Belarus"],
    },
    {
      name: "Armenia",
      image: "armenia.jpg",
      alternatives: [],
    },
    {
      name: "Azerbejdżan",
      image: "azerbaijan.jpg",
      alternatives: ["Azerbaijan"],
    },
    {
      name: "Mołdawia",
      image: "moldova.jpg",
      alternatives: ["Moldova"],
    },
  ],
};

const MinecraftCategory: CategoryMetadata = {
  name: "Minecraft",
  folder: "minecraft",
  examples: [
    {
      name: "Wioska",
      image: "village.jpg",
      alternatives: ["Village"],
    },
    {
      name: "Zombie",
      image: "zombie.jpg",
      alternatives: [],
    },
    {
      name: "Enderman",
      image: "enderman.jpg",
      alternatives: [],
    },
    {
      name: "Szkielet",
      image: "skeleton.jpg",
      alternatives: ["Skeleton"],
    },
    {
      name: "Stół do zaklinania",
      image: "enchanting-table.jpg",
      alternatives: ["Enchanting Table"],
    },
    {
      name: "Dżungla",
      image: "jungle.jpg",
      alternatives: ["Jungle"],
    },
    {
      name: "Alex",
      image: "alex.jpg",
      alternatives: [],
    },
    {
      name: "Statyw alchemiczny",
      image: "brewing-stand.jpg",
      alternatives: ["Brewing Stand"],
    },
    {
      name: "Steve",
      image: "steve.jpg",
      alternatives: [],
    },
    {
      name: "Pająk jaskiniowy",
      image: "cave-spider.jpg",
      alternatives: ["Cave Spider"],
    },
    {
      name: "Równiny",
      image: "plains.jpg",
      alternatives: ["Plains"],
    },
    {
      name: "Creeper",
      image: "creeper.jpg",
      alternatives: [],
    },
    {
      name: "Komparator",
      image: "redstone-comparator.jpg",
      alternatives: ["Redstone Comparator", "Comparator"],
    },
    {
      name: "Oko Kresu",
      image: "eye-of-ender.jpg",
      alternatives: ["Eye of Ender"],
    },
    {
      name: "Wiśniowy gaj",
      image: "cherry-grove.jpg",
      alternatives: ["Cherry Grove", "Cherry Blossom"],
    },
    {
      name: "Aksolotl",
      image: "axolotl.jpg",
      alternatives: ["Axolotl"],
    },
    {
      name: "Elytra",
      image: "elytra.jpg",
      alternatives: [],
    },
    {
      name: "Wither",
      image: "wither.jpg",
      alternatives: [],
    },
    {
      name: "Wrak statku",
      image: "shipwreck.jpg",
      alternatives: ["Shipwreck"],
    },
    {
      name: "Warden",
      image: "warden.jpg",
      alternatives: [],
    },
    {
      name: "Zrujnowany portal",
      image: "ruined-portal.jpg",
      alternatives: ["Ruined Portal"],
    },
    {
      name: "Blaze",
      image: "blaze.jpg",
      alternatives: [],
    },
    {
      name: "Pustynna świątynia",
      image: "desert-temple.jpg",
      alternatives: ["Desert Temple"],
    },
    {
      name: "Ocelot",
      image: "ocelot.jpg",
      alternatives: ["ocelot"],
    },
    {
      name: "Smok Kresu",
      image: "ender-dragon.jpg",
      alternatives: ["Ender Dragon", "Enderdragon"],
    },
    {
      name: "Wyschnięty ghast",
      image: "dried-ghast.jpg",
      alternatives: ["Dried Ghast"],
    },
    {
      name: "Tajga",
      image: "taiga.jpg",
      alternatives: ["Taiga"],
    },
    {
      name: "Badlandy",
      image: "badlands.jpg",
      alternatives: ["Badlands", "Mesa Biome"],
    },
    {
      name: "Żelazny golem",
      image: "iron-golem.jpg",
      alternatives: ["Iron Golem"],
    },
    {
      name: "Pustkowia Netheru",
      image: "nether-wastes.jpg",
      alternatives: ["Nether Wastes", "Nether"],
    },
    {
      name: "Głęboki mrok",
      image: "deep-dark.jpg",
      alternatives: ["Deep Dark"],
    },
    {
      name: "Kres",
      image: "the-end.jpg",
      alternatives: ["The End"],
    },
    {
      name: "Starożytne miasto",
      image: "ancient-city.jpg",
      alternatives: ["Ancient City"],
    },
    {
      name: "Bagno namorzynowe",
      image: "mangrove-swamp.jpg",
      alternatives: ["Mangrove Swamp", "Mangrove"],
    },
    {
      name: "Bujne jaskinie",
      image: "lush-caves.jpg",
      alternatives: ["Lush Caves"],
    },
    {
      name: "Leśna rezydencja",
      image: "woodland-mansion.jpg",
      alternatives: ["Woodland Mansion"],
    },
    {
      name: "Pola grzybowe",
      image: "mushroom-fields.jpg",
      alternatives: ["Mushroom Fields", "Mushroom Islands"],
    },
    {
      name: "Wypaczony las",
      image: "warped-forest.jpg",
      alternatives: ["Warped Forest"],
    },
    {
      name: "Monument oceaniczny",
      image: "ocean-monument.jpg",
      alternatives: ["Ocean Monument"],
    },
    {
      name: "Magiczna latarnia",
      image: "beacon.jpg",
      alternatives: ["Beacon"],
    },
    {
      name: "Rozbójnik",
      image: "pillager.jpg",
      alternatives: ["Pillager"],
    },
    {
      name: "Twierdza",
      image: "stronghold.jpg",
      alternatives: ["Stronghold"],
    },
  ],
};

const AnimeCategory: CategoryMetadata = {
  name: "Anime",
  folder: "anime",
  examples: [
    {
      name: "Naruto",
      image: "naruto.jpg",
      alternatives: [],
    },
    {
      name: "One Piece",
      image: "one-piece.jpg",
      alternatives: [],
    },
    {
      name: "Atak Tytanów",
      image: "attack-on-titan.jpg",
      alternatives: ["Attack on Titan", "AoT", "Shingeki no Kyojin"],
    },
    {
      name: "Frieren",
      image: "frieren.jpg",
      alternatives: [],
    },
    {
      name: "Yuri!!! on ICE",
      image: "yuri-on-ice.jpg",
      alternatives: [],
    },
    {
      name: "Death Note",
      image: "death-note.jpg",
      alternatives: [],
    },
        {
      name: "Chainsaw Man",
      image: "chainsaw-man.jpg",
      alternatives: [],
    },
    {
      name: "Dragon Ball Z",
      image: "dragon-ball-z.jpg",
      alternatives: ["DBZ"],
    },
    {
      name: "Demon Slayer",
      image: "demon-slayer.jpg",
      alternatives: ["Kimetsu no Yaiba"],
    },
    {
      name: "My Hero Academia",
      image: "my-hero-academia.jpg",
      alternatives: [],
    },
    {
      name: "Jujutsu Kaisen",
      image: "jujutsu-kaisen.jpg",
      alternatives: ["JJK"],
    },
    {
      name: "Fullmetal Alchemist: Brotherhood",
      image: "fullmetal-alchemist-brotherhood.jpg",
      alternatives: ["FMAB", "FMA Brotherhood"],
    },
    {
      name: "Sword Art Online",
      image: "sword-art-online.jpg",
      alternatives: ["SAO"],
    },
    {
      name: "Tokyo Ghoul",
      image: "tokyo-ghoul.jpg",
      alternatives: [],
    },
    {
      name: "Hunter x Hunter",
      image: "hunter-x-hunter.jpg",
      alternatives: ["HxH"],
    },
    {
      name: "One Punch Man",
      image: "one-punch-man.jpg",
      alternatives: [],
    },
    {
      name: "Cowboy Bebop",
      image: "cowboy-bebop.jpg",
      alternatives: [],
    },
    {
      name: "Your Name",
      image: "your-name.jpg",
      alternatives: ["Kimi no Na wa"],
    },
    {
      name: "Neon Genesis Evangelion",
      image: "neon-genesis-evangelion.jpg",
      alternatives: ["Evangelion", "NGE"],
    },
    {
      name: "Mój sąsiad Totoro",
      image: "my-neighbor-totoro.jpg",
      alternatives: ["My Neighbor Totoro", "Totoro"],
    },
    {
      name: "Spy x Family",
      image: "spy-x-family.jpg",
      alternatives: [],
    },
    {
      name: "Haikyuu!!",
      image: "haikyuu.jpg",
      alternatives: [],
    },
    {
      name: "Mob Psycho 100",
      image: "mob-psycho-100.jpg",
      alternatives: [],
    },
    {
      name: "Fairy Tail",
      image: "fairy-tail.jpg",
      alternatives: [],
    },
    {
      name: "Steins;Gate",
      image: "steins-gate.jpg",
      alternatives: [],
    },
    {
      name: "Re:Zero",
      image: "rezero.jpg",
      alternatives: ["Re Zero"],
    },
    {
      name: "Violet Evergarden",
      image: "violet-evergarden.jpg",
      alternatives: [],
    },
    {
      name: "JoJo's Bizarre Adventure",
      image: "jojos-bizarre-adventure.jpg",
      alternatives: ["JoJo"],
    },
    {
      name: "The Promised Neverland",
      image: "the-promised-neverland.jpg",
      alternatives: [],
    },
    {
      name: "Assassination Classroom",
      image: "assassination-classroom.jpg",
      alternatives: [],
    },
    {
      name: "Puella Magi Madoka Magica",
      image: "puella-magi-madoka-magica.jpg",
      alternatives: ["Madoka Magica"],
    },
    {
      name: "Black Butler",
      image: "black-butler.jpg",
      alternatives: [],
    },
    {
      name: "Made in Abyss",
      image: "made-in-abyss.jpg",
      alternatives: [],
    },
    {
      name: "Parasyte",
      image: "parasyte.jpg",
      alternatives: [],
    },
    {
      name: "Fate/Zero",
      image: "fate-zero.jpg",
      alternatives: ["Fate"],
    },
    {
      name: "Mashle: Magic and Muscles",
      image: "mashle.jpg",
      alternatives: ["Mashle"],
    },
  ],
};

export const FLOOR_DATA: FloorData[] =
  FLOOR_DATA_CONST as unknown as FloorData[];

export type FloorPieces = Record<number, FloorData>;

export type ImageExample = {
  name: string;
  image: string;
  alternatives: string[];
};

export type TextExample = {
  name: string;
  text: string;
  alternatives: string[];
};

type CategoryMetadata = {
  name: string;
  folder: string;
  examples: ImageExample[] | TextExample[];
};

const TimesTablesCategory: CategoryMetadata = {
  name: "Tabliczka mnożenia",
  folder: "times-tables",
  examples: [
    {
      name: "18",
      text: "2 x 9",
      alternatives: [],
    },
    {
      name: "72",
      text: "8 x 9",
      alternatives: [],
    },
    {
      name: "22",
      text: "2 x 11",
      alternatives: [],
    },
    {
      name: "66",
      text: "6 x 11",
      alternatives: [],
    },
    {
      name: "35",
      text: "5 x 7",
      alternatives: [],
    },
    {
      name: "55",
      text: "5 x 11",
      alternatives: [],
    },
    {
      name: "30",
      text: "3 x 10",
      alternatives: [],
    },
    {
      name: "90",
      text: "9 x 10",
      alternatives: [],
    },
    {
      name: "24",
      text: "4 x 6",
      alternatives: [],
    },
    {
      name: "48",
      text: "4 x 12",
      alternatives: [],
    },
    {
      name: "9",
      text: "1 x 9",
      alternatives: [],
    },
    {
      name: "6",
      text: "2 x 3",
      alternatives: [],
    },
    {
      name: "27",
      text: "3 x 9",
      alternatives: [],
    },
    {
      name: "110",
      text: "10 x 11",
      alternatives: [],
    },
    {
      name: "32",
      text: "4 x 8",
      alternatives: [],
    },
    {
      name: "14",
      text: "2 x 7",
      alternatives: [],
    },
    {
      name: "25",
      text: "5 x 5",
      alternatives: [],
    },
    {
      name: "60",
      text: "6 x 10",
      alternatives: [],
    },
    {
      name: "28",
      text: "4 x 7",
      alternatives: [],
    },
    {
      name: "20",
      text: "4 x 5",
      alternatives: [],
    },
    {
      name: "6",
      text: "1 x 6",
      alternatives: [],
    },
    {
      name: "16",
      text: "2 x 8",
      alternatives: [],
    },
    {
      name: "12",
      text: "3 x 4",
      alternatives: [],
    },
    {
      name: "44",
      text: "4 x 11",
      alternatives: [],
    },
    {
      name: "21",
      text: "3 x 7",
      alternatives: [],
    },
    {
      name: "72",
      text: "6 x 12",
      alternatives: [],
    },
    {
      name: "36",
      text: "6 x 6",
      alternatives: [],
    },
    {
      name: "30",
      text: "5 x 6",
      alternatives: [],
    },
    {
      name: "11",
      text: "1 x 11",
      alternatives: [],
    },
    {
      name: "24",
      text: "3 x 8",
      alternatives: [],
    },
    {
      name: "144",
      text: "12 x 12",
      alternatives: [],
    },
    {
      name: "18",
      text: "3 x 6",
      alternatives: [],
    },
    {
      name: "63",
      text: "7 x 9",
      alternatives: [],
    },
    {
      name: "8",
      text: "2 x 4",
      alternatives: [],
    },
    {
      name: "56",
      text: "7 x 8",
      alternatives: [],
    },
    {
      name: "8",
      text: "1 x 8",
      alternatives: [],
    },
  ],
};

const PokemonCategory: CategoryMetadata = {
  name: "Pokémony",
  folder: "pokemon",
  examples: [
    {
      name: "Pikachu",
      image: "pikachu.png",
      alternatives: [],
    },
    {
      name: "Charizard",
      image: "charizard.png",
      alternatives: [],
    },
    {
      name: "Mewtwo",
      image: "mewtwo.png",
      alternatives: [],
    },
    {
      name: "Mew",
      image: "mew.png",
      alternatives: [],
    },
    {
      name: "Blastoise",
      image: "blastoise.png",
      alternatives: [],
    },
    {
      name: "Venusaur",
      image: "venusaur.png",
      alternatives: [],
    },
    {
      name: "Squirtle",
      image: "squirtle.png",
      alternatives: [],
    },
    {
      name: "Bulbasaur",
      image: "bulbasaur.png",
      alternatives: [],
    },
    {
      name: "Charmander",
      image: "charmander.png",
      alternatives: [],
    },
    {
      name: "Eevee",
      image: "eevee.png",
      alternatives: [],
    },
    {
      name: "Jigglypuff",
      image: "jigglypuff.png",
      alternatives: [],
    },
    {
      name: "Raichu",
      image: "raichu.png",
      alternatives: [],
    },
    {
      name: "Pidgey",
      image: "pidgey.png",
      alternatives: [],
    },
    {
      name: "Rattata",
      image: "rattata.png",
      alternatives: [],
    },
    {
      name: "Zubat",
      image: "zubat.png",
      alternatives: [],
    },
    {
      name: "Magikarp",
      image: "magikarp.png",
      alternatives: [],
    },
    {
      name: "Onix",
      image: "onix.png",
      alternatives: [],
    },
    {
      name: "Geodude",
      image: "geodude.png",
      alternatives: [],
    },
    {
      name: "Gastly",
      image: "gastly.png",
      alternatives: [],
    },
    {
      name: "Clefairy",
      image: "clefairy.png",
      alternatives: [],
    },
    {
      name: "Charmeleon",
      image: "charmeleon.png",
      alternatives: [],
    },
    {
      name: "Ivysaur",
      image: "ivysaur.png",
      alternatives: [],
    },
    {
      name: "Wartortle",
      image: "wartortle.png",
      alternatives: [],
    },
    {
      name: "Vaporeon",
      image: "vaporeon.png",
      alternatives: [],
    },
    {
      name: "Jolteon",
      image: "jolteon.png",
      alternatives: [],
    },
    {
      name: "Flareon",
      image: "flareon.png",
      alternatives: [],
    },
    {
      name: "Dragonite",
      image: "dragonite.png",
      alternatives: [],
    },
    {
      name: "Dragonair",
      image: "dragonair.png",
      alternatives: [],
    },
    {
      name: "Dratini",
      image: "dratini.png",
      alternatives: [],
    },
    {
      name: "Vulpix",
      image: "vulpix.png",
      alternatives: [],
    },
    {
      name: "Ponyta",
      image: "ponyta.png",
      alternatives: [],
    },
    {
      name: "Slowpoke",
      image: "slowpoke.png",
      alternatives: [],
    },
    {
      name: "Oddish",
      image: "oddish.png",
      alternatives: [],
    },
    {
      name: "Weedle",
      image: "weedle.png",
      alternatives: [],
    },
    {
      name: "Caterpie",
      image: "caterpie.png",
      alternatives: [],
    },
    {
      name: "Exeggcute",
      image: "exeggcute.png",
      alternatives: [],
    },
    {
      name: "Staryu",
      image: "staryu.png",
      alternatives: [],
    },
    {
      name: "Goldeen",
      image: "goldeen.png",
      alternatives: [],
    },
    {
      name: "Horsea",
      image: "horsea.png",
      alternatives: [],
    },
    {
      name: "Shellder",
      image: "shellder.png",
      alternatives: [],
    },
    {
      name: "Krabby",
      image: "krabby.png",
      alternatives: [],
    },
    {
      name: "Drowzee",
      image: "drowzee.png",
      alternatives: [],
    },
    {
      name: "Koffing",
      image: "koffing.png",
      alternatives: [],
    },
    {
      name: "Grimer",
      image: "grimer.png",
      alternatives: [],
    },
    {
      name: "Paras",
      image: "paras.png",
      alternatives: [],
    },
    {
      name: "Doduo",
      image: "doduo.png",
      alternatives: [],
    },
    {
      name: "Rhyhorn",
      image: "rhyhorn.png",
      alternatives: [],
    },
    {
      name: "Sandshrew",
      image: "sandshrew.png",
      alternatives: [],
    },
    {
      name: "Voltorb",
      image: "voltorb.png",
      alternatives: [],
    },
    {
      name: "Magnemite",
      image: "magnemite.png",
      alternatives: [],
    },
  ],
};

const DisneyCharactersCategory: CategoryMetadata = {
  name: "Postacie Disneya",
  folder: "disney-characters",
  examples: [
    {
      name: "Myszka Miki",
      image: "mickey-mouse.jpg",
      alternatives: ["Mickey Mouse"],
    },
    {
      name: "Myszka Minnie",
      image: "minnie-mouse.jpg",
      alternatives: ["Minnie Mouse"],
    },
    {
      name: "Arielka",
      image: "ariel.jpg",
      alternatives: ["Ariel"],
    },
    {
      name: "Bella",
      image: "belle.jpg",
      alternatives: ["Belle"],
    },
    {
      name: "Kopciuszek",
      image: "cinderella.jpg",
      alternatives: ["Cinderella"],
    },
    {
      name: "Elsa",
      image: "elsa.jpg",
      alternatives: [],
    },
    {
      name: "Anna",
      image: "anna.jpg",
      alternatives: [],
    },
    {
      name: "Królewna Śnieżka",
      image: "snow-white.jpg",
      alternatives: ["Snow White"],
    },
    {
      name: "Dżasmina",
      image: "jasmine.jpg",
      alternatives: ["Jasmine"],
    },
    {
      name: "Mulan",
      image: "mulan.jpg",
      alternatives: [],
    },
    {
      name: "Pocahontas",
      image: "pocahontas.jpg",
      alternatives: [],
    },
    {
      name: "Rapunzel",
      image: "rapunzel.jpg",
      alternatives: [],
    },
    {
      name: "Tiana",
      image: "tiana.jpg",
      alternatives: [],
    },
    {
      name: "Moana",
      image: "moana.jpg",
      alternatives: [],
    },
    {
      name: "Aurora",
      image: "aurora.jpeg",
      alternatives: [],
    },
    {
      name: "Kaczor Donald",
      image: "donald-duck.png",
      alternatives: ["Donald Duck"],
    },
    {
      name: "Goofy",
      image: "goofy.jpg",
      alternatives: [],
    },
    {
      name: "Pluto",
      image: "pluto.png",
      alternatives: [],
    },
    {
      name: "Simba",
      image: "simba.jpg",
      alternatives: [],
    },
    {
      name: "Stitch",
      image: "stitch.jpg",
      alternatives: [],
    },
    {
      name: "Olaf",
      image: "olaf.jpg",
      alternatives: [],
    },
    {
      name: "Dżin",
      image: "genie.jpg",
      alternatives: ["Genie"],
    },
    {
      name: "Aladyn",
      image: "aladdin.jpg",
      alternatives: ["Aladdin"],
    },
    {
      name: "Bestia",
      image: "beast.jpg",
      alternatives: ["Beast"],
    },
    {
      name: "Kapitan Hak",
      image: "captain-hook.jpg",
      alternatives: ["Captain Hook"],
    },
    {
      name: "Dzwoneczek",
      image: "tinker-bell.jpg",
      alternatives: ["Tinker Bell"],
    },
    {
      name: "Peter Pan",
      image: "peter-pan.jpg",
      alternatives: [],
    },
    {
      name: "Timon",
      image: "timon.jpg",
      alternatives: [],
    },
    {
      name: "Pumbaa",
      image: "pumbaa.jpg",
      alternatives: [],
    },
    {
      name: "Scar",
      image: "scar.jpg",
      alternatives: [],
    },
    {
      name: "Mufasa",
      image: "mufasa.jpg",
      alternatives: [],
    },
    {
      name: "Nala",
      image: "nala.jpg",
      alternatives: [],
    },
    {
      name: "Wróżka Chrzestna",
      image: "fairy-godmother.jpg",
      alternatives: ["Fairy Godmother"],
    },
    {
      name: "Gaston",
      image: "gaston.jpg",
      alternatives: [],
    },
    {
      name: "Jafar",
      image: "jafar.jpg",
      alternatives: [],
    },
    {
      name: "Hades",
      image: "hades.jpg",
      alternatives: [],
    },
    {
      name: "Herkules",
      image: "hercules.jpg",
      alternatives: ["Hercules"],
    },
    {
      name: "Tarzan",
      image: "tarzan.jpg",
      alternatives: [],
    },
    {
      name: "Chip i Dale",
      image: "chip-and-dale.jpg",
      alternatives: ["Chip and Dale"],
    },
    {
      name: "Merida",
      image: "merida.jpg",
      alternatives: [],
    },
    {
      name: "Lilo",
      image: "lilo.jpg",
      alternatives: [],
    },
    {
      name: "Kristoff",
      image: "kristoff.jpg",
      alternatives: [],
    },
    {
      name: "Sven",
      image: "sven.jpg",
      alternatives: [],
    },
    {
      name: "Jane",
      image: "jane.jpg",
      alternatives: [],
    },
    {
      name: "Wendy",
      image: "wendy.jpg",
      alternatives: [],
    },
    {
      name: "Abu",
      image: "abu.jpg",
      alternatives: [],
    },
    {
      name: "Fil",
      image: "phil.jpg",
      alternatives: ["Phil"],
    },
    {
      name: "Megara",
      image: "megara.jpg",
      alternatives: [],
    },
  ],
};

const KitchenGadgetsCategory: CategoryMetadata = {
  name: "Gadżety kuchenne",
  folder: "kitchen-gadgets",
  examples: [
    {
      name: "Mikrofalówka",
      image: "microwave.jpg",
      alternatives: ["Microwave"],
    },
    {
      name: "Blender",
      image: "blender.jpg",
      alternatives: [],
    },
    {
      name: "Deska do krojenia",
      image: "cutting-board.jpg",
      alternatives: ["Cutting board"],
    },
    {
      name: "Łopatka",
      image: "spatula.jpg",
      alternatives: ["Spatula"],
    },
    {
      name: "Otwieracz do puszek",
      image: "can-opener.jpg",
      alternatives: ["Can opener"],
    },
    {
      name: "Otwieracz do butelek",
      image: "bottle-opener.jpg",
      alternatives: ["Bottle opener"],
    },
    {
      name: "Miarki",
      image: "measuring-cups.jpg",
      alternatives: ["Measuring cups"],
    },
    {
      name: "Łyżki miarowe",
      image: "measuring-spoons.jpg",
      alternatives: ["Measuring spoons"],
    },
    {
      name: "Trzepaczka",
      image: "whisk.jpg",
      alternatives: ["Whisk"],
    },
    {
      name: "Szczypce",
      image: "tongs.jpg",
      alternatives: ["Tongs"],
    },
    {
      name: "Rękawice kuchenne",
      image: "oven-mitts.jpg",
      alternatives: ["Oven mitts"],
    },
    {
      name: "Durszlak",
      image: "colander.jpg",
      alternatives: ["Colander"],
    },
    {
      name: "Sitko",
      image: "strainer.jpg",
      alternatives: ["Strainer"],
    },
    {
      name: "Blacha do pieczenia",
      image: "baking-sheet.jpg",
      alternatives: ["Baking sheet"],
    },
    {
      name: "Forma do muffinów",
      image: "muffin-tin.jpg",
      alternatives: ["Muffin tin"],
    },
    {
      name: "Obieraczka",
      image: "potato-peeler.jpg",
      alternatives: ["Potato peeler"],
    },
    {
      name: "Nóż do pizzy",
      image: "pizza-cutter.jpg",
      alternatives: ["Pizza cutter"],
    },
    {
      name: "Gałkownica do lodów",
      image: "ice-cream-scoop.jpg",
      alternatives: ["Ice cream scoop"],
    },
    {
      name: "Lejek",
      image: "funnel.jpg",
      alternatives: ["Funnel"],
    },
    {
      name: "Żeliwna patelnia",
      image: "cast-iron-pan.jpg",
      alternatives: ["Cast iron pan"],
    },
    {
      name: "Malakser",
      image: "food-processor.jpg",
      alternatives: ["Food processor"],
    },
    {
      name: "Robot planetarny",
      image: "stand-mixer.jpg",
      alternatives: ["Stand mixer"],
    },
    {
      name: "Mikser ręczny",
      image: "hand-mixer.jpg",
      alternatives: ["Hand mixer"],
    },
    {
      name: "Wolnowar",
      image: "slow-cooker.jpg",
      alternatives: ["Slow cooker"],
    },
    {
      name: "Garnek do ryżu",
      image: "rice-cooker.jpg",
      alternatives: ["Rice cooker"],
    },
    {
      name: "Frytkownica beztłuszczowa",
      image: "air-fryer.jpg",
      alternatives: ["Air fryer"],
    },
    {
      name: "Mini piekarnik",
      image: "toaster-oven.jpg",
      alternatives: ["Toaster oven"],
    },
    {
      name: "French press",
      image: "french-press.jpg",
      alternatives: [],
    },
    {
      name: "Młynek do kawy",
      image: "coffee-grinder.jpg",
      alternatives: ["Coffee grinder"],
    },
    {
      name: "Praska do czosnku",
      image: "garlic-press.jpg",
      alternatives: ["Garlic press"],
    },
    {
      name: "Nożyce kuchenne",
      image: "kitchen-shears.jpg",
      alternatives: ["Kitchen shears"],
    },
    {
      name: "Wałek do ciasta",
      image: "rolling-pin.jpg",
      alternatives: ["Rolling pin"],
    },
    {
      name: "Tarka do sera",
      image: "cheese-grater.jpg",
      alternatives: ["Cheese grater"],
    },
    {
      name: "Wirówka do sałaty",
      image: "salad-spinner.jpg",
      alternatives: ["Salad spinner"],
    },
    {
      name: "Termometr cyfrowy",
      image: "digital-thermometer.jpg",
      alternatives: ["Digital thermometer"],
    },
    {
      name: "Szybkowar",
      image: "pressure-cookier.png",
      alternatives: ["Pressure cooker"],
    },
    {
      name: "Sokowirówka",
      image: "juicer.jpg",
      alternatives: ["Juicer"],
    },
    {
      name: "Blender ręczny",
      image: "immersion-blender.jpg",
      alternatives: ["Immersion blender"],
    },
    {
      name: "Waga kuchenna",
      image: "kitchen-scale.jpg",
      alternatives: ["Kitchen scale"],
    },
    {
      name: "Tłuczek do mięsa",
      image: "meat-tenderizer.jpg",
      alternatives: ["Meat tenderizer"],
    },
    {
      name: "Moździerz",
      image: "mortar-and-pestle.jpg",
      alternatives: ["Mortar and pestle"],
    },
    {
      name: "Pędzelek kuchenny",
      image: "pastry-brush.jpg",
      alternatives: ["Pastry brush"],
    },
    {
      name: "Osłona na patelnię",
      image: "splatter-screen.jpg",
      alternatives: ["Splatter screen"],
    },
    {
      name: "Młynek do przypraw",
      image: "spice-grinder.jpg",
      alternatives: ["Spice grinder"],
    },
    {
      name: "Mandolina",
      image: "mandoline-slicer.jpg",
      alternatives: ["Mandoline slicer"],
    },
    {
      name: "Tarka do skórki cytrusów",
      image: "citrus-zester.jpg",
      alternatives: ["Citrus zester"],
    },
    {
      name: "Separator do jajek",
      image: "egg-separator.jpg",
      alternatives: ["Egg separator"],
    },
  ],
};

const MathCategory: CategoryMetadata = {
  name: "Matematyka",
  folder: "math",
  examples: [
    {
      name: "12",
      text: "7 + 5",
      alternatives: [],
    },
    {
      name: "9",
      text: "18 - 9",
      alternatives: [],
    },
    {
      name: "25",
      text: "16 + 9",
      alternatives: [],
    },
    {
      name: "17",
      text: "39 - 22",
      alternatives: [],
    },
    {
      name: "26",
      text: "12 + 14",
      alternatives: [],
    },
    {
      name: "13",
      text: "30 - 17",
      alternatives: [],
    },
    {
      name: "40",
      text: "22 + 18",
      alternatives: [],
    },
    {
      name: "24",
      text: "57 - 33",
      alternatives: [],
    },
    {
      name: "24",
      text: "68 - 44",
      alternatives: [],
    },
    {
      name: "42",
      text: "6 × 7",
      alternatives: [],
    },
    {
      name: "72",
      text: "8 × 9",
      alternatives: [],
    },
    {
      name: "56",
      text: "7 × 8",
      alternatives: [],
    },
    {
      name: "54",
      text: "9 × 6",
      alternatives: [],
    },
    {
      name: "40",
      text: "8 × 5",
      alternatives: [],
    },
    {
      name: "36",
      text: "9 × 4",
      alternatives: [],
    },
    {
      name: "60",
      text: "5 × 12",
      alternatives: [],
    },
    {
      name: "36",
      text: "12 × 3",
      alternatives: [],
    },
    {
      name: "66",
      text: "6 × 11",
      alternatives: [],
    },
    {
      name: "121",
      text: "11 × 11",
      alternatives: [],
    },
    {
      name: "9",
      text: "45 ÷ 5",
      alternatives: [],
    },
    {
      name: "7",
      text: "56 ÷ 8",
      alternatives: [],
    },
    {
      name: "9",
      text: "81 ÷ 9",
      alternatives: [],
    },
    {
      name: "9",
      text: "90 ÷ 10",
      alternatives: [],
    },
    {
      name: "16",
      text: "64 ÷ 4",
      alternatives: [],
    },
    {
      name: "16",
      text: "48 ÷ 3",
      alternatives: [],
    },
    {
      name: "20",
      text: "120 ÷ 6",
      alternatives: [],
    },
    {
      name: "25",
      text: "50 ÷ 2",
      alternatives: [],
    },
    {
      name: "12",
      text: "84 ÷ 7",
      alternatives: [],
    },
    {
      name: "8",
      text: "96 ÷ 12",
      alternatives: [],
    },
    {
      name: "12",
      text: "144 ÷ 12",
      alternatives: [],
    },
    {
      name: "61",
      text: "25 + 36",
      alternatives: [],
    },
    {
      name: "41",
      text: "14 + 27",
      alternatives: [],
    },
    {
      name: "73",
      text: "41 + 32",
      alternatives: [],
    },
    {
      name: "75",
      text: "28 + 47",
      alternatives: [],
    },
    {
      name: "41",
      text: "15 + 26",
      alternatives: [],
    },
    {
      name: "51",
      text: "34 + 17",
      alternatives: [],
    },
    {
      name: "51",
      text: "23 + 28",
      alternatives: [],
    },
    {
      name: "52",
      text: "33 + 19",
      alternatives: [],
    },
    {
      name: "52",
      text: "100 - 48",
      alternatives: [],
    },
    {
      name: "35",
      text: "63 - 28",
      alternatives: [],
    },
    {
      name: "27",
      text: "72 - 45",
      alternatives: [],
    },
    {
      name: "29",
      text: "58 - 29",
      alternatives: [],
    },
    {
      name: "39",
      text: "95 - 56",
      alternatives: [],
    },
    {
      name: "46",
      text: "70 - 24",
      alternatives: [],
    },
    {
      name: "63",
      text: "82 - 19",
      alternatives: [],
    },
    {
      name: "52",
      text: "4 × 13",
      alternatives: [],
    },
    {
      name: "42",
      text: "3 × 14",
      alternatives: [],
    },
    {
      name: "11",
      text: "132 ÷ 12",
      alternatives: [],
    },
  ],
};

const JunkDrawerCategory: CategoryMetadata = {
  name: "Szuflada z rupieciami",
  folder: "junk-drawer",
  examples: [
    {
      name: "Nożyczki",
      image: "scissors.jpg",
      alternatives: ["Scissors"],
    },
    {
      name: "Długopisy",
      image: "pens.jpg",
      alternatives: ["Pens"],
    },
    {
      name: "Ołówki",
      image: "pencils.jpg",
      alternatives: ["Pencils"],
    },
    {
      name: "Spinacze",
      image: "paper-clips.jpg",
      alternatives: ["Paper clips"],
    },
    // {
    //   name: "Baterie AA",
    //   image: "aa-batteries.jpg",
    //   alternatives: ["AA batteries"],
    // },
    // {
    //   name: "Baterie AAA",
    //   image: "aaa-batteries.jpg",
    //   alternatives: ["AAA batteries"],
    // },
    {
      name: "Stare baterie",
      image: "old-batteries.jpg",
      alternatives: ["Old batteries"],
    },
    {
      name: "Drobne",
      image: "loose-change.jpg",
      alternatives: ["Loose change"],
    },
    {
      name: "Karteczki samoprzylepne",
      image: "post-it-notes.jpg",
      alternatives: ["Post-it notes"],
    },
    {
      name: "Pinezki",
      image: "thumbtacks.jpg",
      alternatives: ["Thumbtacks"],
    },
    {
      name: "Kable USB",
      image: "usb-cables.jpg",
      alternatives: ["USB cables"],
    },
    {
      name: "Zepsute ładowarki",
      image: "broken-phone-chargers.jpg",
      alternatives: ["Broken phone chargers"],
    },
    {
      name: "Przypadkowe klucze",
      image: "random-keys.jpg",
      alternatives: ["Random keys"],
    },
    // {
    //   name: "Taśma klejąca",
    //   image: "adhesive-tape.jpg",
    //   alternatives: ["Adhesive tape"],
    // },
    {
      name: "Kleje w sztyfcie",
      image: "glue-sticks.jpg",
      alternatives: ["Glue sticks"],
    },
    {
      name: "Agrafki",
      image: "safety-pins.jpg",
      alternatives: ["Safety pins"],
    },
    {
      name: "Klipsy biurowe",
      image: "binder-clips.jpg",
      alternatives: ["Binder clips"],
    },
    {
      name: "Gumki recepturki",
      image: "rubber-bands.jpg",
      alternatives: ["Rubber bands"],
    },
    {
      name: "Mała latarka",
      image: "small-flashlight.jpg",
      alternatives: ["Small flashlight"],
    },
    {
      name: "Zapałki",
      image: "matches.jpg",
      alternatives: ["Matches"],
    },
    {
      name: "Zapalniczki",
      image: "lighters.jpg",
      alternatives: ["Lighters"],
    },
    {
      name: "Śrubokręt",
      image: "screwdriver.jpg",
      alternatives: ["Screwdriver"],
    },
    {
      name: "Otwieracz do butelek",
      image: "bottle-opener.jpg",
      alternatives: ["Bottle opener"],
    },
    {
      name: "Notes",
      image: "notepad.jpg",
      alternatives: ["Notepad"],
    },
    {
      name: "Breloki",
      image: "keychains.jpg",
      alternatives: ["Keychains"],
    },
    {
      name: "Karty do gry",
      image: "playing-cards.jpg",
      alternatives: ["Playing cards"],
    },
    {
      name: "Pendrive'y",
      image: "flash-drives.jpg",
      alternatives: ["Flash drives"],
    },
    {
      name: "Klipsy do paczek",
      image: "chip-clips.jpg",
      alternatives: ["Chip clips"],
    },
    {
      name: "Stare karty podarunkowe",
      image: "old-gift-cards.jpg",
      alternatives: ["Old gift cards"],
    },
    {
      name: "Druciki do worków",
      image: "twist-ties.jpg",
      alternatives: ["Twist ties"],
    },
    {
      name: "Scyzoryk szwajcarski",
      image: "swiss-army-knife.jpg",
      alternatives: ["Swiss army knife"],
    },
    {
      name: "Taśma naprawcza",
      image: "duct-tape.jpg",
      alternatives: ["Duct tape"],
    },
    {
      name: "Plastikowe sztućce",
      image: "plastic-utensils.jpg",
      alternatives: ["Plastic utensils"],
    },
    {
      name: "Klamerki",
      image: "clothespins.jpg",
      alternatives: ["Clothespins"],
    },
    {
      name: "Stare paragony",
      image: "old-receipts.jpg",
      alternatives: ["Old receipts"],
    },
    {
      name: "Przeterminowane kupony",
      image: "expired-coupons.jpg",
      alternatives: ["Expired coupons"],
    },
    {
      name: "Podkładki",
      image: "coasters.jpg",
      alternatives: ["Coasters"],
    },
    {
      name: "Stare magnesy",
      image: "old-magnets.jpg",
      alternatives: ["Old magnets"],
    },
    {
      name: "Stare okulary przeciwsłoneczne",
      image: "old-sunglasses.jpg",
      alternatives: ["Old sunglasses"],
    },
    // {
    //   name: "Nożyk",
    //   image: "pocket-knife.jpg",
    //   alternatives: ["Pocket knife"],
    // },
    {
      name: "Portmonetka",
      image: "coin-purse.jpg",
      alternatives: ["Coin purse"],
    },
    {
      name: "Gumowe rękawiczki",
      image: "rubber-gloves.jpg",
      alternatives: ["Rubber gloves"],
    },
    // {
    //   name: "Ogarki",
    //   image: "candle-stubs.jpg",
    //   alternatives: ["Candle stubs"],
    // },
    {
      name: "Masa mocująca",
      image: "sticky-tack.jpg",
      alternatives: ["Sticky tack"],
    },
    {
      name: "Sznurek",
      image: "twine.jpg",
      alternatives: ["Twine"],
    },
    {
      name: "Zapasowe guziki",
      image: "spare-buttons.jpg",
      alternatives: ["Spare buttons"],
    },
    {
      name: "Wyschnięte flamastry",
      image: "dried-out-markers.jpg",
      alternatives: ["Dried-out markers"],
    },
    {
      name: "Klucze imbusowe",
      image: "allen-wrenches.jpg",
      alternatives: ["Allen wrenches"],
    },
    {
      name: "Luźne śrubki",
      image: "loose-screws.jpg",
      alternatives: ["Loose screws"],
    },
    {
      name: "Zapasowe bezpieczniki",
      image: "spare-fuses.jpg",
      alternatives: ["Spare fuses"],
    },
    {
      name: "Podkładki filcowe",
      image: "felt-pads.jpg",
      alternatives: ["Felt pads"],
    },
    // {
    //   name: "Gumowy korek",
    //   image: "rubber-stopper.jpg",
    //   alternatives: ["Rubber stopper"],
    // },
    {
      name: "Świeczki",
      image: "candles.jpg",
      alternatives: ["Candles"],
    },
  ],
};

const LaundryCategory: CategoryMetadata = {
  name: "Pranie",
  folder: "laundry",
  examples: [
    {
      name: "Proszek do prania",
      image: "laundry-detergent.jpg",
      alternatives: ["Laundry detergent"],
    },
    {
      name: "Pralka",
      image: "washing-machine.jpg",
      alternatives: ["Washing machine"],
    },
    {
      name: "Suszarka",
      image: "dryer.jpg",
      alternatives: ["Dryer"],
    },
    {
      name: "Kosz na pranie",
      image: "laundry-basket.jpg",
      alternatives: ["Laundry basket"],
    },
    // {
    //   name: "Kosz na brudy",
    //   image: "hamper.jpg",
    //   alternatives: ["Hamper"],
    // },
    {
      name: "Chusteczki do suszarki",
      image: "dryer-sheets.jpg",
      alternatives: ["Dryer sheets"],
    },
    {
      name: "Płyn do płukania",
      image: "fabric-softener.jpg",
      alternatives: ["Fabric softener"],
    },
    {
      name: "Żelazko",
      image: "iron.jpg",
      alternatives: ["Iron"],
    },
    {
      name: "Deska do prasowania",
      image: "ironing-board.jpg",
      alternatives: ["Ironing board"],
    },
    {
      name: "Wybielacz",
      image: "bleach.jpg",
      alternatives: ["Bleach"],
    },
    // {
    //   name: "Odplamiacz",
    //   image: "stain-remover.jpg",
    //   alternatives: ["Stain remover"],
    // },
    {
      name: "Wałek do ubrań",
      image: "lint-roller.jpg",
      alternatives: ["Lint roller"],
    },
    {
      name: "Wieszaki",
      image: "clothing-hangers.jpg",
      alternatives: ["Clothing hangers"],
    },
    {
      name: "Kapsułki do prania",
      image: "detergent-pods.jpg",
      alternatives: ["Detergent pods"],
    },
    {
      name: "Filtr kłaczków",
      image: "lint-trap.jpg",
      alternatives: ["Lint trap"],
    },
    {
      name: "Klamerki",
      image: "clothespins.jpg",
      alternatives: ["Clothespins"],
    },
    {
      name: "Suszarka na pranie",
      image: "drying-rack.jpg",
      alternatives: ["Drying rack"],
    },
    {
      name: "Spray wygładzający",
      image: "wrinkle-releaser-spray.jpg",
      alternatives: ["Wrinkle releaser spray"],
    },
    {
      name: "Worek na delikatne tkaniny",
      image: "delicates-bag.jpg",
      alternatives: ["Delicates bag"],
    },
    {
      name: "Siatkowy worek do prania",
      image: "mesh-laundry-bag.jpg",
      alternatives: ["Mesh laundry bag"],
    },
    {
      name: "Parownica",
      image: "steamer.jpg",
      alternatives: ["Steamer"],
    },
    {
      name: "Chusteczki wyłapujące kolor",
      image: "color-catcher-sheets.jpg",
      alternatives: ["Color catcher sheets"],
    },
    {
      name: "Wełniane kule do suszarki",
      image: "wool-dryer-balls.jpg",
      alternatives: ["Wool dryer balls"],
    },
    // {
    //   name: "Odświeżacz do tkanin",
    //   image: "fabric-refresher.jpg",
    //   alternatives: ["Fabric refresher"],
    // },
    {
      name: "Perełki zapachowe",
      image: "scent-boosters.jpg",
      alternatives: ["Scent boosters"],
    },
    {
      name: "Worek z pralni chemicznej",
      image: "dry-cleaning-bag.jpg",
      alternatives: ["Dry cleaning bag"],
    },
    {
      name: "Miska do namaczania",
      image: "soaking-basin.jpg",
      alternatives: ["Soaking basin"],
    },
    {
      name: "Mydło do prania ręcznego",
      image: "hand-wash-soap.jpg",
      alternatives: ["Hand-wash soap"],
    },
    // {
    //   name: "Płyn dezynfekujący do prania",
    //   image: "laundry-sanitizer.jpg",
    //   alternatives: ["Laundry sanitizer"],
    // },
    {
      name: "Odplamiacz w pisaku",
      image: "spot-remover-pen.jpg",
      alternatives: ["Spot remover pen"],
    },
    {
      name: "Marker do tkanin",
      image: "laundry-marker.jpg",
      alternatives: ["Laundry marker"],
    },
    {
      name: "Szczotka do ubrań",
      image: "clothes-brush.jpg",
      alternatives: ["Clothes brush"],
    },
    {
      name: "Miarka do proszku",
      image: "laundry-scoop.jpg",
      alternatives: ["Laundry scoop"],
    },
    {
      name: "Deska do składania ubrań",
      image: "folding-board.jpg",
      alternatives: ["Folding board"],
    },
    {
      name: "Spray antystatyczny",
      image: "static-guard.jpg",
      alternatives: ["Static guard"],
    },
    // {
    //   name: "Kosz na pranie na kółkach",
    //   image: "laundry-basket-wheels.jpg",
    //   alternatives: ["Laundry basket wheels"],
    // },
    // {
    //   name: "Płyn do tkanin delikatnych",
    //   image: "delicate-detergent.jpg",
    //   alternatives: ["Delicate detergent"],
    // },
    // {
    //   name: "Proszek dla niemowląt",
    //   image: "baby-detergent.jpg",
    //   alternatives: ["Baby detergent"],
    // },
    // {
    //   name: "Płyn do puchu",
    //   image: "down-detergent.jpg",
    //   alternatives: ["Down detergent"],
    // },
    // {
    //   name: "Krochmal w sprayu",
    //   image: "starch-spray.jpg",
    //   alternatives: ["Starch spray"],
    // },
    {
      name: "Minutnik",
      image: "laundry-timer.jpg",
      alternatives: ["Laundry timer"],
    },
    {
      name: "Przybornik do szycia",
      image: "clothing-repair-kit.jpg",
      alternatives: ["Clothing repair kit"],
    },
    {
      name: "Zapasowe guziki",
      image: "spare-buttons.jpg",
      alternatives: ["Spare buttons"],
    },
    {
      name: "Miarka do płynu",
      image: "detergent-measuring-cup.jpg",
      alternatives: ["Detergent measuring cup"],
    },
    {
      name: "Frotowe ścierki",
      image: "terry-cloth-rags.jpg",
      alternatives: ["Terry cloth rags"],
    },
    {
      name: "Spinacze do ubrań",
      image: "clothing-clips.jpg",
      alternatives: ["Clothing clips"],
    },
    {
      name: "Sznur do bielizny",
      image: "clothesline.jpg",
      alternatives: ["Clothesline"],
    },
    {
      name: "Złożone ręczniki",
      image: "folded-towels.jpg",
      alternatives: ["Folded towels"],
    },
  ],
};

const PopDivasCategory: CategoryMetadata = {
  name: "Diwy popu",
  folder: "pop-divas",
  examples: [
    {
      name: "Taylor Swift",
      image: "taylor-swift.jpg",
      alternatives: [],
    },
    {
      name: "Beyoncé",
      image: "beyonce.jpg",
      alternatives: [],
    },
    {
      name: "Ariana Grande",
      image: "ariana-grande.jpg",
      alternatives: [],
    },
    {
      name: "Rihanna",
      image: "rihanna.jpg",
      alternatives: [],
    },
    {
      name: "Lady Gaga",
      image: "lady-gaga.jpg",
      alternatives: [],
    },
    {
      name: "Katy Perry",
      image: "katy-perry.jpg",
      alternatives: [],
    },
    {
      name: "Miley Cyrus",
      image: "miley-cyrus.jpg",
      alternatives: [],
    },
    {
      name: "Selena Gomez",
      image: "selena-gomez.jpg",
      alternatives: [],
    },
    {
      name: "Adele",
      image: "adele.jpg",
      alternatives: [],
    },
    {
      name: "Billie Eilish",
      image: "billie-eilish.jpg",
      alternatives: [],
    },
    {
      name: "Olivia Rodrigo",
      image: "olivia-rodrigo.jpg",
      alternatives: [],
    },
    {
      name: "Doja Cat",
      image: "doja-cat.jpg",
      alternatives: [],
    },
    {
      name: "Dua Lipa",
      image: "dua-lipa.jpg",
      alternatives: [],
    },
    {
      name: "Nicki Minaj",
      image: "nicki-minaj.jpg",
      alternatives: [],
    },
    {
      name: "Lizzo",
      image: "lizzo.jpg",
      alternatives: [],
    },
    {
      name: "Madonna",
      image: "madonna.jpg",
      alternatives: [],
    },
    {
      name: "Mariah Carey",
      image: "mariah-carey.jpg",
      alternatives: [],
    },
    {
      name: "Whitney Houston",
      image: "whitney-houston.jpg",
      alternatives: [],
    },
    {
      name: "Britney Spears",
      image: "britney-spears.jpg",
      alternatives: [],
    },
    {
      name: "Christina Aguilera",
      image: "christina-aguilera.jpg",
      alternatives: [],
    },
    {
      name: "Celine Dion",
      image: "celine-dion.jpg",
      alternatives: [],
    },
    {
      name: "Jennifer Lopez",
      image: "jennifer-lopez.jpg",
      alternatives: [],
    },
    {
      name: "Shakira",
      image: "shakira.jpg",
      alternatives: [],
    },
    {
      name: "Pink",
      image: "pink.jpg",
      alternatives: [],
    },
    {
      name: "Halsey",
      image: "halsey.jpg",
      alternatives: [],
    },
    {
      name: "Kesha",
      image: "kesha.jpg",
      alternatives: [],
    },
    {
      name: "Demi Lovato",
      image: "demi-lovato.jpg",
      alternatives: [],
    },
    {
      name: "Camila Cabello",
      image: "camila-cabello.jpg",
      alternatives: [],
    },
    {
      name: "Avril Lavigne",
      image: "avril-lavigne.jpg",
      alternatives: [],
    },
    {
      name: "Sia",
      image: "sia.jpg",
      alternatives: [],
    },
    {
      name: "Alicia Keys",
      image: "alicia-keys.jpg",
      alternatives: [],
    },
    {
      name: "Janet Jackson",
      image: "janet-jackson.jpg",
      alternatives: [],
    },
    {
      name: "Fergie",
      image: "fergie.jpg",
      alternatives: [],
    },
    {
      name: "Ellie Goulding",
      image: "ellie-goulding.jpg",
      alternatives: [],
    },
    {
      name: "Hayley Williams",
      image: "hayley-williams.jpg",
      alternatives: [],
    },
    {
      name: "Florence Welch",
      image: "florence-welch.jpg",
      alternatives: [],
    },
    {
      name: "Janelle Monáe",
      image: "janelle-monae.jpg",
      alternatives: [],
    },
    {
      name: "Charli XCX",
      image: "charli-xcx.jpg",
      alternatives: [],
    },
    {
      name: "Grimes",
      image: "grimes.jpg",
      alternatives: [],
    },
    {
      name: "Chloe Bailey",
      image: "chloe-bailey.jpg",
      alternatives: [],
    },
    {
      name: "Jessie J",
      image: "jessie-j.jpg",
      alternatives: [],
    },
    {
      name: "Kylie Minogue",
      image: "kylie-minogue.jpg",
      alternatives: [],
    },
    {
      name: "Ashanti",
      image: "ashanti.jpg",
      alternatives: [],
    },
    {
      name: "Bonnie Tyler",
      image: "bonnie-tyler.jpg",
      alternatives: [],
    },
    {
      name: "Tinashe",
      image: "tinashe.jpg",
      alternatives: [],
    },
    {
      name: "Tove Lo",
      image: "tove-lo.jpg",
      alternatives: [],
    },
    {
      name: "Rosalía",
      image: "rosalia.jpg",
      alternatives: [],
    },
    {
      name: "Chappell Roan",
      image: "chappell-roan.jpg",
      alternatives: [],
    },
    {
      name: "Normani",
      image: "normani.jpg",
      alternatives: [],
    },
  ],
};

const ChicagoTouristStuffCategory: CategoryMetadata = {
  name: "Atrakcje Chicago",
  folder: "chicago-tourist-stuff",
  examples: [
    {
      name: "Cloud Gate (The Bean)",
      image: "cloud-gate-the-bean.jpg",
      alternatives: [],
    },
    {
      name: "Navy Pier",
      image: "navy-pier.jpg",
      alternatives: [],
    },
    {
      name: "Millennium Park",
      image: "millennium-park.jpg",
      alternatives: [],
    },
    {
      name: "Wrigley Field",
      image: "wrigley-field.jpg",
      alternatives: [],
    },
    {
      name: "The Magnificent Mile",
      image: "the-magnificent-mile.jpg",
      alternatives: [],
    },
    {
      name: "Shedd Aquarium",
      image: "shedd-aquarium.jpg",
      alternatives: [],
    },
    {
      name: "Field Museum",
      image: "field-museum.jpg",
      alternatives: [],
    },
    {
      name: "Art Institute of Chicago",
      image: "art-institute-of-chicago.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Riverwalk",
      image: "chicago-riverwalk.jpg",
      alternatives: [],
    },
    {
      name: "Buckingham Fountain",
      image: "buckingham-fountain.jpg",
      alternatives: [],
    },
    {
      name: "Wieża ciśnień w Chicago",
      image: "chicago-water-tower.jpg",
      alternatives: ["Chicago Water Tower"],
    },
    {
      name: "Soldier Field",
      image: "soldier-field.jpg",
      alternatives: [],
    },
    {
      name: "Muzeum Nauki i Przemysłu",
      image: "museum-of-science-and-industry.jpg",
      alternatives: ["Museum of Science and Industry"],
    },
    {
      name: "Adler Planetarium",
      image: "adler-planetarium.jpg",
      alternatives: [],
    },
    {
      name: "Zoo w Lincoln Park",
      image: "lincoln-park-zoo.jpg",
      alternatives: ["Lincoln Park Zoo"],
    },
    {
      name: "Grant Park",
      image: "grant-park.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Theatre",
      image: "chicago-theatre.jpg",
      alternatives: [],
    },
    {
      name: "Rejs architektoniczny",
      image: "architectural-boat-tour.jpg",
      alternatives: ["Architectural Boat Tour"],
    },
    {
      name: "Maggie Daley Park",
      image: "maggie-daley-park.jpg",
      alternatives: [],
    },
    {
      name: "360 Chicago",
      image: "360-chicago.jpg",
      alternatives: [],
    },
    {
      name: "Chicago Cultural Center",
      image: "chicago-cultural-center.jpg",
      alternatives: [],
    },
    {
      name: "Muzeum Historii Chicago",
      image: "chicago-history-museum.jpg",
      alternatives: ["Chicago History Museum"],
    },
    {
      name: "Second City",
      image: "second-city.jpg",
      alternatives: [],
    },
    {
      name: "Blue Man Group",
      image: "blue-man-group.jpg",
      alternatives: [],
    },
    {
      name: "Portillo's",
      image: "portillos.jpg",
      alternatives: [],
    },
    {
      name: "Garrett Popcorn",
      image: "garrett-popcorn.jpg",
      alternatives: [],
    },
    {
      name: "Gino's East",
      image: "ginos-east.jpg",
      alternatives: [],
    },
    {
      name: "Billy Goat Tavern",
      image: "billy-goat-tavern.jpg",
      alternatives: [],
    },
    // {
    //   name: "Budki z hot dogami w Chicago",
    //   image: "chicago-hot-dog-stands.jpg",
    //   alternatives: ["Chicago Hot Dog stands"],
    // },
    {
      name: "Diabelski młyn na Navy Pier",
      image: "ferris-wheel-at-navy-pier.jpg",
      alternatives: ["Ferris wheel at Navy Pier"],
    },
    {
      name: "Zoo Brookfield",
      image: "brookfield-zoo.jpg",
      alternatives: ["Brookfield Zoo"],
    },
    {
      name: "Ogród Botaniczny w Chicago",
      image: "chicago-botanic-garden.jpg",
      alternatives: ["Chicago Botanic Garden"],
    },
    {
      name: "Chicago Lakefront Trail",
      image: "chicago-lakefront-trail.jpg",
      alternatives: [],
    },
    {
      name: "The 606 Trail",
      image: "the-606-trail.jpg",
      alternatives: [],
    },
    {
      name: "ChinaTown Square",
      image: "chinatown-square.jpg",
      alternatives: [],
    },
    // {
    //   name: "Maxwell Street Market",
    //   image: "maxwell-street-market.jpg",
    //   alternatives: [],
    // },
    {
      name: "Promontory Point",
      image: "promontory-point.jpg",
      alternatives: [],
    },
    {
      name: "Calder's Flamingo",
      image: "calders-flamingo.jpg",
      alternatives: [],
    },
    {
      name: "The Green Mill",
      image: "the-green-mill.jpg",
      alternatives: [],
    },
    {
      name: "Rowery Divvy",
      image: "divvy-bikes.jpg",
      alternatives: ["Divvy bikes"],
    },
    {
      name: "Metra Electric line",
      image: "metra-electric-line.jpg",
      alternatives: [],
    },
    // {
    //   name: "Chicago Pedway",
    //   image: "chicago-pedway.jpg",
    //   alternatives: [],
    // },
    {
      name: "Garfield Park Conservatory",
      image: "garfield-park-conservatory.jpg",
      alternatives: [],
    },
    // {
    //   name: "Taras na dachu The Robey",
    //   image: "the-robey-rooftop.jpg",
    //   alternatives: ["The Robey rooftop"],
    // },
    // {
    //   name: "The Violet Hour",
    //   image: "the-violet-hour.jpg",
    //   alternatives: [],
    // },
    // {
    //   name: "Andersonville Clark St.",
    //   image: "andersonville-clark-st.jpg",
    //   alternatives: [],
    // },
    // {
    //   name: "Muzeum Pizzy w Chicago (dawne)",
    //   image: "chicago-pizza-museum-former.jpg",
    //   alternatives: ["Chicago Pizza Museum (former)"],
    // },
    {
      name: "Shakespeare Theater Navy Pier",
      image: "shakespeare-theater-navy-pier.jpg",
      alternatives: [],
    },
    {
      name: "Willis Tower Skydeck",
      image: "willis-tower-skydeck.jpg",
      alternatives: [],
    },
  ],
};

const AppsCategory: CategoryMetadata = {
  name: "Aplikacje",
  folder: "apps",
  examples: [
    {
      name: "Instagram",
      image: "instagram.png",
      alternatives: [],
    },
    {
      name: "Facebook",
      image: "facebook.png",
      alternatives: [],
    },
    {
      name: "YouTube",
      image: "youtube.png",
      alternatives: [],
    },
    {
      name: "TikTok",
      image: "tiktok.png",
      alternatives: [],
    },
    {
      name: "Snapchat",
      image: "snapchat.png",
      alternatives: [],
    },
    {
      name: "Twitter",
      image: "twitter.png",
      alternatives: [],
    },
    {
      name: "WhatsApp",
      image: "whatsapp.png",
      alternatives: [],
    },
    {
      name: "Netflix",
      image: "netflix.png",
      alternatives: [],
    },
    {
      name: "Spotify",
      image: "spotify.png",
      alternatives: [],
    },
    {
      name: "Amazon",
      image: "amazon.png",
      alternatives: [],
    },
    {
      name: "Gmail",
      image: "gmail.png",
      alternatives: [],
    },
    {
      name: "Google Maps",
      image: "google-maps.png",
      alternatives: [],
    },
    {
      name: "Uber",
      image: "uber.png",
      alternatives: [],
    },
    {
      name: "Venmo",
      image: "venmo.png",
      alternatives: [],
    },
    {
      name: "PayPal",
      image: "paypal.png",
      alternatives: [],
    },
    {
      name: "Zoom",
      image: "zoom.png",
      alternatives: [],
    },
    {
      name: "DoorDash",
      image: "doordash.png",
      alternatives: [],
    },
    {
      name: "Grubhub",
      image: "grubhub.png",
      alternatives: [],
    },
    {
      name: "Instacart",
      image: "instacart.png",
      alternatives: [],
    },
    {
      name: "Cash App",
      image: "cash-app.png",
      alternatives: [],
    },
    {
      name: "Reddit",
      image: "reddit.png",
      alternatives: [],
    },
    {
      name: "Pinterest",
      image: "pinterest.png",
      alternatives: [],
    },
    {
      name: "LinkedIn",
      image: "linkedin.png",
      alternatives: [],
    },
    {
      name: "Discord",
      image: "discord.png",
      alternatives: [],
    },
    {
      name: "Twitch",
      image: "twitch.png",
      alternatives: [],
    },
    {
      name: "Apple Maps",
      image: "apple-maps.png",
      alternatives: [],
    },
    {
      name: "Messenger",
      image: "messenger.png",
      alternatives: [],
    },
    {
      name: "Prime Video",
      image: "prime-video.jpg",
      alternatives: [],
    },
    {
      name: "Target",
      image: "target.png",
      alternatives: [],
    },
    {
      name: "Walmart",
      image: "walmart.png",
      alternatives: [],
    },
    {
      name: "ESPN",
      image: "espn.png",
      alternatives: [],
    },
    {
      name: "Disney",
      image: "disney.jpg",
      alternatives: [],
    },
    {
      name: "Kindle",
      image: "kindle.png",
      alternatives: [],
    },
    {
      name: "Shazam",
      image: "shazam.png",
      alternatives: [],
    },
    {
      name: "Roku",
      image: "roku.png",
      alternatives: [],
    },
    {
      name: "Slack",
      image: "slack.png",
      alternatives: [],
    },
    {
      name: "Microsoft Teams",
      image: "microsoft-teams.png",
      alternatives: [],
    },
    {
      name: "Robinhood",
      image: "robinhood.png",
      alternatives: [],
    },
    {
      name: "Fidelity",
      image: "fidelity.png",
      alternatives: [],
    },
    {
      name: "Southwest",
      image: "southwest.png",
      alternatives: [],
    },
    {
      name: "United Airlines",
      image: "united-airlines.png",
      alternatives: [],
    },
    {
      name: "Strava",
      image: "strava.png",
      alternatives: [],
    },
    {
      name: "Trello",
      image: "trello.png",
      alternatives: [],
    },
    {
      name: "Pandora",
      image: "pandora.png",
      alternatives: [],
    },
    {
      name: "Notion",
      image: "notion.png",
      alternatives: [],
    },
    {
      name: "Telegram",
      image: "telegram.png",
      alternatives: [],
    },
    {
      name: "Signal",
      image: "signal.png",
      alternatives: [],
    },
    {
      name: "WeChat",
      image: "wechat.png",
      alternatives: [],
    },
    {
      name: "Partiful",
      image: "partiful.png",
      alternatives: [],
    },
  ],
};

const BoardGamesCategory: CategoryMetadata = {
  name: "Gry planszowe",
  folder: "board-games",
  examples: [
    {
      name: "Monopoly",
      image: "monopoly.jpg",
      alternatives: [],
    },
    {
      name: "Scrabble",
      image: "scrabble.jpg",
      alternatives: [],
    },
    {
      name: "Szachy",
      image: "chess.jpg",
      alternatives: ["Chess"],
    },
    {
      name: "Cluedo",
      image: "clue.jpg",
      alternatives: ["Clue"],
    },
    {
      name: "Gra w życie",
      image: "the-game-of-life.jpg",
      alternatives: ["The Game of Life"],
    },
    {
      name: "Statki",
      image: "battleship.jpg",
      alternatives: ["Battleship"],
    },
    {
      name: "Czwórki",
      image: "connect-four.jpg",
      alternatives: ["Connect Four"],
    },
    {
      name: "Operacja",
      image: "operation.jpg",
      alternatives: ["Operation"],
    },
    {
      name: "Sorry!",
      image: "sorry.jpg",
      alternatives: ["Sorry"],
    },
    {
      name: "Risk",
      image: "risk.jpg",
      alternatives: [],
    },
    {
      name: "Trivial Pursuit",
      image: "trivial-pursuit.jpg",
      alternatives: [],
    },
    {
      name: "Kalambury (Pictionary)",
      image: "pictionary.jpg",
      alternatives: ["Pictionary"],
    },
    {
      name: "Taboo",
      image: "taboo.jpg",
      alternatives: [],
    },
    {
      name: "Scattergories",
      image: "scattergories.jpg",
      alternatives: [],
    },
    {
      name: "Twister",
      image: "twister.jpg",
      alternatives: [],
    },
    {
      name: "Yahtzee",
      image: "yahtzee.jpg",
      alternatives: [],
    },
    {
      name: "Kraina cukierków",
      image: "candy-land.jpg",
      alternatives: ["Candy Land"],
    },
    {
      name: "Węże i drabiny",
      image: "chutes-and-ladders.jpg",
      alternatives: ["Chutes and Ladders"],
    },
    {
      name: "Głodne hipcie",
      image: "hungry-hungry-hippos.jpg",
      alternatives: ["Hungry Hungry Hippos"],
    },
    {
      name: "Pułapka na myszy",
      image: "mouse-trap.jpg",
      alternatives: ["Mouse Trap"],
    },
    {
      name: "Zgadnij kto to?",
      image: "guess-who.jpg",
      alternatives: ["Guess Who"],
    },
    {
      name: "Cards Against Humanity",
      image: "cards-against-humanity.jpg",
      alternatives: [],
    },
    {
      name: "Osadnicy z Catanu",
      image: "catan.jpg",
      alternatives: ["Catan"],
    },
    {
      name: "Wsiąść do pociągu",
      image: "ticket-to-ride.jpg",
      alternatives: ["Ticket to Ride"],
    },
    {
      name: "Pandemia",
      image: "pandemic.jpg",
      alternatives: ["Pandemic"],
    },
    {
      name: "Apples to Apples",
      image: "apples-to-apples.jpg",
      alternatives: [],
    },
    {
      name: "Bananagrams",
      image: "bananagrams.jpg",
      alternatives: [],
    },
    {
      name: "Blokus",
      image: "blokus.jpg",
      alternatives: [],
    },
    {
      name: "Wingspan",
      image: "wingspan.jpg",
      alternatives: [],
    },
    {
      name: "Carcassonne",
      image: "carcassonne.jpg",
      alternatives: [],
    },
    {
      name: "Dominion",
      image: "dominion.jpg",
      alternatives: [],
    },
    {
      name: "Secret Hitler",
      image: "secret-hitler.jpg",
      alternatives: [],
    },
    {
      name: "Stratego",
      image: "stratego.jpg",
      alternatives: [],
    },
    {
      name: "Othello",
      image: "othello.jpg",
      alternatives: [],
    },
    {
      name: "Tryktrak",
      image: "backgammon.jpg",
      alternatives: ["Backgammon"],
    },
    {
      name: "Chińczyk",
      image: "trouble.jpg",
      alternatives: ["Trouble"],
    },
    {
      name: "Fluxx",
      image: "fluxx.jpg",
      alternatives: [],
    },
    {
      name: "Zakazana wyspa",
      image: "forbidden-island.jpg",
      alternatives: ["Forbidden Island"],
    },
    {
      name: "7 Cudów Świata",
      image: "7-wonders.jpg",
      alternatives: ["7 Wonders"],
    },
    {
      name: "Azul",
      image: "azul.jpg",
      alternatives: [],
    },
    {
      name: "Five Tribes",
      image: "five-tribes.jpg",
      alternatives: [],
    },
    {
      name: "Villainous",
      image: "villainous.jpg",
      alternatives: [],
    },
    {
      name: "Wavelength",
      image: "wavelength.jpg",
      alternatives: [],
    },
    {
      name: "Hues and Clues",
      image: "hues-and-clues.jpg",
      alternatives: [],
    },
    {
      name: "Labirynt",
      image: "labyrinth.jpg",
      alternatives: ["Labyrinth"],
    },
    {
      name: "Aggravation",
      image: "aggravation.jpg",
      alternatives: [],
    },
    {
      name: "Gloomhaven",
      image: "gloomhaven.jpg",
      alternatives: [],
    },
    {
      name: "Wyspa duchów",
      image: "spirit-island.jpg",
      alternatives: ["Spirit Island"],
    },
    {
      name: "Cienie nad Camelotem",
      image: "shadows-over-camelot.jpg",
      alternatives: ["Shadows Over Camelot"],
    },
    {
      name: "Decrypto",
      image: "decrypto.jpg",
      alternatives: [],
    },
    {
      name: "Arkham Horror",
      image: "arkham-horror.jpg",
      alternatives: [],
    },
  ],
};

const HarryPotterCharactersCategory: CategoryMetadata = {
  name: "Postacie z Harry'ego Pottera",
  folder: "harry-potter-characters",
  examples: [
    { name: "Harry Potter", image: "harry-potter.jpg", alternatives: [] },
    {
      name: "Hermione Granger",
      image: "hermione-granger.jpg",
      alternatives: [],
    },
    { name: "Ron Weasley", image: "ron-weasley.jpg", alternatives: [] },
    {
      name: "Albus Dumbledore",
      image: "albus-dumbledore.jpg",
      alternatives: [],
    },
    { name: "Lord Voldemort", image: "lord-voldemort.jpg", alternatives: [] },
    { name: "Severus Snape", image: "severus-snape.jpg", alternatives: [] },
    { name: "Rubeus Hagrid", image: "rubeus-hagrid.jpg", alternatives: [] },
    { name: "Draco Malfoy", image: "draco-malfoy.jpg", alternatives: [] },
    {
      name: "Minerva McGonagall",
      image: "minerva-mcgonagall.jpg",
      alternatives: [],
    },
    { name: "Sirius Black", image: "sirius-black.jpg", alternatives: [] },
    { name: "Remus Lupin", image: "remus-lupin.jpg", alternatives: [] },
    {
      name: "Bellatrix Lestrange",
      image: "bellatrix-lestrange.jpg",
      alternatives: [],
    },
    {
      name: "Dolores Umbridge",
      image: "dolores-umbridge.jpg",
      alternatives: [],
    },
    { name: "Luna Lovegood", image: "luna-lovegood.jpg", alternatives: [] },
    {
      name: "Neville Longbottom",
      image: "neville-longbottom.jpg",
      alternatives: [],
    },
    { name: "Ginny Weasley", image: "ginny-weasley.jpg", alternatives: [] },
    { name: "Dobby", image: "dobby.jpg", alternatives: [] },
    { name: "Lucius Malfoy", image: "lucius-malfoy.jpg", alternatives: [] },
    { name: "Molly Weasley", image: "molly-weasley.jpg", alternatives: [] },
    { name: "Arthur Weasley", image: "arthur-weasley.jpg", alternatives: [] },
    { name: "Fred Weasley", image: "fred-weasley.jpg", alternatives: [] },
    { name: "George Weasley", image: "george-weasley.jpg", alternatives: [] },
    { name: "Cedric Diggory", image: "cedric-diggory.jpg", alternatives: [] },
    { name: "Cho Chang", image: "cho-chang.jpg", alternatives: [] },
    {
      name: "Gilderoy Lockhart",
      image: "gilderoy-lockhart.jpg",
      alternatives: [],
    },
    {
      name: "Peter Pettigrew",
      image: "peter-pettigrew.jpg",
      alternatives: [],
    },
    { name: "Rita Skeeter", image: "rita-skeeter.jpg", alternatives: [] },
    {
      name: "Sybilla Trelawney",
      image: "sybil-trelawney.jpg",
      alternatives: ["Sybil Trelawney"],
    },
    { name: "Viktor Krum", image: "viktor-krum.jpg", alternatives: [] },
    {
      name: "Nymphadora Tonks",
      image: "nymphadora-tonks.jpg",
      alternatives: [],
    },
    {
      name: "Kingsley Shacklebolt",
      image: "kingsley-shacklebolt.jpg",
      alternatives: [],
    },
    { name: "Alastor Moody", image: "alastor-moody.jpg", alternatives: [] },
    { name: "Percy Weasley", image: "percy-weasley.jpg", alternatives: [] },
    { name: "Bill Weasley", image: "bill-weasley.jpg", alternatives: [] },
    // {
    //   name: "Charlie Weasley",
    //   image: "charlie-weasley.jpg",
    //   alternatives: [],
    // },
    { name: "Lavender Brown", image: "lavender-brown.jpg", alternatives: [] },
    {
      name: "Seamus Finnigan",
      image: "seamus-finnigan.jpg",
      alternatives: [],
    },
    { name: "Dean Thomas", image: "dean-thomas.jpg", alternatives: [] },
    {
      name: "Narcissa Malfoy",
      image: "narcissa-malfoy.jpg",
      alternatives: [],
    },
    // {
    //   name: "Barty Crouch Jr.",
    //   image: "barty-crouch-jr.png",
    //   alternatives: [],
    // },
    {
      name: "Cornelius Fudge",
      image: "cornelius-fudge.jpg",
      alternatives: [],
    },
    {
      name: "Horace Slughorn",
      image: "horace-slughorn.jpg",
      alternatives: [],
    },
    { name: "Argus Filch", image: "argus-filch.jpg", alternatives: [] },
    { name: "Stworek", image: "kreacher.jpg", alternatives: ["Kreacher"] },
    { name: "Padma Patil", image: "padma-patil.jpg", alternatives: [] },
    { name: "Parvati Patil", image: "parvati-patil.jpg", alternatives: [] },
    { name: "Igor Karkaroff", image: "igor-karkaroff.jpg", alternatives: [] },
    {
      name: "Fenrir Greyback",
      image: "fenrir-greyback.jpg",
      alternatives: [],
    },
    { name: "Pomona Sprout", image: "pomona-sprout.jpg", alternatives: [] },
  ],
};

const FruitsCategory: CategoryMetadata = {
  name: "Owoce",
  folder: "fruits",
  examples: [
    { name: "Jabłko", image: "apple.png", alternatives: ["Apple", "Apples"] },
    { name: "Banan", image: "banana.png", alternatives: ["Banana", "Bananas"] },
    { name: "Jeżyna", image: "blackberry.png", alternatives: ["Blackberry", "Blackberries"] },
    { name: "Borówka", image: "blueberry.png", alternatives: ["Blueberry", "Blueberries"] },
    { name: "Kokos", image: "coconut.png", alternatives: ["Coconut", "Coconuts"] },
    { name: "Wiśnia", image: "cherry.png", alternatives: ["Cherry", "Cherries"] },
    { name: "Daktyle", image: "dates.png", alternatives: ["Dates", "Date"] },
    { name: "Pitaja", image: "dragon-fruit.png", alternatives: ["Dragon Fruit", "Pitaya"] },
    { name: "Durian", image: "durian.png", alternatives: [] },
    { name: "Winogrona", image: "grapes.png", alternatives: ["Grapes", "Grape"] },
    { name: "Kiwi", image: "kiwi.png", alternatives: ["Kiwifruit"] },
    { name: "Chlebowiec", image: "jackfruit.png", alternatives: ["Jackfruit", "Jack Fruit"] },
    { name: "Cytryna", image: "lemon.png", alternatives: ["Lemon", "Lemons"] },
    { name: "Limonka", image: "lime.png", alternatives: ["Lime", "Limes"] },
    { name: "Liczi", image: "lychee.png", alternatives: ["Lychee", "Litchi"] },
    { name: "Mango", image: "mango.png", alternatives: ["Mangoes"] },
    { name: "Mangostan", image: "mangosteen.png", alternatives: ["Mangosteen"] },
    { name: "Melon", image: "melon.png", alternatives: ["Melons"] },
    { name: "Pomarańcza", image: "orange.png", alternatives: ["Orange", "Oranges"] },
    { name: "Papaja", image: "papaya.png", alternatives: ["Papaya", "Papayas"] },
    { name: "Marakuja", image: "passion-fruit.png", alternatives: ["Passion Fruit"] },
    { name: "Brzoskwinia", image: "peach.png", alternatives: ["Peach", "Peaches"] },
    { name: "Gruszka", image: "pear.png", alternatives: ["Pear", "Pears"] },
    { name: "Ananas", image: "pineapple.png", alternatives: ["Pineapple", "Pineapples"] },
    { name: "Granat", image: "pomegranate.png", alternatives: ["Pomegranate"] },
    { name: "Rambutan", image: "rambutan.png", alternatives: [] },
    { name: "Maliny", image: "raspberries.png", alternatives: ["Raspberries", "Raspberry"] },
    { name: "Truskawka", image: "strawberry.png", alternatives: ["Strawberry", "Strawberries"] },
    { name: "Mandarynka", image: "tangerine.png", alternatives: ["Tangerine", "Tangerines"] },
    { name: "Arbuz", image: "watermelon.png", alternatives: ["Watermelon", "Watermelons"] },
    { name: "Guawa", image: "guava.png", alternatives: ["Guava"] },
    { name: "Śliwka", image: "plum.png", alternatives: ["Plum", "Plums"] },
    { name: "Kaki", image: "persimmon.png", alternatives: ["Persimmon"] },
    { name: "Pomelo", image: "pomelo.png", alternatives: ["Pommelo"] },
    { name: "Karambola", image: "star-fruit.png", alternatives: ["Star Fruit", "Carambola"] },
    { name: "Longan", image: "longan.png", alternatives: [] },
    { name: "Nieszpułka japońska", image: "loquat.png", alternatives: ["Loquat"] },
    { name: "Żurawina", image: "cranberry.png", alternatives: ["Cranberry", "Cranberries"] },
    { name: "Morela", image: "apricot.png", alternatives: ["Apricot", "Apricots"] },
    { name: "Melon miodowy", image: "honeydew.png", alternatives: ["Honeydew", "Honeydew Melon"] },
    { name: "Awokado", image: "avocado.png", alternatives: ["Avocado", "Avocados"] },
    { name: "Kakao", image: "cacao.png", alternatives: ["Cacao", "Cocoa"] },
    { name: "Kalamansi", image: "calamansi.png", alternatives: ["Calamansi", "Calamondin"] },
    { name: "Ogórek", image: "cucumber.png", alternatives: ["Cucumber", "Cucumbers"] },
    { name: "Bakłażan", image: "eggplant.png", alternatives: ["Eggplant", "Aubergine"] },
    { name: "Okra", image: "okra.png", alternatives: ["Lady Finger", "Lady's Finger"] },
    { name: "Rodzynka", image: "raisin.png", alternatives: ["Raisin", "Raisins"] },
    { name: "Kainito", image: "star-apple.png", alternatives: ["Star Apple"] },
    { name: "Tamaryndowiec", image: "tamarind.png", alternatives: ["Tamarind", "Tamarine"] },
    { name: "Pomidor", image: "tomato.png", alternatives: ["Tomato", "Tomatoes"] },
    { name: "Fioletowy pochrzyn (ube)", image: "ube.png", alternatives: ["Ube", "Purple Yam"] },
  ],
};

const SpiritHalloweenCatalogueCategory: CategoryMetadata = {
  name: "Kostiumy na Halloween",
  folder: "spirit-halloween-catalogue",
  examples: [
    { name: "Batman", image: "batman.jpg", alternatives: [] },
    { name: "Przebranie kota", image: "cat-costume.jpg", alternatives: ["Cat costume"] },
    { name: "Cheerleaderka", image: "cheerleader.jpg", alternatives: ["Cheerleader"] },
    { name: "Chucky", image: "chucky.jpg", alternatives: [] },
    { name: "Beetlejuice", image: "beetlejuice.jpg", alternatives: [] },
    { name: "Anioł", image: "angel.jpg", alternatives: ["Angel"] },
    { name: "Astronauta", image: "astronaut.jpg", alternatives: ["Astronaut"] },
    { name: "Strój banana", image: "banana-suit.jpg", alternatives: ["Banana suit"] },
    { name: "Barbie", image: "barbie.jpg", alternatives: [] },
    { name: "Klaun", image: "clown.jpg", alternatives: ["Clown"] },
    { name: "Kowboj", image: "cowboy.jpg", alternatives: ["Cowboy"] },
    { name: "Darth Vader", image: "darth-vader.jpg", alternatives: [] },
    { name: "Diabeł", image: "devil.jpg", alternatives: ["Devil"] },
    { name: "Lekarz", image: "doctor.jpg", alternatives: ["Doctor"] },
    { name: "Przebranie psa", image: "dog-costume.jpg", alternatives: ["Dog costume"] },
    { name: "Wróżka", image: "fairy.jpg", alternatives: ["Fairy"] },
    { name: "Strażak", image: "firefighter.jpg", alternatives: ["Firefighter"] },
    { name: "Futbolista", image: "football-player.jpg", alternatives: ["Football player"] },
    { name: "Freddy Krueger", image: "freddy-krueger.jpg", alternatives: [] },
    { name: "Duch", image: "ghost.jpg", alternatives: ["Ghost"] },
    { name: "Ghostface", image: "ghostface.jpg", alternatives: [] },
    { name: "Kostucha", image: "grim-reaper.jpg", alternatives: ["Grim Reaper"] },
    { name: "Harley Quinn", image: "harley-quinn.jpg", alternatives: [] },
    { name: "Strój hot doga", image: "hot-dog-suit.jpg", alternatives: ["Hot dog suit"] },
    {
      name: "Dmuchany dinozaur",
      image: "inflatable-dinosaur.jpg",
      alternatives: ["Inflatable dinosaur"],
    },
    { name: "Jason Voorhees", image: "jason-voorhees.jpg", alternatives: [] },
    { name: "Joker", image: "joker.jpg", alternatives: [] },
    { name: "Ken", image: "ken.jpg", alternatives: [] },
    { name: "Szalony naukowiec", image: "mad-scientist.jpg", alternatives: ["Mad scientist"] },
    { name: "Mario", image: "mario.jpg", alternatives: [] },
    { name: "Syrenka", image: "mermaid.jpg", alternatives: ["Mermaid"] },
    { name: "Michael Myers", image: "michael-myers.jpg", alternatives: [] },
    { name: "Minionek", image: "minion.jpg", alternatives: ["Minion"] },
    { name: "Mumia", image: "mummy.jpg", alternatives: ["Mummy"] },
    { name: "Pielęgniarka", image: "nurse.jpg", alternatives: ["Nurse"] },
    { name: "Pennywise", image: "pennywise.jpg", alternatives: [] },
    { name: "Pirat", image: "pirate.jpg", alternatives: ["Pirate"] },
    { name: "Policjant", image: "police-officer.jpg", alternatives: ["Police officer"] },
    { name: "Przebranie dyni", image: "pumpkin-costume.jpg", alternatives: ["Pumpkin costume"] },
    { name: "Szkielet", image: "skeleton.jpg", alternatives: ["Skeleton"] },
    { name: "Spider-Man", image: "spider-man.jpg", alternatives: [] },
    { name: "Stormtrooper", image: "stormtrooper.jpg", alternatives: [] },
    { name: "Supergirl", image: "supergirl.jpg", alternatives: [] },
    { name: "Wampir", image: "vampire.jpg", alternatives: ["Vampire"] },
    {
      name: "Wednesday Addams",
      image: "wednesday-addams.jpg",
      alternatives: [],
    },
    { name: "Wilkołak", image: "werewolf.jpg", alternatives: ["Werewolf"] },
    { name: "Czarownica", image: "witch.jpg", alternatives: ["Witch"] },
    { name: "Wonder Woman", image: "wonder-woman.jpg", alternatives: [] },
    { name: "Zombie", image: "zombie.jpg", alternatives: [] },
  ],
};

const SuperherosCategory: CategoryMetadata = {
  name: "Superbohaterowie",
  folder: "superheros",
  examples: [
    {
      name: "Superman",
      image: "superman.jpg",
      alternatives: [],
    },
    {
      name: "Batman",
      image: "batman.jpg",
      alternatives: [],
    },
    {
      name: "Spider-Man",
      image: "spider-man.jpg",
      alternatives: [],
    },
    {
      name: "Iron Man",
      image: "iron-man.jpg",
      alternatives: [],
    },
    {
      name: "Kapitan Ameryka",
      image: "captain-america.jpg",
      alternatives: ["Captain America"],
    },
    {
      name: "Wonder Woman",
      image: "wonder-woman.jpg",
      alternatives: [],
    },
    {
      name: "Hulk",
      image: "hulk.jpg",
      alternatives: [],
    },
    {
      name: "Thor",
      image: "thor.jpg",
      alternatives: [],
    },
    {
      name: "Czarna Wdowa",
      image: "black-widow.jpg",
      alternatives: ["Black Widow"],
    },
    {
      name: "Wolverine",
      image: "wolverine.jpg",
      alternatives: [],
    },
    {
      name: "Flash",
      image: "the-flash.jpg",
      alternatives: ["The Flash"],
    },
    {
      name: "Deadpool",
      image: "deadpool.jpg",
      alternatives: [],
    },
    {
      name: "Black Panther",
      image: "black-panther.jpg",
      alternatives: [],
    },
    {
      name: "Doktor Strange",
      image: "doctor-strange.jpg",
      alternatives: ["Doctor Strange"],
    },
    {
      name: "Aquaman",
      image: "aquaman.jpg",
      alternatives: [],
    },
    {
      name: "Zielona Latarnia",
      image: "green-lantern.jpg",
      alternatives: ["Green Lantern"],
    },
    {
      name: "Kapitan Marvel",
      image: "captain-marvel.jpg",
      alternatives: ["Captain Marvel"],
    },
    {
      name: "Ant-Man",
      image: "ant-man.jpg",
      alternatives: [],
    },
    {
      name: "Hawkeye",
      image: "hawkeye.jpg",
      alternatives: [],
    },
    {
      name: "Szkarłatna Czarownica",
      image: "scarlet-witch.jpg",
      alternatives: ["Scarlet Witch"],
    },
    {
      name: "Vision",
      image: "vision.jpg",
      alternatives: [],
    },
    {
      name: "Star-Lord",
      image: "star-lord.jpg",
      alternatives: [],
    },
    {
      name: "Gamora",
      image: "gamora.jpg",
      alternatives: [],
    },
    {
      name: "Groot",
      image: "groot.jpg",
      alternatives: [],
    },
    {
      name: "Rocket Raccoon",
      image: "rocket-raccoon.jpg",
      alternatives: [],
    },
    {
      name: "Drax",
      image: "drax.jpg",
      alternatives: [],
    },
    {
      name: "Osa",
      image: "the-wasp.jpg",
      alternatives: ["The Wasp"],
    },
    {
      name: "Shazam",
      image: "shazam.jpg",
      alternatives: [],
    },
    {
      name: "Zielona Strzała",
      image: "green-arrow.jpg",
      alternatives: ["Green Arrow"],
    },
    {
      name: "Supergirl",
      image: "supergirl.jpg",
      alternatives: [],
    },
    {
      name: "Batgirl",
      image: "batgirl.jpg",
      alternatives: [],
    },
    {
      name: "Robin",
      image: "robin.jpg",
      alternatives: [],
    },
    {
      name: "Cyklop",
      image: "cyclops.jpg",
      alternatives: ["Cyclops"],
    },
    {
      name: "Jean Grey",
      image: "jean-grey.jpg",
      alternatives: [],
    },
    {
      name: "Burza",
      image: "storm.jpg",
      alternatives: ["Storm"],
    },
    {
      name: "Profesor X",
      image: "professor-x.jpg",
      alternatives: ["Professor X"],
    },
    {
      name: "Rogue",
      image: "rogue.jpg",
      alternatives: [],
    },
    {
      name: "Gambit",
      image: "gambit.jpg",
      alternatives: [],
    },
    {
      name: "Beast Boy",
      image: "beast-boy.jpg",
      alternatives: [],
    },
    {
      name: "Raven",
      image: "raven.jpg",
      alternatives: [],
    },
    {
      name: "Starfire",
      image: "starfire.jpg",
      alternatives: [],
    },
    {
      name: "Daredevil",
      image: "daredevil.jpg",
      alternatives: [],
    },
    {
      name: "Cyborg",
      image: "cyborg.jpg",
      alternatives: [],
    },
    {
      name: "Nightwing",
      image: "nightwing.jpg",
      alternatives: [],
    },
    {
      name: "Stwór",
      image: "the-thing.jpg",
      alternatives: ["The Thing"],
    },
    {
      name: "Pan Fantastyczny",
      image: "mr-fantastic.jpg",
      alternatives: ["Mr. Fantastic"],
    },
    {
      name: "Niewidzialna Kobieta",
      image: "invisible-woman.jpg",
      alternatives: ["Invisible Woman"],
    },
    {
      name: "Ludzka Pochodnia",
      image: "human-torch.jpg",
      alternatives: ["Human Torch"],
    },
    {
      name: "Srebrny Surfer",
      image: "silver-surfer.jpg",
      alternatives: ["Silver Surfer"],
    },
    {
      name: "Marsjański Łowca",
      image: "martian-manhunter.jpg",
      alternatives: ["Martian Manhunter"],
    },
  ],
};

const VideoGameCharactersCategory: CategoryMetadata = {
  name: "Postacie z gier wideo",
  folder: "video-game-characters",
  examples: [
    {
      name: "Mario",
      image: "mario.jpg",
      alternatives: [],
    },
    {
      name: "Pikachu",
      image: "pikachu.jpg",
      alternatives: [],
    },
    {
      name: "Link",
      image: "link.png",
      alternatives: [],
    },
    {
      name: "Sonic the Hedgehog",
      image: "sonic-the-hedgehog.jpg",
      alternatives: [],
    },
    {
      name: "Pac-Man",
      image: "pac-man.jpg",
      alternatives: [],
    },
    {
      name: "Donkey Kong",
      image: "donkey-kong.jpg",
      alternatives: [],
    },
    {
      name: "Luigi",
      image: "luigi.png",
      alternatives: [],
    },
    {
      name: "Księżniczka Peach",
      image: "princess-peach.jpg",
      alternatives: ["Princess Peach"],
    },
    {
      name: "Bowser",
      image: "bowser.jpg",
      alternatives: [],
    },
    {
      name: "Yoshi",
      image: "yoshi.jpg",
      alternatives: [],
    },
    // {
    //   name: "Księżniczka Zelda",
    //   image: "princess-zelda.jpg",
    //   alternatives: ["Princess Zelda"],
    // },
    {
      name: "Zelda",
      image: "zelda.jpg",
      alternatives: [],
    },
    {
      name: "Ganondorf",
      image: "ganondorf.jpg",
      alternatives: [],
    },
    {
      name: "Cloud Strife",
      image: "cloud-strife.jpg",
      alternatives: [],
    },
    {
      name: "Master Chief",
      image: "master-chief.jpg",
      alternatives: [],
    },
    {
      name: "Lara Croft",
      image: "lara-croft.png",
      alternatives: [],
    },
    {
      name: "Solid Snake",
      image: "solid-snake.png",
      alternatives: [],
    },
    {
      name: "Kratos",
      image: "kratos.jpg",
      alternatives: [],
    },
    {
      name: "Nathan Drake",
      image: "nathan-drake.jpg",
      alternatives: [],
    },
    {
      name: "Charizard",
      image: "charizard.jpg",
      alternatives: [],
    },
    {
      name: "Steve",
      image: "steve.jpg",
      alternatives: [],
    },
    {
      name: "Crash Bandicoot",
      image: "crash-bandicoot.jpg",
      alternatives: [],
    },
    {
      name: "Smok Spyro",
      image: "spyro-the-dragon.jpg",
      alternatives: ["Spyro the Dragon"],
    },
    {
      name: "Tails",
      image: "tails.png",
      alternatives: [],
    },
    {
      name: "Knuckles",
      image: "knuckles.jpg",
      alternatives: [],
    },
    {
      name: "Samus Aran",
      image: "samus-aran.jpg",
      alternatives: [],
    },
    {
      name: "Kirby",
      image: "kirby.png",
      alternatives: [],
    },
    {
      name: "Mega Man",
      image: "mega-man.jpg",
      alternatives: [],
    },
    {
      name: "Ryu",
      image: "ryu.jpg",
      alternatives: [],
    },
    {
      name: "Ken Masters",
      image: "ken-masters.png",
      alternatives: [],
    },
    {
      name: "Chun-Li",
      image: "chun-li.jpg",
      alternatives: [],
    },
    {
      name: "Sephiroth",
      image: "sephiroth.jpg",
      alternatives: [],
    },
    {
      name: "Scorpion",
      image: "scorpion.jpg",
      alternatives: [],
    },
    {
      name: "Sub-Zero",
      image: "sub-zero.jpg",
      alternatives: [],
    },
    {
      name: "Ellie",
      image: "ellie.jpg",
      alternatives: [],
    },
    {
      name: "Joel Miller",
      image: "joel-miller.jpg",
      alternatives: [],
    },
    {
      name: "Geralt of Rivia",
      image: "geralt-of-rivia.jpg",
      alternatives: [],
    },
    {
      name: "Arthur Morgan",
      image: "arthur-morgan.jpg",
      alternatives: [],
    },
    {
      name: "Joker",
      image: "joker.jpg",
      alternatives: [],
    },
    {
      name: "Tracer",
      image: "tracer.jpg",
      alternatives: [],
    },
    {
      name: "Doom Slayer",
      image: "doom-slayer.jpg",
      alternatives: [],
    },
    {
      name: "Gordon Freeman",
      image: "gordon-freeman.jpg",
      alternatives: [],
    },
    {
      name: "Sora",
      image: "sora.jpg",
      alternatives: [],
    },
    {
      name: "Rayman",
      image: "rayman.jpg",
      alternatives: [],
    },
    {
      name: "Dr. Eggman",
      image: "dr-eggman.jpg",
      alternatives: [],
    },
    {
      name: "Jill Valentine",
      image: "jill-valentine.jpg",
      alternatives: [],
    },
    {
      name: "Leon S. Kennedy",
      image: "leon-s-kennedy.jpg",
      alternatives: [],
    },
    {
      name: "Ezio Auditore",
      image: "ezio-auditore.jpg",
      alternatives: [],
    },
    {
      name: "Altaïr Ibn-La'Ahad",
      image: "altaïr-ibn-laahad.jpg",
      alternatives: [],
    },
    {
      name: "Agent 47",
      image: "agent-47.jpg",
      alternatives: [],
    },
  ],
};

const CitySkylinesCategory: CategoryMetadata = {
  name: "Panoramy miast",
  folder: "city-skylines",
  examples: [
    {
      name: "Nowy Jork",
      image: "new-york-city.jpg",
      alternatives: ["New York City"],
    },
    {
      name: "Londyn",
      image: "london.jpg",
      alternatives: ["London"],
    },
    {
      name: "Paryż",
      image: "paris.jpg",
      alternatives: ["Paris"],
    },
    {
      name: "Tokio",
      image: "tokyo.jpg",
      alternatives: ["Tokyo"],
    },
    {
      name: "Los Angeles",
      image: "los-angeles.jpg",
      alternatives: [],
    },
    {
      name: "Chicago",
      image: "chicago.jpg",
      alternatives: [],
    },
    {
      name: "San Francisco",
      image: "san-francisco.jpg",
      alternatives: [],
    },
    {
      name: "Las Vegas",
      image: "las-vegas.jpg",
      alternatives: [],
    },
    {
      name: "Miami",
      image: "miami.jpg",
      alternatives: [],
    },
    {
      name: "Dubaj",
      image: "dubai.jpg",
      alternatives: ["Dubai"],
    },
    {
      name: "Hongkong",
      image: "hong-kong.jpg",
      alternatives: ["Hong Kong"],
    },
    {
      name: "Szanghaj",
      image: "shanghai.jpg",
      alternatives: ["Shanghai"],
    },
    {
      name: "Singapur",
      image: "singapore.jpg",
      alternatives: ["Singapore"],
    },
    {
      name: "Sydney",
      image: "sydney.jpg",
      alternatives: [],
    },
    {
      name: "Toronto",
      image: "toronto.jpg",
      alternatives: [],
    },
    {
      name: "Seul",
      image: "seoul.jpg",
      alternatives: ["Seoul"],
    },
    {
      name: "Moskwa",
      image: "moscow.jpg",
      alternatives: ["Moscow"],
    },
    {
      name: "Stambuł",
      image: "istanbul.jpg",
      alternatives: ["Istanbul"],
    },
    {
      name: "Rio de Janeiro",
      image: "rio-de-janeiro.jpg",
      alternatives: [],
    },
    {
      name: "Bangkok",
      image: "bangkok.jpg",
      alternatives: [],
    },
    {
      name: "Pekin",
      image: "beijing.jpg",
      alternatives: ["Beijing"],
    },
    {
      name: "Mumbaj",
      image: "mumbai.jpg",
      alternatives: ["Mumbai"],
    },
    {
      name: "Berlin",
      image: "berlin.jpg",
      alternatives: [],
    },
    {
      name: "Rzym",
      image: "rome.jpg",
      alternatives: ["Rome"],
    },
    {
      name: "Barcelona",
      image: "barcelona.jpg",
      alternatives: [],
    },
    {
      name: "Madryt",
      image: "madrid.jpg",
      alternatives: ["Madrid"],
    },
    {
      name: "Boston",
      image: "boston.jpg",
      alternatives: [],
    },
    {
      name: "Filadelfia",
      image: "philadelphia.jpg",
      alternatives: ["Philadelphia"],
    },
    {
      name: "Dallas",
      image: "dallas.jpg",
      alternatives: [],
    },
    {
      name: "Houston",
      image: "houston.jpg",
      alternatives: [],
    },
    {
      name: "Atlanta",
      image: "atlanta.jpg",
      alternatives: [],
    },
    {
      name: "Seattle",
      image: "seattle.jpg",
      alternatives: [],
    },
    {
      name: "Vancouver",
      image: "vancouver.jpg",
      alternatives: [],
    },
    {
      name: "Melbourne",
      image: "melbourne.jpg",
      alternatives: [],
    },
    {
      name: "Tajpej",
      image: "taipei.jpg",
      alternatives: ["Taipei"],
    },
    {
      name: "Ateny",
      image: "athens.jpg",
      alternatives: ["Athens"],
    },
    {
      name: "Kair",
      image: "cairo.jpg",
      alternatives: ["Cairo"],
    },
    {
      name: "Meksyk",
      image: "mexico-city.jpg",
      alternatives: ["Mexico City"],
    },
    {
      name: "São Paulo",
      image: "sao-paulo.jpg",
      alternatives: ["Sao Paulo"],
    },
    {
      name: "Kuala Lumpur",
      image: "kuala-lumpur.jpg",
      alternatives: [],
    },
    {
      name: "Frankfurt",
      image: "frankfurt.jpg",
      alternatives: [],
    },
    {
      name: "Osaka",
      image: "osaka.jpg",
      alternatives: [],
    },
    {
      name: "Dżakarta",
      image: "jakarta.jpg",
      alternatives: ["Jakarta"],
    },
    {
      name: "Manila",
      image: "manila.jpg",
      alternatives: [],
    },
    {
      name: "Buenos Aires",
      image: "buenos-aires.jpg",
      alternatives: [],
    },
    {
      name: "Santiago",
      image: "santiago.jpg",
      alternatives: [],
    },
    {
      name: "Bogota",
      image: "bogota.jpg",
      alternatives: [],
    },
    {
      name: "Delhi",
      image: "delhi.jpg",
      alternatives: [],
    },
    {
      name: "Johannesburg",
      image: "johannesburg.jpg",
      alternatives: [],
    },
    {
      name: "Panama",
      image: "panama-city.jpg",
      alternatives: ["Panama City"],
    },
  ],
};

const MoviesCategory: CategoryMetadata = {
  name: "Filmy",
  folder: "movies",
  examples: [
    {
      name: "Gwiezdne wojny: Nowa nadzieja",
      image: "star-wars-a-new-hope.jpg",
      alternatives: ["Star Wars: A New Hope"],
    },

    {
      name: "Titanic",
      image: "titanic.jpg",
      alternatives: [],
    },
    {
      name: "Mroczny Rycerz",
      image: "the-dark-knight.jpg",
      alternatives: ["The Dark Knight"],
    },
    {
      name: "Władca Pierścieni: Drużyna Pierścienia",
      image: "the-lord-of-the-rings-the-fellowship-of-the-ring.jpg",
      alternatives: ["The Lord of the Rings: The Fellowship of the Ring"],
    },

    {
      name: "Avengers: Koniec gry",
      image: "avengers-endgame.jpg",
      alternatives: ["Avengers: Endgame"],
    },
    {
      name: "Avengers (2012)",
      image: "the-avengers-2012.jpg",
      alternatives: ["The Avengers (2012)"],
    },
    {
      name: "Iron Man",
      image: "iron-man.jpg",
      alternatives: [],
    },
    {
      name: "Black Panther",
      image: "black-panther.jpg",
      alternatives: [],
    },
    {
      name: "Spider-Man (2002)",
      image: "spider-man-2002.jpg",
      alternatives: [],
    },
    {
      name: "Harry Potter i Kamień Filozoficzny",
      image: "harry-potter-and-the-sorcerers-stone.jpg",
      alternatives: ["Harry Potter and the Sorcerer's Stone"],
    },
    {
      name: "Król Lew (1994)",
      image: "the-lion-king-1994.jpg",
      alternatives: ["The Lion King (1994)"],
    },
    {
      name: "Toy Story",
      image: "toy-story.jpg",
      alternatives: [],
    },
    {
      name: "Gdzie jest Nemo?",
      image: "finding-nemo.jpg",
      alternatives: ["Finding Nemo"],
    },
    {
      name: "Kraina lodu",
      image: "frozen.jpg",
      alternatives: ["Frozen"],
    },
    {
      name: "Shrek",
      image: "shrek.jpg",
      alternatives: [],
    },
    {
      name: "Jurassic Park",
      image: "jurassic-park.jpg",
      alternatives: [],
    },
    {
      name: "Matrix",
      image: "the-matrix.jpg",
      alternatives: ["The Matrix"],
    },
    {
      name: "Forrest Gump",
      image: "forrest-gump.jpg",
      alternatives: [],
    },
    {
      name: "Piraci z Karaibów: Klątwa Czarnej Perły",
      image: "pirates-of-the-caribbean-the-curse-of-the-black-pearl.jpg",
      alternatives: ["Pirates of the Caribbean: The Curse of the Black Pearl"],
    },
    {
      name: "Ojciec chrzestny",
      image: "the-godfather.jpg",
      alternatives: ["The Godfather"],
    },
    {
      name: "Skazani na Shawshank",
      image: "the-shawshank-redemption.jpg",
      alternatives: ["The Shawshank Redemption"],
    },
    {
      name: "Lśnienie",
      image: "the-shining.jpg",
      alternatives: ["The Shining"],
    },
    {
      name: "Egzorcysta",
      image: "the-exorcist.jpg",
      alternatives: ["The Exorcist"],
    },
    {
      name: "Psychoza",
      image: "psycho.jpg",
      alternatives: ["Psycho"],
    },
    {
      name: "Szczęki",
      image: "jaws.jpg",
      alternatives: ["Jaws"],
    },
    {
      name: "E.T. the Extra-Terrestrial",
      image: "et-the-extra-terrestrial.jpg",
      alternatives: [],
    },
    {
      name: "Powrót do przyszłości",
      image: "back-to-the-future.jpg",
      alternatives: ["Back to the Future"],
    },
    {
      name: "Pogromcy duchów",
      image: "ghostbusters.jpg",
      alternatives: ["Ghostbusters"],
    },
    {
      name: "Indiana Jones: Poszukiwacze zaginionej Arki",
      image: "indiana-jones-raiders-of-the-lost-ark.jpg",
      alternatives: ["Indiana Jones: Raiders of the Lost Ark"],
    },
    {
      name: "Terminator 2: Dzień sądu",
      image: "terminator-2-judgment-day.jpg",
      alternatives: ["Terminator 2: Judgment Day"],
    },
    {
      name: "Obcy – 8. pasażer „Nostromo”",
      image: "alien.jpg",
      alternatives: ["Alien"],
    },
    {
      name: "Top Gun",
      image: "top-gun.jpg",
      alternatives: [],
    },
    {
      name: "Klub winowajców",
      image: "the-breakfast-club.jpg",
      alternatives: ["The Breakfast Club"],
    },
    {
      name: "Kevin sam w domu",
      image: "home-alone.jpg",
      alternatives: ["Home Alone"],
    },
    {
      name: "Rocky",
      image: "rocky.jpg",
      alternatives: [],
    },
    {
      name: "Czarnoksiężnik z Oz",
      image: "the-wizard-of-oz.jpg",
      alternatives: ["The Wizard of Oz"],
    },
    {
      name: "Casablanca",
      image: "casablanca.jpg",
      alternatives: [],
    },
    {
      name: "Przeminęło z wiatrem",
      image: "gone-with-the-wind.jpg",
      alternatives: ["Gone With the Wind"],
    },
    {
      name: "Dźwięki muzyki",
      image: "the-sound-of-music.jpg",
      alternatives: ["The Sound of Music"],
    },
    {
      name: "Jak ukraść księżyc",
      image: "despicable-me.jpg",
      alternatives: ["Despicable Me"],
    },
    {
      name: "Spirited Away: W krainie bogów",
      image: "spirited-away.jpg",
      alternatives: ["Spirited Away"],
    },
    {
      name: "Avatar",
      image: "avatar.jpg",
      alternatives: [],
    },
    {
      name: "Superman (1978)",
      image: "superman-1978.jpg",
      alternatives: [],
    },
    {
      name: "Gwiezdne wojny: Imperium kontratakuje",
      image: "the-empire-strikes-back.jpg",
      alternatives: ["The Empire Strikes Back"],
    },
    {
      name: "To (2017)",
      image: "it-2017.jpg",
      alternatives: ["It (2017)"],
    },
    {
      name: "Halloween (1978)",
      image: "halloween-1978.jpg",
      alternatives: [],
    },
    {
      name: "Joker (2019)",
      image: "joker-2019.jpg",
      alternatives: [],
    },
    {
      name: "Barbie (2023)",
      image: "barbie-2023.jpg",
      alternatives: [],
    },
    {
      name: "Oppenheimer (2023)",
      image: "oppenheimer-2023.jpg",
      alternatives: [],
    },
    {
      name: "Kraina lodu II",
      image: "frozen-ii.jpg",
      alternatives: ["Frozen II"],
    },
    {
      name: "Władca Pierścieni: Powrót króla",
      image: "the-lord-of-the-rings-the-return-of-the-king.jpg",
      alternatives: ["The Lord of the Rings: The Return of the King"],
    },
  ],
};

const BooksCategory: CategoryMetadata = {
  name: "Książki",
  folder: "books",
  examples: [
    {
      name: "Harry Potter i Kamień Filozoficzny",
      image: "harry-potter-and-the-sorcerers-stone.jpg",
      alternatives: ["Harry Potter and the Sorcerer's Stone"],
    },
    {
      name: "Wielki Gatsby",
      image: "the-great-gatsby.jpg",
      alternatives: ["The Great Gatsby"],
    },
    {
      name: "1984",
      image: "1984.jpg",
      alternatives: [],
    },
    {
      name: "Zabić drozda",
      image: "to-kill-a-mockingbird.jpg",
      alternatives: ["To Kill a Mockingbird"],
    },
    {
      name: "Buszujący w zbożu",
      image: "the-catcher-in-the-rye.jpg",
      alternatives: ["The Catcher in the Rye"],
    },
    {
      name: "Władca Pierścieni",
      image: "the-lord-of-the-rings.jpg",
      alternatives: ["The Lord of the Rings"],
    },
    {
      name: "Hobbit",
      image: "the-hobbit.jpg",
      alternatives: ["The Hobbit"],
    },
    {
      name: "Igrzyska śmierci",
      image: "the-hunger-games.jpg",
      alternatives: ["The Hunger Games"],
    },
    {
      name: "Zmierzch",
      image: "twilight.jpg",
      alternatives: ["Twilight"],
    },
    {
      name: "Kod Leonarda da Vinci",
      image: "the-da-vinci-code.jpg",
      alternatives: ["The Da Vinci Code"],
    },
    {
      name: "Gra o tron",
      image: "a-game-of-thrones.jpg",
      alternatives: ["A Game of Thrones"],
    },
    {
      name: "Opowieści z Narnii",
      image: "the-chronicles-of-narnia.jpg",
      alternatives: ["The Chronicles of Narnia"],
    },
    {
      name: "Lew, czarownica i stara szafa",
      image: "the-lion-the-witch-and-the-wardrobe.jpg",
      alternatives: ["The Lion the Witch and the Wardrobe"],
    },
    {
      name: "Duma i uprzedzenie",
      image: "pride-and-prejudice.jpg",
      alternatives: ["Pride and Prejudice"],
    },
    {
      name: "Folwark zwierzęcy",
      image: "animal-farm.jpg",
      alternatives: ["Animal Farm"],
    },
    {
      name: "Władca much",
      image: "the-lord-of-the-flies.jpg",
      alternatives: ["The Lord of the Flies"],
    },
    {
      name: "Fahrenheit 451",
      image: "fahrenheit-451.jpg",
      alternatives: [],
    },
    {
      name: "Outsiderzy",
      image: "the-outsiders.jpg",
      alternatives: ["The Outsiders"],
    },
    {
      name: "Dawca",
      image: "the-giver.jpg",
      alternatives: ["The Giver"],
    },
    {
      name: "Opowieść podręcznej",
      image: "the-handmaids-tale.jpg",
      alternatives: ["The Handmaid's Tale"],
    },
    {
      name: "Lśnienie",
      image: "the-shining.jpg",
      alternatives: ["The Shining"],
    },
    {
      name: "To",
      image: "it.jpg",
      alternatives: ["It"],
    },
    {
      name: "Autostopem przez Galaktykę",
      image: "the-hitchhikers-guide-to-the-galaxy.jpg",
      alternatives: ["The Hitchhiker's Guide to the Galaxy"],
    },
    {
      name: "Diuna",
      image: "dune.jpg",
      alternatives: ["Dune"],
    },
    {
      name: "Drakula",
      image: "dracula.jpg",
      alternatives: ["Dracula"],
    },
    {
      name: "Frankenstein",
      image: "frankenstein.jpg",
      alternatives: [],
    },
    {
      name: "Milczenie owiec",
      image: "the-silence-of-the-lambs.jpg",
      alternatives: ["The Silence of the Lambs"],
    },
    {
      name: "Mężczyźni, którzy nienawidzą kobiet",
      image: "the-girl-with-the-dragon-tattoo.jpg",
      alternatives: ["The Girl with the Dragon Tattoo"],
    },
    {
      name: "Gwiazd naszych wina",
      image: "the-fault-in-our-stars.jpg",
      alternatives: ["The Fault in Our Stars"],
    },
    {
      name: "Życie Pi",
      image: "life-of-pi.jpg",
      alternatives: ["Life of Pi"],
    },
    {
      name: "Alchemik",
      image: "the-alchemist.jpg",
      alternatives: ["The Alchemist"],
    },
    {
      name: "Jane Eyre",
      image: "jane-eyre.jpg",
      alternatives: [],
    },
    {
      name: "Wichrowe Wzgórza",
      image: "wuthering-heights.jpg",
      alternatives: ["Wuthering Heights"],
    },
    {
      name: "Kolor purpury",
      image: "the-color-purple.jpg",
      alternatives: ["The Color Purple"],
    },
    {
      name: "Przygody Hucka Finna",
      image: "the-adventures-of-huckleberry-finn.jpg",
      alternatives: ["The Adventures of Huckleberry Finn"],
    },
    {
      name: "Moby-Dick",
      image: "moby-dick.jpg",
      alternatives: [],
    },
    {
      name: "Odyseja",
      image: "the-odyssey.jpg",
      alternatives: ["The Odyssey"],
    },
    {
      name: "Iliada",
      image: "the-iliad.jpg",
      alternatives: ["The Iliad"],
    },
    {
      name: "Wojna i pokój",
      image: "war-and-peace.jpg",
      alternatives: ["War and Peace"],
    },
    {
      name: "Stary człowiek i morze",
      image: "the-old-man-and-the-sea.jpg",
      alternatives: ["The Old Man and the Sea"],
    },
    {
      name: "Mały Książę",
      image: "the-little-prince.jpg",
      alternatives: ["The Little Prince"],
    },
    {
      name: "Nowy wspaniały świat",
      image: "brave-new-world.jpg",
      alternatives: ["Brave New World"],
    },
    {
      name: "Chłopiec z latawcem",
      image: "the-kite-runner.jpg",
      alternatives: ["The Kite Runner"],
    },
    {
      name: "Złodziejka książek",
      image: "the-book-thief.jpg",
      alternatives: ["The Book Thief"],
    },
    {
      name: "Pajęczyna Charlotty",
      image: "charlottes-web.jpg",
      alternatives: ["Charlotte's Web"],
    },
    {
      name: "Zielone jajka i szynka",
      image: "green-eggs-and-ham.jpg",
      alternatives: ["Green Eggs and Ham"],
    },
    {
      name: "Kot Prot",
      image: "the-cat-in-the-hat.jpg",
      alternatives: ["The Cat in the Hat"],
    },
    {
      name: "Bardzo głodna gąsienica",
      image: "the-very-hungry-caterpillar.jpg",
      alternatives: ["The Very Hungry Caterpillar"],
    },
    {
      name: "Tam, gdzie żyją dzikie stwory",
      image: "where-the-wild-things-are.jpg",
      alternatives: ["Where the Wild Things Are"],
    },
  ],
};

const DisneyChannelOriginalMoviesCategory: CategoryMetadata = {
  name: "Filmy Disney Channel",
  folder: "disney-channel-original-movies",
  examples: [
    {
      name: "High School Musical",
      image: "high-school-musical.jpg",
      alternatives: [],
    },
    {
      name: "Camp Rock",
      image: "camp-rock.jpg",
      alternatives: [],
    },
    {
      name: "The Cheetah Girls",
      image: "the-cheetah-girls.jpg",
      alternatives: [],
    },
    {
      name: "Halloweentown",
      image: "halloweentown.jpg",
      alternatives: [],
    },
    {
      name: "Descendants",
      image: "descendants.jpg",
      alternatives: [],
    },
    {
      name: "Twitches",
      image: "twitches.jpg",
      alternatives: [],
    },
    {
      name: "Lemonade Mouth",
      image: "lemonade-mouth.jpg",
      alternatives: [],
    },
    {
      name: "Teen Beach Movie",
      image: "teen-beach-movie.jpg",
      alternatives: [],
    },
    {
      name: "Smart House",
      image: "smart-house.jpg",
      alternatives: [],
    },
    {
      name: "Johnny Tsunami",
      image: "johnny-tsunami.jpg",
      alternatives: [],
    },
    {
      name: "Cadet Kelly",
      image: "cadet-kelly.jpg",
      alternatives: [],
    },
    {
      name: "The Luck of the Irish",
      image: "the-luck-of-the-irish.jpg",
      alternatives: [],
    },
    {
      name: "The Proud Family Movie",
      image: "the-proud-family-movie.jpg",
      alternatives: [],
    },
    {
      name: "Kim Possible Movie: So the Drama",
      image: "kim-possible-movie-so-the-drama.jpg",
      alternatives: [],
    },
    {
      name: "Princess Protection Program",
      image: "princess-protection-program.jpg",
      alternatives: [],
    },
    {
      name: "Let It Shine",
      image: "let-it-shine.jpg",
      alternatives: [],
    },
    {
      name: "Jump In!",
      image: "jump-in.jpg",
      alternatives: [],
    },
    {
      name: "Minutemen",
      image: "minutemen.jpg",
      alternatives: [],
    },
    {
      name: "Geek Charming",
      image: "geek-charming.jpg",
      alternatives: [],
    },
    {
      name: "Radio Rebel",
      image: "radio-rebel.jpg",
      alternatives: [],
    },
    {
      name: "Zapped",
      image: "zapped.jpg",
      alternatives: [],
    },
    {
      name: "How to Build a Better Boy",
      image: "how-to-build-a-better-boy.jpg",
      alternatives: [],
    },
    {
      name: "Girl vs. Monster",
      image: "girl-vs-monster.jpg",
      alternatives: [],
    },
    {
      name: "Invisible Sister",
      image: "invisible-sister.jpg",
      alternatives: [],
    },
    {
      name: "Eddie's Million Dollar Cook-Off",
      image: "eddies-million-dollar-cook-off.jpg",
      alternatives: [],
    },
    {
      name: "The Thirteenth Year",
      image: "the-thirteenth-year.jpg",
      alternatives: [],
    },
    {
      name: "The Color of Friendship",
      image: "the-color-of-friendship.jpg",
      alternatives: [],
    },
    {
      name: "Pixel Perfect",
      image: "pixel-perfect.jpg",
      alternatives: [],
    },
    {
      name: "Stuck in the Suburbs",
      image: "stuck-in-the-suburbs.jpg",
      alternatives: [],
    },
    {
      name: "Wendy Wu: Homecoming Warrior",
      image: "wendy-wu-homecoming-warrior.jpg",
      alternatives: [],
    },
    {
      name: "Read It and Weep",
      image: "read-it-and-weep.jpg",
      alternatives: [],
    },
    {
      name: "Zenon: Girl of the 21st Century",
      image: "zenon-girl-of-the-21st-century.jpg",
      alternatives: [],
    },
    {
      name: "Gotta Kick It Up!",
      image: "gotta-kick-it-up.jpg",
      alternatives: [],
    },
    {
      name: "High School Musical 2",
      image: "high-school-musical-2.jpg",
      alternatives: [],
    },
    {
      name: "Dadnapped",
      image: "dadnapped.jpg",
      alternatives: [],
    },
    {
      name: "Camp Rock 2: The Final Jam",
      image: "camp-rock-2-the-final-jam.jpg",
      alternatives: [],
    },
    {
      name: "The Cheetah Girls 2",
      image: "the-cheetah-girls-2.jpg",
      alternatives: [],
    },
    {
      name: "Halloweentown II: Kalabar's Revenge",
      image: "halloweentown-ii-kalabars-revenge.jpg",
      alternatives: [],
    },
    {
      name: "Descendants 2",
      image: "descendants-2.jpg",
      alternatives: [],
    },
    {
      name: "Twitches Too",
      image: "twitches-too.jpg",
      alternatives: [],
    },
    {
      name: "Teen Beach 2",
      image: "teen-beach-2.jpg",
      alternatives: [],
    },
    {
      name: "Zenon: The Zequel",
      image: "zenon-the-zequel.jpg",
      alternatives: [],
    },
    {
      name: "Johnny Kapahala: Back on Board",
      image: "johnny-kapahala-back-on-board.jpg",
      alternatives: [],
    },
    {
      name: "High School Musical 3: Senior Year",
      image: "high-school-musical-3-senior-year.jpg",
      alternatives: [],
    },
    {
      name: "The Cheetah Girls: One World",
      image: "the-cheetah-girls-one-world.jpg",
      alternatives: [],
    },
    {
      name: "Halloweentown High",
      image: "halloweentown-high.jpg",
      alternatives: [],
    },
    {
      name: "Descendants 3",
      image: "descendants-3.jpg",
      alternatives: [],
    },
    {
      name: "Return to Halloweentown",
      image: "return-to-halloweentown.jpg",
      alternatives: [],
    },
    {
      name: "Zenon: Z3",
      image: "zenon-z3.jpg",
      alternatives: [],
    },
  ],
};

const BrandSlogansCategory: CategoryMetadata = {
  name: "Slogany reklamowe",
  folder: "brand-slogans",
  examples: [
    {
      name: "Nike",
      text: "Just Do It",
      alternatives: ["Nike"],
    },
    {
      name: "McDonald's",
      text: "I'm Lovin' It",
      alternatives: ["McDonald's"],
    },
    {
      name: "Apple",
      text: "Think Different",
      alternatives: ["Apple"],
    },
    {
      name: "Coca-Cola",
      text: "Taste the Feeling",
      alternatives: ["Coca-Cola"],
    },
    {
      name: "M&M's",
      text: "Melts in Your Mouth Not in Your Hands",
      alternatives: ["M&M's"],
    },
    {
      name: "L'Oréal",
      text: "Because You're Worth It",
      alternatives: ["L'Oréal"],
    },
    {
      name: "Maybelline",
      text: "Maybe She's Born With It Maybe It's _______",
      alternatives: ["Maybelline"],
    },
    {
      name: "Subway",
      text: "Eat Fresh",
      alternatives: ["Subway"],
    },
    {
      name: "Red Bull",
      text: "It Gives You Wings",
      alternatives: ["Red Bull"],
    },
    {
      name: "Snickers",
      text: "You're Not You When You're Hungry",
      alternatives: ["Snickers"],
    },
    {
      name: "Kit Kat",
      text: "Have a Break Have a ________",
      alternatives: ["Kit Kat"],
    },
    {
      name: "KFC",
      text: "Finger Lickin' Good",
      alternatives: ["KFC"],
    },
    {
      name: "Target",
      text: "Expect More Pay Less",
      alternatives: ["Target"],
    },
    {
      name: "State Farm",
      text: "Like a Good Neighbor ________ Is There",
      alternatives: ["State Farm"],
    },
    {
      name: "Folgers",
      text: "The Best Part of Wakin' Up Is ________ in Your Cup",
      alternatives: ["Folgers"],
    },
    {
      name: "Gatorade",
      text: "Is It in You?",
      alternatives: ["Gatorade"],
    },
    {
      name: "Burger King",
      text: "Have It Your Way",
      alternatives: ["Burger King"],
    },
    {
      name: "Gillette",
      text: "The Best a Man Can Get",
      alternatives: ["Gillette"],
    },
    {
      name: "Bounty",
      text: "The Quicker Picker Upper",
      alternatives: ["Bounty"],
    },
    {
      name: "Walmart",
      text: "Save Money Live Better",
      alternatives: ["Walmart"],
    },
    {
      name: "Capital One",
      text: "What's in Your Wallet?",
      alternatives: ["Capital One"],
    },
    {
      name: "Taco Bell",
      text: "Think Outside the Bun",
      alternatives: ["Taco Bell"],
    },
    {
      name: "Verizon",
      text: "Can You Hear Me Now?",
      alternatives: ["Verizon"],
    },
    {
      name: "Lay's",
      text: "Betcha Can't Eat Just One",
      alternatives: ["Lay's"],
    },
    {
      name: "Dunkin'",
      text: "America Runs on ________",
      alternatives: ["Dunkin'"],
    },
    {
      name: "Visa",
      text: "Everywhere You Want to Be",
      alternatives: ["Visa"],
    },
    {
      name: "Sprite",
      text: "Obey Your Thirst",
      alternatives: ["Sprite"],
    },
    {
      name: "Goldfish",
      text: "The Snack That Smiles Back",
      alternatives: ["Goldfish"],
    },
    {
      name: "Dairy Queen",
      text: "Hot Eats Cool Treats",
      alternatives: ["Dairy Queen"],
    },
    {
      name: "Energizer",
      text: "It Keeps Going and Going…",
      alternatives: ["Energizer"],
    },
    {
      name: "BMW",
      text: "The Ultimate Driving Machine",
      alternatives: ["BMW"],
    },
    {
      name: "Budweiser",
      text: "The King of Beers",
      alternatives: ["Budweiser"],
    },
    {
      name: "US Marine Corps",
      text: "The Few The Proud The Marines",
      alternatives: ["US Marine Corps"],
    },
    {
      name: "American Express",
      text: "Don't Leave Home Without It",
      alternatives: ["American Express"],
    },
    {
      name: "PlayStation",
      text: "Live in Your World Play in Ours",
      alternatives: ["PlayStation"],
    },
    {
      name: "Adidas",
      text: "Impossible Is Nothing",
      alternatives: ["Adidas"],
    },
    {
      name: "Mazda",
      text: "Zoom Zoom",
      alternatives: ["Mazda"],
    },
    {
      name: "Papa John's",
      text: "Better Ingredients Better Pizza",
      alternatives: ["Papa John's"],
    },
    {
      name: "Lexus",
      text: "The Relentless Pursuit of Perfection",
      alternatives: ["Lexus"],
    },
    {
      name: "Volkswagen",
      text: "Think Small",
      alternatives: ["Volkswagen"],
    },
    {
      name: "Panasonic",
      text: "Ideas for Life",
      alternatives: ["Panasonic"],
    },
    {
      name: "Avis",
      text: "We Try Harder",
      alternatives: ["Avis"],
    },
    {
      name: "Facebook",
      text: "Move Fast and Break Things",
      alternatives: ["Facebook"],
    },
    {
      name: "EA Games",
      text: "Challenge Everything",
      alternatives: ["EA Games"],
    },
    {
      name: "Yellow Pages",
      text: "Let Your Fingers Do the Walking",
      alternatives: ["Yellow Pages"],
    },
    {
      name: "GE",
      text: "Imagination at Work",
      alternatives: ["GE"],
    },
    {
      name: "Nokia",
      text: "Connecting People",
      alternatives: ["Nokia"],
    },
    {
      name: "Snapple",
      text: "Made From the Best Stuff on Earth",
      alternatives: ["Snapple"],
    },
  ],
};

const TaylorSwiftLyricsCategory: CategoryMetadata = {
  name: "Teksty Taylor Swift",
  folder: "taylor-swift-lyrics",
  examples: [
    {
      name: "22",
      text: "I don't know about you but I'm feeling _____",
      alternatives: ["22"],
    },
    {
      name: "off",
      text: "Shake it _____",
      alternatives: ["Shake It Off"],
    },
    {
      name: "yes",
      text: "It's a love story, baby just say _____",
      alternatives: ["Love Story"],
    },
    {
      name: "belong",
      text: "Think I know where you _____, think I know it's with me",
      alternatives: ["You Belong With Me"],
    },
    {
      name: "hipsters",
      text: "It feels like a perfect night to dress up like _____",
      alternatives: ["22"],
    },
    {
      name: "back",
      text: "We are never ever getting _____ together",
      alternatives: ["We Are Never Ever Getting Back Together"],
    },
    {
      name: "real",
      text: "This love is difficult but it's _____",
      alternatives: ["Love Story"],
    },
    {
      name: "daydream",
      text: "Darling I'm a nightmare dressed like a _____",
      alternatives: ["Blank Space"],
    },
    {
      name: "confused",
      text: "We're happy, free, ______, and lonely at the same time",
      alternatives: ["22"],
    },
    {
      name: "bad",
      text: "Cause baby now we've got _____ blood",
      alternatives: ["Bad Blood"],
    },
    {
      name: "party",
      text: "See the lights, see the ______, the ball gowns",
      alternatives: ["Love Story"],
    },
    {
      name: "style",
      text: "We never go out of _____",
      alternatives: ["Style"],
    },
    {
      name: "space",
      text: "I've got a blank _____ baby and I'll write your name",
      alternatives: ["Blank Space"],
    },
    {
      name: "problem",
      text: "It's me, hi, I'm the ______, it's me",
      alternatives: ["Anti-Hero"],
    },
    {
      name: "bullet",
      text: "Band-Aids don't fix _____ holes",
      alternatives: ["Bad Blood"],
    },
    {
      name: "well",
      text: "I remember it all too _____",
      alternatives: ["All Too Well"],
    },
    {
      name: "things",
      text: "I could show you incredible _____",
      alternatives: ["Blank Space"],
    },
    {
      name: "trouble",
      text: "I knew you were _____ when you walked in",
      alternatives: ["I Knew You Were Trouble"],
    },
    {
      name: "letter",
      text: "You were Romeo, I was a scarlet _____",
      alternatives: ["Love Story"],
    },
    {
      name: "James Dean",
      text: "You got that ______ _____ daydream look in your eye",
      alternatives: ["Style"],
    },
    {
      name: "alone",
      text: "Romeo, save me, I've been feeling so _____",
      alternatives: ["Love Story"],
    },
    {
      name: "dead-end",
      text: "Loving him is like driving a new Maserati down a _______ street",
      alternatives: ["Red"],
    },
    {
      name: "promise",
      text: "You call me up again just to break me like a _____",
      alternatives: ["All Too Well"],
    },
    {
      name: "sunset",
      text: "Say you'll remember me standing in a nice dress staring at the _____ babe",
      alternatives: ["Wildest Dreams"],
    },
    {
      name: "needed",
      text: "And I forget about you long enough to forget why I _____ to",
      alternatives: ["All Too Well"],
    },
    {
      name: "New York",
      text: "Welcome to ______, it's been waiting for you",
      alternatives: ["Welcome to New York"],
    },
    {
      name: "disposition",
      text: "Oh, your sweet _____ and my wide-eyed gaze",
      alternatives: ["All Too Well"],
    },
    {
      name: "firework",
      text: "I'm captivated by you, baby, like a _____ show",
      alternatives: ["Sparks Fly"],
    },
    {
      name: "fearless",
      text: "You take my hand and drag me headfirst, _____",
      alternatives: ["Fearless"],
    },
    {
      name: "smile",
      text: "Cause I see sparks fly whenever you _____",
      alternatives: ["Sparks Fly"],
    },
    {
      name: "else",
      text: "Please don't be in love with someone _____",
      alternatives: ["Enchanted"],
    },
    {
      name: "crashed",
      text: "Long live the walls we _____ through",
      alternatives: ["Long Live"],
    },
    {
      name: "changed",
      text: "All I know since yesterday is everything has _____",
      alternatives: ["Everything Has Changed"],
    },
    {
      name: "cafe",
      text: "On a Wednesday in a ______, I watched it begin again",
      alternatives: ["Begin Again"],
    },
    {
      name: "Hello",
      text: "'Cause all I know is we said, ______ And your eyes look like coming home",
      alternatives: ["Everything Has Changed"],
    },
    {
      name: "sad",
      text: "I'm shining like fireworks over your _____ empty town",
      alternatives: ["Dear John"],
    },
    {
      name: "best friend",
      text: "Say my name and everything just stops; I don't want you like a ____ _____",
      alternatives: ["Dress"],
    },
    {
      name: "you",
      text: "Can I go where _____ go?",
      alternatives: ["Lover"],
    },
    {
      name: "ricochet",
      text: "Look at how my tears ______",
      alternatives: ["my tears ricochet"],
    },
    {
      name: "New Year's Day",
      text: "I want your midnights, but I'll be cleanin' up bottles with you on ____ ____ ____",
      alternatives: ["New Year's Day"],
    },
    {
      name: "ours",
      text: "People throw rocks at things that shine but they can't take what's _____",
      alternatives: ["Ours"],
    },
    {
      name: "crowded",
      text: "Now, I'm standin' alone in a ______ room and we're not speakin'",
      alternatives: ["The Story of Us"],
    },
    {
      name: "home",
      text: "You can feel it on the way _____",
      alternatives: ["You Are In Love"],
    },
    {
      name: "lyin'",
      text: "I'm a crumpled up piece of paper _____ here",
      alternatives: ["All Too Well (10 Minute Version)"],
    },
    {
      name: "narcissist",
      text: "I never trust a _______, but they love me",
      alternatives: ["I Did Something Bad"],
    },
    {
      name: "lovers",
      text: "I'll get older, but your ______ stay my age",
      alternatives: ["All Too Well (10 Minute Version)"],
    },
    {
      name: "archer",
      text: "I've been the ______, I've been the prey",
      alternatives: ["The Archer"],
    },
    {
      name: "streets",
      text: "I'm walking fast through the traffic lights, busy _____ and busy lives",
      alternatives: ["State of Grace"],
    },
    {
      name: "cannonball",
      text: "You come around and the armor falls, Pierce the room like a ________",
      alternatives: ["State of Grace"],
    },
    {
      name: "sleepless",
      text: "Two headlights shine through the _______ night and I will get you, get you alone",
      alternatives: ["Treacherous"],
    },
  ],
};

const TheOfficeCategory: CategoryMetadata = {
  name: "The Office",
  folder: "the-office",
  examples: [
    { name: "Michael Scott", image: "michael-scott.jpg", alternatives: [] },
    { name: "Dwight Schrute", image: "dwight-schrute.jpg", alternatives: [] },
    { name: "Jim Halpert", image: "jim-halpert.jpg", alternatives: [] },
    { name: "Pam Beesly", image: "pam-beesly.jpg", alternatives: [] },
    { name: "Angela Martin", image: "angela-martin.jpg", alternatives: [] },
    { name: "Kevin Malone", image: "kevin-malone.jpg", alternatives: [] },
    { name: "Oscar Martinez", image: "oscar-martinez.jpg", alternatives: [] },
    { name: "Stanley Hudson", image: "stanley-hudson.jpg", alternatives: [] },
    { name: "Phyllis Vance", image: "phyllis-vance.jpg", alternatives: [] },
    { name: "Ryan Howard", image: "ryan-howard.jpg", alternatives: [] },
    { name: "Kelly Kapoor", image: "kelly-kapoor.jpg", alternatives: [] },
    { name: "Creed Bratton", image: "creed-bratton.jpg", alternatives: [] },
    {
      name: "Meredith Palmer",
      image: "meredith-palmer.jpg",
      alternatives: [],
    },
    {
      name: "Toby Flenderson",
      image: "toby-flenderson.jpg",
      alternatives: [],
    },
    { name: "Darryl Philbin", image: "darryl-philbin.jpg", alternatives: [] },
    { name: "Andy Bernard", image: "andy-bernard.jpg", alternatives: [] },
    { name: "Erin Hannon", image: "erin-hannon.jpg", alternatives: [] },
    { name: "Jan Levinson", image: "jan-levinson.jpg", alternatives: [] },
    { name: "David Wallace", image: "david-wallace.jpg", alternatives: [] },
    { name: "Holly Flax", image: "holly-flax.jpg", alternatives: [] },
    { name: "Roy Anderson", image: "roy-anderson.jpg", alternatives: [] },
    { name: "Gabe Lewis", image: "gabe-lewis.jpg", alternatives: [] },
    { name: "Clark Green", image: "clark-green.jpg", alternatives: [] },
    { name: "Pete Miller", image: "pete-miller.jpg", alternatives: [] },
    { name: "Nellie Bertram", image: "nellie-bertram.jpg", alternatives: [] },
    {
      name: "Deangelo Vickers",
      image: "deangelo-vickers.jpg",
      alternatives: [],
    },
    {
      name: "Robert California",
      image: "robert-california.jpg",
      alternatives: [],
    },
    {
      name: "Karen Filippelli",
      image: "karen-filippelli.jpg",
      alternatives: [],
    },
    { name: "Jo Bennett", image: "jo-bennett.jpg", alternatives: [] },
    { name: "Todd Packer", image: "todd-packer.jpg", alternatives: [] },
    { name: "Charles Miner", image: "charles-miner.jpg", alternatives: [] },
    { name: "Mose Schrute", image: "mose-schrute.jpg", alternatives: [] },
    { name: "Hank Tate", image: "hank-tate.jpg", alternatives: [] },
    { name: "Josh Porter", image: "josh-porter.jpg", alternatives: [] },
    { name: "Kathy Simms", image: "kathy-simms.jpg", alternatives: [] },
    { name: "Helene Beesly", image: "helene-beesly.jpg", alternatives: [] },
    { name: "Bob Vance", image: "bob-vance.jpg", alternatives: [] },
    { name: "Ben Franklin", image: "ben-franklin.jpg", alternatives: [] },
    {
      name: "Senator Robert Lipton",
      image: "senator-robert-lipton.jpg",
      alternatives: [],
    },
    { name: "Val Johnson", image: "val-johnson.jpg", alternatives: [] },
    { name: "Donna Newton", image: "donna-newton.jpg", alternatives: [] },
    {
      name: "AJ (Holly's boyfriend)",
      image: "aj-hollys-boyfriend.jpg",
      alternatives: [],
    },
    {
      name: "Sasha Flenderson",
      image: "sasha-flenderson.jpg",
      alternatives: [],
    },
    {
      name: "Esther Bruegger",
      image: "esther-bruegger.jpg",
      alternatives: [],
    },
    { name: "Trevor Bortmen", image: "trevor-bortmen.jpg", alternatives: [] },
    { name: "Isabel Poreba", image: "isabel-poreba.jpg", alternatives: [] },
    {
      name: "Jessica (Andy's girlfriend)",
      image: "jessica-andys-girlfriend.jpg",
      alternatives: [],
    },
  ],
};

const ThanksgivingCategory: CategoryMetadata = {
  name: "Święto Dziękczynienia",
  folder: "thanksgiving",
  examples: [
    { name: "Indyk", image: "turkey.jpg", alternatives: ["Turkey"] },
    { name: "Farsz", image: "stuffing.jpg", alternatives: ["Stuffing"] },
    {
      name: "Puree ziemniaczane",
      image: "mashed-potatoes.jpg",
      alternatives: ["Mashed Potatoes"],
    },
    { name: "Sos pieczeniowy", image: "gravy.jpg", alternatives: ["Gravy"] },
    {
      name: "Sos żurawinowy",
      image: "cranberry-sauce.jpg",
      alternatives: ["Cranberry Sauce"],
    },
    {
      name: "Zapiekanka z fasolki",
      image: "green-bean-casserole.jpg",
      alternatives: ["Green Bean Casserole"],
    },
    { name: "Makaron z serem", image: "mac-and-cheese.jpg", alternatives: ["Mac and Cheese"] },
    { name: "Placek dyniowy", image: "pumpkin-pie.jpg", alternatives: ["Pumpkin Pie"] },
    { name: "Szarlotka", image: "apple-pie.jpg", alternatives: ["Apple Pie"] },
    {
      name: "Zapiekanka z batatów",
      image: "sweet-potato-casserole.jpg",
      alternatives: ["Sweet Potato Casserole"],
    },
    { name: "Chlebek kukurydziany", image: "cornbread.jpg", alternatives: ["Cornbread"] },
    {
      name: "Pieczone warzywa",
      image: "roasted-vegetables.jpg",
      alternatives: ["Roasted Vegetables"],
    },
    { name: "Bułeczki", image: "dinner-rolls.jpg", alternatives: ["Dinner Rolls"] },
    { name: "Krojenie indyka", image: "turkey-carving.jpg", alternatives: ["Turkey Carving"] },
    { name: "Friendsgiving", image: "friendsgiving.jpg", alternatives: [] },
    { name: "Rodzina", image: "family.jpg", alternatives: ["Family"] },
    {
      name: "Oglądanie futbolu",
      image: "watching-football.jpg",
      alternatives: ["Watching Football"],
    },
    {
      name: "Parada Macy's",
      image: "macys-thanksgiving-day-parade.jpg",
      alternatives: ["Macy's Thanksgiving Day Parade"],
    },
    {
      name: "Zakupy w Black Friday",
      image: "black-friday-shopping.jpg",
      alternatives: ["Black Friday Shopping"],
    },
    { name: "Resztki", image: "leftovers.jpg", alternatives: ["Leftovers"] },
    { name: "Stolik dla dzieci", image: "kids-table.jpg", alternatives: ["Kid's Table"] },
    { name: "Róg obfitości", image: "cornucopia.jpg", alternatives: ["Cornucopia"] },
    { name: "Obrus", image: "tablecloth.jpg", alternatives: ["Tablecloth"] },
    {
      name: "Łamanie kostki życzeń",
      image: "wishbone-tradition.jpg",
      alternatives: ["Wishbone Tradition"],
    },
    {
      name: "Drzemka po obiedzie",
      image: "post-dinner-nap.jpg",
      alternatives: ["Post-Dinner Nap"],
    },
    { name: "Gry planszowe", image: "board-games.jpg", alternatives: ["Board Games"] },
    {
      name: "Oglądanie świątecznych filmów",
      image: "watching-holiday-movies.jpg",
      alternatives: ["Watching Holiday Movies"],
    },
    { name: "Pieczona szynka", image: "baked-ham.jpg", alternatives: ["Baked Ham"] },
    {
      name: "Brukselka",
      image: "brussels-sprouts.jpg",
      alternatives: ["Brussels Sprouts"],
    },
    { name: "Placek z orzechami pekan", image: "pecan-pie.jpg", alternatives: ["Pecan Pie"] },
    { name: "Jesienne świece", image: "autumn-candles.jpg", alternatives: ["Autumn Candles"] },
    { name: "Cydr", image: "cider.jpg", alternatives: ["Cider"] },
    {
      name: "Sezonowe koktajle",
      image: "seasonal-cocktails.jpg",
      alternatives: ["Seasonal Cocktails"],
    },
    { name: "Podróżowanie", image: "traveling.jpg", alternatives: ["Traveling"] },
    {
      name: "Sprawdzanie indyka",
      image: "checking-the-turkey.JPG",
      alternatives: ["Checking the Turkey"],
    },
    { name: "Kuchnia", image: "kitchen.jpg", alternatives: ["Kitchen"] },
    {
      name: "Biegi Turkey Trot",
      image: "turkey-trot-races.jpg",
      alternatives: ["Turkey Trot Races"],
    },
    { name: "Czas przy kominku", image: "fireplace-time.jpg", alternatives: ["Fireplace Time"] },
    { name: "Jesienne wieńce", image: "fall-wreaths.jpg", alternatives: ["Fall Wreaths"] },
    { name: "Kulki z farszu", image: "stuffing-balls.jpg", alternatives: ["Stuffing Balls"] },
    {
      name: "Marchewki glazurowane syropem klonowym",
      image: "maple-glazed-carrots.jpg",
      alternatives: ["Maple-Glazed Carrots"],
    },
    {
      name: "Zupa z dyni piżmowej",
      image: "butternut-squash-soup.jpg",
      alternatives: ["Butternut Squash Soup"],
    },
    {
      name: "Deski wędlin i serów",
      image: "charcuterie-boards.jpg",
      alternatives: ["Charcuterie Boards"],
    },
    { name: "Jajka faszerowane", image: "deviled-eggs.jpg", alternatives: ["Deviled Eggs"] },
    { name: "Przytulny sweter", image: "cozy-sweater.jpg", alternatives: ["Cozy Sweater"] },
    { name: "Lista wdzięczności", image: "gratitude-list.png", alternatives: ["Gratitude List"] },
    {
      name: "Nakrywanie do stołu",
      image: "setting-the-table.jpg",
      alternatives: ["Setting the table"],
    },
  ],
};

const DogsCategory: CategoryMetadata = {
  name: "Psy",
  folder: "dogs",
  examples: [
    {
      name: "Labrador retriever",
      image: "labrador-retriever.jpg",
      alternatives: ["Labrador Retriever"],
    },
    {
      name: "Golden retriever",
      image: "golden-retriever.jpg",
      alternatives: ["Golden Retriever"],
    },
    {
      name: "Owczarek niemiecki",
      image: "german-shepherd.jpg",
      alternatives: ["German Shepherd"],
    },
    { name: "Buldog francuski", image: "french-bulldog.jpg", alternatives: ["French Bulldog"] },
    { name: "Pudel", image: "poodle.jpg", alternatives: ["Poodle"] },
    { name: "Buldog angielski", image: "bulldog.jpg", alternatives: ["Bulldog"] },
    { name: "Beagle", image: "beagle.jpg", alternatives: [] },
    { name: "Rottweiler", image: "rottweiler.jpg", alternatives: [] },
    {
      name: "Yorkshire terrier",
      image: "yorkshire-terrier.jpg",
      alternatives: ["Yorkshire Terrier"],
    },
    { name: "Jamnik", image: "dachshund.jpg", alternatives: ["Dachshund"] },
    { name: "Bokser", image: "boxer.jpg", alternatives: ["Boxer"] },
    { name: "Husky syberyjski", image: "siberian-husky.jpg", alternatives: ["Siberian Husky"] },
    {
      name: "Owczarek australijski",
      image: "australian-shepherd.jpg",
      alternatives: ["Australian Shepherd"],
    },
    { name: "Shih tzu", image: "shih-tzu.jpg", alternatives: ["Shih Tzu"] },
    {
      name: "Doberman",
      image: "doberman-pinscher.jpg",
      alternatives: ["Doberman Pinscher"],
    },
    { name: "Dog niemiecki", image: "great-dane.jpg", alternatives: ["Great Dane"] },
    {
      name: "Welsh corgi pembroke",
      image: "pembroke-welsh-corgi.jpg",
      alternatives: ["Pembroke Welsh Corgi"],
    },
    {
      name: "Sznaucer miniaturowy",
      image: "miniature-schnauzer.jpg",
      alternatives: ["Miniature Schnauzer"],
    },
    { name: "Hawańczyk", image: "havanese.jpg", alternatives: ["Havanese"] },
    {
      name: "Berneński pies pasterski",
      image: "bernese-mountain-dog.jpg",
      alternatives: ["Bernese Mountain Dog"],
    },
    {
      name: "Cavalier king charles spaniel",
      image: "cavalier-king-charles-spaniel.jpg",
      alternatives: ["Cavalier King Charles Spaniel"],
    },
    {
      name: "Owczarek szetlandzki",
      image: "shetland-sheepdog.jpg",
      alternatives: ["Shetland Sheepdog"],
    },
    { name: "Boston terrier", image: "boston-terrier.jpg", alternatives: ["Boston Terrier"] },
    { name: "Szpic miniaturowy", image: "pomeranian.jpg", alternatives: ["Pomeranian"] },
    { name: "Border collie", image: "border-collie.jpg", alternatives: ["Border Collie"] },
    { name: "Bichon frise", image: "bichon-frise.jpg", alternatives: ["Bichon Frise"] },
    { name: "Shiba inu", image: "shiba-inu.jpg", alternatives: ["Shiba Inu"] },
    { name: "Maltańczyk", image: "maltese.jpg", alternatives: ["Maltese"] },
    { name: "Cocker spaniel", image: "cocker-spaniel.jpg", alternatives: ["Cocker Spaniel"] },
    { name: "Chihuahua", image: "chihuahua.jpg", alternatives: [] },
    {
      name: "Springer spaniel angielski",
      image: "english-springer-spaniel.jpg",
      alternatives: ["English Springer Spaniel"],
    },
    { name: "Goldendoodle", image: "goldendoodle.jpg", alternatives: [] },
    { name: "Wyżeł węgierski", image: "vizsla.jpg", alternatives: ["Vizsla"] },
    { name: "Cane corso", image: "cane-corso.jpg", alternatives: ["Cane Corso"] },
    { name: "Nowofundland", image: "newfoundland.jpg", alternatives: ["Newfoundland"] },
    { name: "Wyżeł weimarski", image: "weimaraner.jpg", alternatives: ["Weimaraner"] },
    { name: "Akita", image: "akita.jpg", alternatives: [] },
    { name: "Samojed", image: "samoyed.jpg", alternatives: ["Samoyed"] },
    { name: "Seter irlandzki", image: "irish-setter.jpg", alternatives: ["Irish Setter"] },
    { name: "Chart angielski", image: "greyhound.jpg", alternatives: ["Greyhound"] },
    { name: "Whippet", image: "whippet.jpg", alternatives: [] },
    {
      name: "Australijski pies pasterski",
      image: "australian-cattle-dog.jpg",
      alternatives: ["Australian Cattle Dog"],
    },
    { name: "Posokowiec", image: "bloodhound.jpg", alternatives: ["Bloodhound"] },
    {
      name: "Alaskan malamute",
      image: "alaskan-malamute.jpg",
      alternatives: ["Alaskan Malamute"],
    },
    { name: "Bernardyn", image: "saint-bernard.jpg", alternatives: ["Saint Bernard"] },
    {
      name: "Portugalski pies dowodny",
      image: "portuguese-water-dog.jpg",
      alternatives: ["Portuguese Water Dog"],
    },
    {
      name: "Charcik włoski",
      image: "italian-greyhound.jpg",
      alternatives: ["Italian Greyhound"],
    },
    {
      name: "Rhodesian ridgeback",
      image: "rhodesian-ridgeback.jpg",
      alternatives: ["Rhodesian Ridgeback"],
    },
    {
      name: "Amerykański pies eskimoski",
      image: "american-eskimo-dog.jpg",
      alternatives: ["American Eskimo Dog"],
    },
  ],
};

const HorsesCategory: CategoryMetadata = {
  name: "Konie",
  folder: "horses",
  examples: [
    { name: "Siodła", image: "saddles.jpg", alternatives: ["Saddles"] },
    { name: "Wodze", image: "reins.jpg", alternatives: ["Reins"] },
    { name: "Paint Horse", image: "paint-horse.jpg", alternatives: [] },
    { name: "Mustang", image: "mustang.jpg", alternatives: [] },
    { name: "Clydesdale", image: "clydesdale.jpg", alternatives: [] },
    { name: "Koń fryzyjski", image: "friesian.jpg", alternatives: ["Friesian"] },
    { name: "Kowboj", image: "cowboy.jpg", alternatives: ["Cowboy"] },
    { name: "Derka", image: "blanket.JPG", alternatives: ["Blanket"] },
    { name: "Wyścigi konne", image: "horse-racing.jpg", alternatives: ["Horse Racing"] },
    { name: "Skoki przez przeszkody", image: "show-jumping.jpg", alternatives: ["Show Jumping"] },
    { name: "Ujeżdżenie", image: "dressage.jpg", alternatives: ["Dressage"] },
    { name: "Wyścigi wokół beczek", image: "barrel-racing.jpg", alternatives: ["Barrel Racing"] },
    { name: "Rodeo", image: "rodeo-riding.jpg", alternatives: ["Rodeo Riding"] },
    {
      name: "Lekcje jazdy konnej",
      image: "horseback-riding-lessons.jpg",
      alternatives: ["Horseback Riding Lessons"],
    },
    { name: "Strzemiona", image: "stirrups.jpg", alternatives: ["Stirrups"] },
    { name: "Ogłowia", image: "bridles.jpg", alternatives: ["Bridles"] },
    { name: "Podkowy", image: "horseshoes.jpg", alternatives: ["Horseshoes"] },
    { name: "Pielęgnacja konia", image: "horse-grooming.jpg", alternatives: ["Horse Grooming"] },
    { name: "Kopystki", image: "hoof-picks.jpg", alternatives: ["Hoof Picks"] },
    { name: "Stajnie", image: "stables.jpeg", alternatives: ["Stables"] },
    { name: "Stodoły", image: "barns.jpg", alternatives: ["Barns"] },
    { name: "Przyczepy do koni", image: "horse-trailers.jpg", alternatives: ["Horse Trailers"] },
    { name: "Pasza dla koni", image: "horse-feed.jpg", alternatives: ["Horse Feed"] },
    { name: "Bele siana", image: "hay-bales.png", alternatives: ["Hay Bales"] },
    { name: "Pastwiska", image: "pastures.jpg", alternatives: ["Pastures"] },
    { name: "Kaski jeździeckie", image: "riding-helmets.jpg", alternatives: ["Riding Helmets"] },
    { name: "Czapraki", image: "saddle-pads.jpg", alternatives: ["Saddle Pads"] },
    { name: "Wędzidło", image: "bit.jpg", alternatives: ["Bit"] },
    { name: "Zaplatanie grzywy", image: "mane-braiding.jpg", alternatives: ["Mane Braiding"] },
    { name: "Kopyto", image: "hoof.png", alternatives: ["Hoof"] },
    { name: "Źrebię", image: "foal.jpg", alternatives: ["Foal"] },
    { name: "Spirit", image: "spirit.jpeg", alternatives: [] },
    { name: "Appaloosa", image: "appaloosa.jpg", alternatives: [] },
    { name: "Maximus", image: "maximus.jpg", alternatives: [] },
    { name: "Bullseye", image: "bullseye.png", alternatives: [] },
    {
      name: "Bojack Horseman",
      image: "bojack-horseman.jpg",
      alternatives: [],
    },
    { name: "Pegaz", image: "pegasus.jpg", alternatives: ["Pegasus"] },
    { name: "My Little Pony", image: "my-little-pony.jpg", alternatives: [] },
    { name: "Jednorożec", image: "unicorn.jpeg", alternatives: ["Unicorn"] },
    { name: "Perszeron", image: "percheron.jpg", alternatives: ["Percheron"] },
    { name: "Rajd konny", image: "trail-riding.jpg", alternatives: ["Trail Riding"] },
    {
      name: "Koń miniaturowy",
      image: "miniature-horse.jpg",
      alternatives: ["Miniature Horse"],
    },
    {
      name: "Konie policji konnej",
      image: "mounted-police-horses.jpg",
      alternatives: ["Mounted Police Horses"],
    },
    {
      name: "Konie zaprzęgowe",
      image: "carriage-horses.jpg",
      alternatives: ["Carriage Horses"],
    },
    { name: "Posąg", image: "statue.JPG", alternatives: ["Statue"] },
    { name: "Weterynarze koni", image: "equine-vets.jpg", alternatives: ["Equine Vets"] },
    { name: "Klapki na oczy", image: "blinker.png", alternatives: ["Blinker"] },
  ],
};

const RomComsCategory: CategoryMetadata = {
  name: "Komedie romantyczne",
  folder: "rom-coms",
  examples: [
    {
      name: "Kiedy Harry poznał Sally",
      image: "when-harry-met-sally.jpg",
      alternatives: ["When Harry Met Sally"],
    },
    { name: "Pretty Woman", image: "pretty-woman.jpg", alternatives: [] },
    {
      name: "Narzeczona dla księcia",
      image: "the-princess-bride.jpg",
      alternatives: ["The Princess Bride"],
    },
    {
      name: "Bezsenność w Seattle",
      image: "sleepless-in-seattle.jpg",
      alternatives: ["Sleepless in Seattle"],
    },
    {
      name: "Masz wiadomość",
      image: "youve-got-mail.jpg",
      alternatives: ["You've Got Mail"],
    },
    { name: "Notting Hill", image: "notting-hill.jpg", alternatives: [] },
    {
      name: "Zakochana złośnica",
      image: "10-things-i-hate-about-you.jpg",
      alternatives: ["10 Things I Hate About You"],
    },
    { name: "To właśnie miłość", image: "love-actually.jpg", alternatives: ["Love Actually"] },
    {
      name: "Dziennik Bridget Jones",
      image: "bridget-joness-diary.jpg",
      alternatives: ["Bridget Jones's Diary"],
    },
    {
      name: "Moje wielkie greckie wesele",
      image: "my-big-fat-greek-wedding.jpg",
      alternatives: ["My Big Fat Greek Wedding"],
    },
    {
      name: "Jak stracić chłopaka w 10 dni",
      image: "how-to-lose-a-guy-in-10-days.jpg",
      alternatives: ["How to Lose a Guy in 10 Days"],
    },
    { name: "13 Going on 30", image: "13-going-on-30.jpg", alternatives: [] },
    { name: "Narzeczony mimo woli", image: "the-proposal.jpg", alternatives: ["The Proposal"] },
    { name: "Clueless", image: "clueless.jpg", alternatives: [] },
    { name: "Legalna blondynka", image: "legally-blonde.jpg", alternatives: ["Legally Blonde"] },
    { name: "50 pierwszych randek", image: "50-first-dates.jpg", alternatives: ["50 First Dates"] },
    {
      name: "Chłopaki też płaczą",
      image: "forgetting-sarah-marshall.jpg",
      alternatives: ["Forgetting Sarah Marshall"],
    },
    {
      name: "The Wedding Singer",
      image: "the-wedding-singer.jpg",
      alternatives: [],
    },
    { name: "Mamma Mia!", image: "mamma-mia.jpg", alternatives: [] },
    { name: "Pretty in Pink", image: "pretty-in-pink.jpg", alternatives: [] },
    {
      name: "Szesnaście świeczek",
      image: "sixteen-candles.jpg",
      alternatives: ["Sixteen Candles"],
    },
    { name: "Rzymskie wakacje", image: "roman-holiday.jpg", alternatives: ["Roman Holiday"] },
    {
      name: "Śniadanie u Tiffany'ego",
      image: "breakfast-at-tiffanys.jpg",
      alternatives: ["Breakfast at Tiffany's"],
    },
    {
      name: "Ja cię kocham, a ty śpisz",
      image: "while-you-were-sleeping.jpg",
      alternatives: ["While You Were Sleeping"],
    },
    {
      name: "Cztery wesela i pogrzeb",
      image: "four-weddings-and-a-funeral.jpg",
      alternatives: ["Four Weddings and a Funeral"],
    },
    { name: "Hitch", image: "hitch.jpg", alternatives: [] },
    { name: "Jerry Maguire", image: "jerry-maguire.jpg", alternatives: [] },
    {
      name: "Zakochany Szekspir",
      image: "shakespeare-in-love.jpg",
      alternatives: ["Shakespeare in Love"],
    },
    { name: "The Holiday", image: "the-holiday.jpg", alternatives: [] },
    {
      name: "Poradnik pozytywnego myślenia",
      image: "silver-linings-playbook.jpg",
      alternatives: ["Silver Linings Playbook"],
    },
    { name: "La La Land", image: "la-la-land.jpg", alternatives: [] },
    { name: "Czas na miłość", image: "about-time.jpg", alternatives: ["About Time"] },
    {
      name: "Bajecznie bogaci Azjaci",
      image: "crazy-rich-asians.jpg",
      alternatives: ["Crazy Rich Asians"],
    },
    {
      name: "Do wszystkich chłopców, których kochałam",
      image: "to-all-the-boys-ive-loved-before.jpg",
      alternatives: ["To All the Boys I've Loved Before"],
    },
    { name: "The Big Sick", image: "the-big-sick.jpg", alternatives: [] },
    {
      name: "Always Be My Maybe",
      image: "always-be-my-maybe.jpg",
      alternatives: [],
    },
    { name: "Set It Up", image: "set-it-up.jpg", alternatives: [] },
    {
      name: "Prosto w serce",
      image: "music-and-lyrics.jpg",
      alternatives: ["Music and Lyrics"],
    },
    {
      name: "The American President",
      image: "the-american-president.jpg",
      alternatives: [],
    },
    { name: "Wpływ księżyca", image: "moonstruck.jpg", alternatives: ["Moonstruck"] },
    { name: "Plusk", image: "splash.jpg", alternatives: ["Splash"] },
    {
      name: "The Decoy Bride",
      image: "the-decoy-bride.jpg",
      alternatives: [],
    },
    {
      name: "Nappily Ever After",
      image: "nappily-ever-after.jpg",
      alternatives: [],
    },
    { name: "The Half of It", image: "the-half-of-it.jpg", alternatives: [] },
    { name: "Amelia", image: "amÃ©lie.jpg", alternatives: ["Amelie"] },
  ],
};

const AmusementParksCategory: CategoryMetadata = {
  name: "Wesołe miasteczka",
  folder: "amusement-parks",
  examples: [
    {
      name: "Kolejka górska",
      image: "roller-coaster.jpg",
      alternatives: ["Roller Coaster"],
    },
    {
      name: "Diabelski młyn",
      image: "ferris-wheel.jpg",
      alternatives: ["Ferris Wheel"],
    },
    {
      name: "Karuzela",
      image: "carousel.jpg",
      alternatives: ["Carousel"],
    },
    {
      name: "Automaty do gier",
      image: "arcade-games.jpg",
      alternatives: ["Arcade Games"],
    },
    {
      name: "Samochodziki",
      image: "bumper-cars.jpg",
      alternatives: ["Bumper Cars"],
    },
    {
      name: "Wata cukrowa",
      image: "cotton-candy.jpg",
      alternatives: ["Cotton Candy"],
    },
    {
      name: "Ciasto lejkowe",
      image: "funnel-cake.jpg",
      alternatives: ["Funnel Cake"],
    },
    {
      name: "Hot dogi",
      image: "hot-dogs.jpg",
      alternatives: ["Hot Dogs"],
    },
    {
      name: "Lody",
      image: "ice-cream.jpg",
      alternatives: ["Ice Cream"],
    },
    {
      name: "Popcorn",
      image: "popcorn.jpg",
      alternatives: [],
    },
    {
      name: "Precle",
      image: "pretzels.jpg",
      alternatives: ["Pretzels"],
    },
    {
      name: "Churros",
      image: "churros.jpg",
      alternatives: [],
    },
    {
      name: "Pokaz fajerwerków",
      image: "fireworks-show.jpg",
      alternatives: ["Fireworks Show"],
    },
    {
      name: "Spotkania z postaciami",
      image: "character-meet-and-greets.jpg",
      alternatives: ["Character Meet And Greets"],
    },
    {
      name: "Sklep z pamiątkami",
      image: "gift-shop.jpg",
      alternatives: ["Gift Shop"],
    },
    {
      name: "Pluszaki",
      image: "stuffed-animals.jpg",
      alternatives: ["Stuffed Animals"],
    },
    {
      name: "Rwąca rzeka",
      image: "log-flume.jpg",
      alternatives: ["Log Flume"],
    },
    {
      name: "Wieża swobodnego spadania",
      image: "drop-tower.jpg",
      alternatives: ["Drop Tower"],
    },
    {
      name: "Karuzela łańcuchowa",
      image: "swing-ride.jpg",
      alternatives: ["Swing Ride"],
    },
    {
      name: "Filiżanki",
      image: "tea-cups.jpg",
      alternatives: ["Tea Cups"],
    },
    {
      name: "Kolejka",
      image: "train-ride.JPG",
      alternatives: ["Train Ride"],
    },
    {
      name: "Zjeżdżalnia wodna",
      image: "water-slide.jpg",
      alternatives: ["Water Slide"],
    },
    {
      name: "Nawiedzony dom",
      image: "haunted-house.jpg",
      alternatives: ["Haunted House"],
    },
    {
      name: "Minigolf",
      image: "mini-golf.jpg",
      alternatives: ["Mini Golf"],
    },
    {
      name: "Gokarty",
      image: "go-karts.jpg",
      alternatives: ["Go Karts"],
    },
    {
      name: "Łódki zderzakowe",
      image: "bumper-boats.jpg",
      alternatives: ["Bumper Boats"],
    },
    {
      name: "Parady",
      image: "parades.jpg",
      alternatives: ["Parades"],
    },
    {
      name: "Budki z jedzeniem",
      image: "food-vendors.jpg",
      alternatives: ["Food Vendors"],
    },
    {
      name: "Automat z napojami",
      image: "soda-fountain.jpg",
      alternatives: ["Soda Fountain"],
    },
    {
      name: "Stoisko z lemoniadą",
      image: "lemonade-stand.jpg",
      alternatives: ["Lemonade Stand"],
    },
    {
      name: "Udka z indyka",
      image: "turkey-legs.jpg",
      alternatives: ["Turkey Legs"],
    },
    {
      name: "Kolejki",
      image: "lines.jpg",
      alternatives: ["Lines"],
    },
    {
      name: "Szafki",
      image: "lockers.jpg",
      alternatives: ["Lockers"],
    },
    {
      name: "Mapy parku",
      image: "park-maps.jpg",
      alternatives: ["Park Maps"],
    },
    {
      name: "Maskotki parku",
      image: "park-mascots.jpg",
      alternatives: ["Park Mascots"],
    },
    {
      name: "Mini zoo",
      image: "petting-zoo.jpg",
      alternatives: ["Petting Zoo"],
    },
    {
      name: "Krzywe zwierciadła",
      image: "funhouse-mirrors.jpg",
      alternatives: ["Funhouse Mirrors"],
    },
    {
      name: "Obsługa atrakcji",
      image: "ride-operators.jpg",
      alternatives: ["Ride Operators"],
    },
    {
      name: "Ochroniarze",
      image: "security-guards.jpg",
      alternatives: ["Security Guards"],
    },
    {
      name: "Gąsienica",
      image: "caterpillar.jpg",
      alternatives: ["Caterpillar"],
    },
    {
      name: "Kino 4D",
      image: "4d-theater.jpg",
      alternatives: ["4d Theater"],
    },
    {
      name: "Przejażdżka wozem z sianem",
      image: "hayride.jpg",
      alternatives: ["Hayride"],
    },
    {
      name: "Ekipa techniczna",
      image: "maintenance-crew.jpg",
      alternatives: ["Maintenance Crew"],
    },
  ],
};

const FairFoodsCategory: CategoryMetadata = {
  name: "Jedzenie z jarmarku",
  folder: "fair-foods",
  examples: [
    {
      name: "Corn dog",
      image: "corn-dog.jpg",
      alternatives: ["Corn Dog"],
    },
    {
      name: "Ciasto lejkowe",
      image: "funnel-cake.jpg",
      alternatives: ["Funnel Cake"],
    },
    {
      name: "Wata cukrowa",
      image: "cotton-candy.jpg",
      alternatives: ["Cotton Candy"],
    },
    {
      name: "Jabłka w karmelu",
      image: "caramel-apples.jpg",
      alternatives: ["Caramel Apples"],
    },
    {
      name: "Słoniowe ucho",
      image: "elephant-ear.jpg",
      alternatives: ["Elephant Ear"],
    },
    {
      name: "Smażone Oreo",
      image: "fried-oreos.jpg",
      alternatives: ["Fried Oreos"],
    },
    {
      name: "Słodko-słony popcorn",
      image: "kettle-corn.jpg",
      alternatives: ["Kettle Corn"],
    },
    {
      name: "Smażone ogórki",
      image: "fried-pickles.jpg",
      alternatives: ["Fried Pickles"],
    },
    {
      name: "Popcorn",
      image: "popcorn.jpg",
      alternatives: [],
    },
    {
      name: "Smażone kulki serowe",
      image: "fried-cheese-curds.jpg",
      alternatives: ["Fried Cheese Curds"],
    },
    {
      name: "Lody włoskie",
      image: "soft-serve-ice-cream.jpg",
      alternatives: ["Soft Serve Ice Cream"],
    },
    {
      name: "Smażone Twinkies",
      image: "fried-twinkies.jpg",
      alternatives: ["Fried Twinkies"],
    },
    {
      name: "Lody sorbetowe z syropem",
      image: "snow-cone.jpg",
      alternatives: ["Snow Cone"],
    },
    {
      name: "Smażony Snickers",
      image: "fried-snickers.jpg",
      alternatives: ["Fried Snickers"],
    },
    {
      name: "Lemoniada",
      image: "lemonade-shake-up.jpg",
      alternatives: ["Lemonade Shake Up"],
    },
    {
      name: "Wielki precel",
      image: "giant-pretzel.jpg",
      alternatives: ["Giant Pretzel"],
    },
    {
      name: "Paluszki z mozzarelli",
      image: "mozzarella-sticks.jpg",
      alternatives: ["Mozzarella Sticks"],
    },
    {
      name: "Kęski precla",
      image: "pretzel-bites.jpg",
      alternatives: ["Pretzel Bites"],
    },
    {
      name: "Frytki spiralne",
      image: "curly-fries.jpg",
      alternatives: ["Curly Fries"],
    },
    {
      name: "Skrzydełka buffalo",
      image: "buffalo-wings.jpg",
      alternatives: ["Buffalo Wings"],
    },
    {
      name: "Kanapka z włoską kiełbasą",
      image: "italian-sausage-sandwich.jpg",
      alternatives: ["Italian Sausage Sandwich"],
    },
    {
      name: "Gyros",
      image: "gyro.jpg",
      alternatives: ["Gyro"],
    },
    {
      name: "Udko z indyka",
      image: "turkey-leg.jpg",
      alternatives: ["Turkey Leg"],
    },
    {
      name: "Nachosy z dodatkami",
      image: "loaded-nachos.jpg",
      alternatives: ["Loaded Nachos"],
    },
    {
      name: "Mini pączki",
      image: "mini-donuts.jpg",
      alternatives: ["Mini Donuts"],
    },
    {
      name: "Gofr na patyku",
      image: "waffle-stick.jpg",
      alternatives: ["Waffle Stick"],
    },
    {
      name: "Taco w torebce",
      image: "walking-taco.jpg",
      alternatives: ["Walking Taco"],
    },
    {
      name: "Churros",
      image: "churros.jpg",
      alternatives: [],
    },
    {
      name: "Kolba kukurydzy",
      image: "corn-on-the-cob.jpg",
      alternatives: ["Corn On The Cob"],
    },
    {
      name: "Smażone lody",
      image: "fried-ice-cream.jpg",
      alternatives: ["Fried Ice Cream"],
    },
    {
      name: "Pieczony ziemniak",
      image: "baked-potato.jpg",
      alternatives: ["Baked Potato"],
    },
    {
      name: "Cebulowy kwiat",
      image: "blooming-onion.jpg",
      alternatives: ["Blooming Onion"],
    },
    {
      name: "Ogórek na patyku",
      image: "pickle-on-a-stick.jpg",
      alternatives: ["Pickle On A Stick"],
    },
    {
      name: "Smażone pieczarki",
      image: "fried-mushrooms.jpg",
      alternatives: ["Fried Mushrooms"],
    },
    {
      name: "Kiełbaska na patyku",
      image: "sausage-on-a-stick.jpg",
      alternatives: ["Sausage On A Stick"],
    },
    {
      name: "Smażone zielone pomidory",
      image: "fried-green-tomatoes.jpg",
      alternatives: ["Fried Green Tomatoes"],
    },
    {
      name: "Kanapka z wędzoną wołowiną",
      image: "smoked-brisket-sandwich.jpg",
      alternatives: ["Smoked Brisket Sandwich"],
    },
    {
      name: "Smażone plasterki jalapeño",
      image: "fried-jalapeño-slices.jpg",
      alternatives: ["Fried Jalapeño Slices"],
    },
    {
      name: "Smażony makaron z serem",
      image: "fried-mac-and-cheese.jpg",
      alternatives: ["Fried Mac And Cheese"],
    },
    {
      name: "Smażona kanapka z masłem orzechowym i dżemem",
      image: "fried-pbj.jpg",
      alternatives: ["Fried Pbj"],
    },
    {
      name: "Krewetki w kokosie",
      image: "fried-coconut-shrimp.jpg",
      alternatives: ["Fried Coconut Shrimp"],
    },
    {
      name: "Smażony banan",
      image: "fried-banana.jpg",
      alternatives: ["Fried Banana"],
    },
    {
      name: "Smażony placek",
      image: "deep-fried-pie.jpg",
      alternatives: ["Deep Fried Pie"],
    },
    {
      name: "Smażone brownie",
      image: "deep-fried-brownie.jpg",
      alternatives: ["Deep Fried Brownie"],
    },
    {
      name: "Smażone awokado",
      image: "fried-avocado.jpg",
      alternatives: ["Fried Avocado"],
    },
    {
      name: "Smażone ciasto na ciasteczka",
      image: "fried-cookie-dough.jpg",
      alternatives: ["Fried Cookie Dough"],
    },
    {
      name: "Bekon w czekoladzie",
      image: "chocolate-dipped-bacon.jpg",
      alternatives: ["Chocolate Dipped Bacon"],
    },
  ],
};

const FamousPeopleWhoDiedBeforeTurning30Category: CategoryMetadata = {
  name: "Sławni, którzy zmarli przed 30",
  folder: "famous-people-under-30",
  examples: [
    {
      name: "Kurt Cobain",
      image: "kurt-cobain.jpg",
      alternatives: [],
    },
    {
      name: "Tupac Shakur",
      image: "tupac-shakur.jpg",
      alternatives: [],
    },
    {
      name: "James Dean",
      image: "james-dean.jpg",
      alternatives: [],
    },
    {
      name: "Jimi Hendrix",
      image: "jimi-hendrix.jpg",
      alternatives: [],
    },
    {
      name: "Janis Joplin",
      image: "janis-joplin.jpg",
      alternatives: [],
    },
    {
      name: "Jim Morrison",
      image: "jim-morrison.jpg",
      alternatives: [],
    },
    {
      name: "The Notorious Big",
      image: "the-notorious-big.jpg",
      alternatives: [],
    },
    {
      name: "Aaliyah",
      image: "aaliyah.jpg",
      alternatives: [],
    },
    {
      name: "Amy Winehouse",
      image: "amy-winehouse.jpg",
      alternatives: [],
    },
    {
      name: "Avicii",
      image: "avicii.jpg",
      alternatives: [],
    },
    {
      name: "Juice Wrld",
      image: "juice-wrld.jpg",
      alternatives: [],
    },
    {
      name: "Lil Peep",
      image: "lil-peep.jpg",
      alternatives: [],
    },
    {
      name: "Xxxtentacion",
      image: "xxxtentacion.jpg",
      alternatives: [],
    },
    {
      name: "River Phoenix",
      image: "river-phoenix.jpg",
      alternatives: [],
    },
    {
      name: "Brandon Lee",
      image: "brandon-lee.jpg",
      alternatives: [],
    },
    {
      name: "Anne Frank",
      image: "anne-frank.jpg",
      alternatives: [],
    },
    {
      name: "Joan Of Arc",
      image: "joan-of-arc.jpg",
      alternatives: [],
    },
    {
      name: "Tutankhamun",
      image: "tutankhamun.jpg",
      alternatives: [],
    },
    {
      name: "Buddy Holly",
      image: "buddy-holly.jpg",
      alternatives: [],
    },
    {
      name: "Ritchie Valens",
      image: "ritchie-valens.jpg",
      alternatives: [],
    },
    {
      name: "Otis Redding",
      image: "otis-redding.jpg",
      alternatives: [],
    },
    {
      name: "Hank Williams",
      image: "hank-williams.jpg",
      alternatives: [],
    },
    {
      name: "Sid Vicious",
      image: "sid-vicious.jpg",
      alternatives: [],
    },
    {
      name: "Brian Jones",
      image: "brian-jones.jpg",
      alternatives: [],
    },
    {
      name: "Stuart Sutcliffe",
      image: "stuart-sutcliffe.jpg",
      alternatives: [],
    },
    {
      name: "Robert Johnson",
      image: "robert-johnson.jpg",
      alternatives: [],
    },
    {
      name: "Anton Yelchin",
      image: "anton-yelchin.jpg",
      alternatives: [],
    },
    {
      name: "Christina Grimmie",
      image: "christina-grimmie.jpg",
      alternatives: [],
    },
    {
      name: "Gia Carangi",
      image: "gia-carangi.jpg",
      alternatives: [],
    },
    {
      name: "Jean Harlow",
      image: "jean-harlow.jpg",
      alternatives: [],
    },
    {
      name: "Jonathan Brandis",
      image: "jonathan-brandis.jpg",
      alternatives: [],
    },
    {
      name: "Heather Orourke",
      image: "heather-orourke.jpg",
      alternatives: [],
    },
    {
      name: "Bobby Fuller",
      image: "bobby-fuller.jpg",
      alternatives: [],
    },
    {
      name: "Nick Drake",
      image: "nick-drake.jpg",
      alternatives: [],
    },
    {
      name: "Peaches Geldof",
      image: "peaches-geldof.jpg",
      alternatives: [],
    },
    {
      name: "Leslie Harvey",
      image: "leslie-harvey.jpg",
      alternatives: [],
    },
    {
      name: "Lil Snupe",
      image: "lil-snupe.jpg",
      alternatives: [],
    },
    {
      name: "Pocahontas",
      image: "pocahontas.jpg",
      alternatives: [],
    },
    {
      name: "John Keats",
      image: "john-keats.jpg",
      alternatives: [],
    },
    {
      name: "Percy Bysshe Shelley",
      image: "percy-bysshe-shelley.jpg",
      alternatives: [],
    },
    {
      name: "Stephen Foster",
      image: "stephen-foster.jpg",
      alternatives: [],
    },
    {
      name: "Henry Moseley",
      image: "henry-moseley.jpg",
      alternatives: [],
    },
    {
      name: "Lady Jane Grey",
      image: "lady-jane-grey.jpg",
      alternatives: [],
    },
    {
      name: "Princess Charlotte Of Wales",
      image: "princess-charlotte-of-wales.jpg",
      alternatives: [],
    },
    {
      name: "David Rizzio",
      image: "david-rizzio.jpg",
      alternatives: [],
    },
    {
      name: "Edward Vi",
      image: "edward-vi.jpg",
      alternatives: [],
    },
    {
      name: "Évariste Galois",
      image: "Ã©variste-galois.jpg",
      alternatives: [],
    },
  ],
};

const FastFoodChainsCategory: CategoryMetadata = {
  name: "Sieci fast food",
  folder: "fast-food-chains",
  examples: [
    {
      name: "Mcdonalds",
      image: "mcdonalds.jpg",
      alternatives: [],
    },
    {
      name: "Burger King",
      image: "burger-king.jpg",
      alternatives: [],
    },
    {
      name: "Taco Bell",
      image: "taco-bell.jpg",
      alternatives: [],
    },
    {
      name: "Kfc",
      image: "kfc.jpg",
      alternatives: [],
    },
    {
      name: "Subway",
      image: "subway.jpg",
      alternatives: [],
    },
    {
      name: "Pizza Hut",
      image: "pizza-hut.jpg",
      alternatives: [],
    },
    {
      name: "Dominos",
      image: "dominos.jpg",
      alternatives: [],
    },
    {
      name: "Wendys",
      image: "wendys.jpg",
      alternatives: [],
    },
    {
      name: "Chick Fil A",
      image: "chick-fil-a.jpg",
      alternatives: [],
    },
    {
      name: "Chipotle",
      image: "chipotle.jpg",
      alternatives: [],
    },
    {
      name: "Dairy Queen",
      image: "dairy-queen.jpg",
      alternatives: [],
    },
    {
      name: "Sonic",
      image: "sonic.jpg",
      alternatives: [],
    },
    {
      name: "Arbys",
      image: "arbys.jpg",
      alternatives: [],
    },
    {
      name: "Popeyes",
      image: "popeyes.jpg",
      alternatives: [],
    },
    {
      name: "Panda Express",
      image: "panda-express.jpg",
      alternatives: [],
    },
    {
      name: "Papa Johns",
      image: "papa-johns.jpg",
      alternatives: [],
    },
    {
      name: "Jimmy Johns",
      image: "jimmy-johns.jpg",
      alternatives: [],
    },
    {
      name: "Jersey Mikes",
      image: "jersey-mikes.jpg",
      alternatives: [],
    },
    {
      name: "Wingstop",
      image: "wingstop.jpg",
      alternatives: [],
    },
    {
      name: "Shake Shack",
      image: "shake-shack.jpg",
      alternatives: [],
    },
    {
      name: "In N Out",
      image: "in-n-out.jpg",
      alternatives: [],
    },
    {
      name: "White Castle",
      image: "white-castle.jpg",
      alternatives: [],
    },
    {
      name: "Jack In The Box",
      image: "jack-in-the-box.jpg",
      alternatives: [],
    },
    {
      name: "Hardees",
      image: "hardees.jpg",
      alternatives: [],
    },
    {
      name: "Red Robin",
      image: "red-robin.jpg",
      alternatives: [],
    },
    {
      name: "Smashburger",
      image: "smashburger.jpg",
      alternatives: [],
    },
    {
      name: "Potbelly",
      image: "potbelly.jpg",
      alternatives: [],
    },
    {
      name: "Cava",
      image: "cava.jpg",
      alternatives: [],
    },
    {
      name: "Blaze Pizza",
      image: "blaze-pizza.jpg",
      alternatives: [],
    },
    {
      name: "Culvers",
      image: "culvers.jpg",
      alternatives: [],
    },
    {
      name: "El Pollo Loco",
      image: "el-pollo-loco.jpg",
      alternatives: [],
    },
    {
      name: "Boston Market",
      image: "boston-market.jpg",
      alternatives: [],
    },
    {
      name: "Noodles Company",
      image: "noodles-company.jpg",
      alternatives: [],
    },
    {
      name: "Einstein Bros Bagels",
      image: "einstein-bros-bagels.jpg",
      alternatives: [],
    },
    {
      name: "Bojangles",
      image: "bojangles.jpg",
      alternatives: [],
    },
    {
      name: "Whataburger",
      image: "whataburger.jpg",
      alternatives: [],
    },
    {
      name: "Torchys Tacos",
      image: "torchys-tacos.jpg",
      alternatives: [],
    },
  ],
};

const FridgeCategory: CategoryMetadata = {
  name: "Lodówka",
  folder: "fridge",
  examples: [
    {
      name: "Mleko",
      image: "milk.jpg",
      alternatives: ["Milk"],
    },
    {
      name: "Jajka",
      image: "eggs.jpg",
      alternatives: ["Eggs"],
    },
    {
      name: "Ser cheddar",
      image: "cheddar-cheese.jpg",
      alternatives: ["Cheddar Cheese"],
    },
    {
      name: "Mozzarella",
      image: "mozzarella.jpg",
      alternatives: [],
    },
    {
      name: "Serek śmietankowy",
      image: "cream-cheese.jpg",
      alternatives: ["Cream Cheese"],
    },
    {
      name: "Kostka masła",
      image: "stick-of-butter.jpg",
      alternatives: ["Stick Of Butter"],
    },
    {
      name: "Jogurt",
      image: "yogurt.jpg",
      alternatives: ["Yogurt"],
    },
    {
      name: "Sok pomarańczowy",
      image: "orange-juice.jpg",
      alternatives: ["Orange Juice"],
    },
    {
      name: "Sok jabłkowy",
      image: "apple-juice.jpg",
      alternatives: ["Apple Juice"],
    },
    {
      name: "Napój gazowany",
      image: "soda.jpg",
      alternatives: ["Soda"],
    },
    {
      name: "Piwo",
      image: "beer.jpg",
      alternatives: ["Beer"],
    },
    {
      name: "Białe wino",
      image: "white-wine.jpg",
      alternatives: ["White Wine"],
    },
    {
      name: "Woda butelkowana",
      image: "bottled-water.jpg",
      alternatives: ["Bottled Water"],
    },
    {
      name: "Keczup",
      image: "ketchup.jpg",
      alternatives: ["Ketchup"],
    },
    {
      name: "Musztarda",
      image: "mustard.jpg",
      alternatives: ["Mustard"],
    },
    {
      name: "Majonez",
      image: "bottle-of-mayonnaise.jpg",
      alternatives: ["Bottle Of Mayonnaise"],
    },
    {
      name: "Ostry sos",
      image: "hot-sauce.jpg",
      alternatives: ["Hot Sauce"],
    },
    {
      name: "Salsa",
      image: "salsa.jpg",
      alternatives: [],
    },
    {
      name: "Guacamole",
      image: "guacamole.jpg",
      alternatives: [],
    },
    {
      name: "Hummus",
      image: "hummus.jpg",
      alternatives: [],
    },
    {
      name: "Sos sałatkowy",
      image: "salad-dressing.jpg",
      alternatives: ["Salad Dressing"],
    },
    {
      name: "Kwaśna śmietana",
      image: "sour-cream.jpg",
      alternatives: ["Sour Cream"],
    },
    {
      name: "Ogórki kiszone",
      image: "pickles.jpg",
      alternatives: ["Pickles"],
    },
    {
      name: "Boczek",
      image: "bacon.jpg",
      alternatives: ["Bacon"],
    },
    {
      name: "Szynka",
      image: "ham.jpg",
      alternatives: ["Ham"],
    },
    {
      name: "Plastry indyka",
      image: "turkey-slices.jpg",
      alternatives: ["Turkey Slices"],
    },
    {
      name: "Sałata",
      image: "lettuce.jpg",
      alternatives: ["Lettuce"],
    },
    {
      name: "Szpinak",
      image: "spinach.jpg",
      alternatives: ["Spinach"],
    },
    {
      name: "Marchewki",
      image: "carrots.jpg",
      alternatives: ["Carrots"],
    },
    {
      name: "Seler naciowy",
      image: "celery.jpg",
      alternatives: ["Celery"],
    },
    {
      name: "Brokuł",
      image: "broccoli.jpg",
      alternatives: ["Broccoli"],
    },
    {
      name: "Winogrona",
      image: "grapes.jpg",
      alternatives: ["Grapes"],
    },
    {
      name: "Truskawki",
      image: "strawberries.jpg",
      alternatives: ["Strawberries"],
    },
    {
      name: "Borówki",
      image: "blueberries.jpg",
      alternatives: ["Blueberries"],
    },
    {
      name: "Mus jabłkowy",
      image: "applesauce-cup.jpg",
      alternatives: ["Applesauce Cup"],
    },
    {
      name: "Owoce w kubeczku",
      image: "fruit-cup.jpg",
      alternatives: ["Fruit Cup"],
    },
    {
      name: "Tortille",
      image: "tortillas.jpg",
      alternatives: ["Tortillas"],
    },
    {
      name: "Gofry",
      image: "waffles.jpg",
      alternatives: ["Waffles"],
    },
    {
      name: "Placki ziemniaczane",
      image: "hash-browns.jpg",
      alternatives: ["Hash Browns"],
    },
    {
      name: "Sos marinara",
      image: "marinara-sauce.jpg",
      alternatives: ["Marinara Sauce"],
    },
    {
      name: "Pesto",
      image: "pesto.jpg",
      alternatives: [],
    },
    {
      name: "Mrożona herbata",
      image: "iced-tea.jpg",
      alternatives: ["Iced Tea"],
    },
    {
      name: "Kawa cold brew",
      image: "cold-brew-coffee.jpg",
      alternatives: ["Cold Brew Coffee"],
    },
    {
      name: "Szejk proteinowy",
      image: "protein-shake.jpg",
      alternatives: ["Protein Shake"],
    },
    {
      name: "Dzbanek filtrujący Brita",
      image: "brita.jpg",
      alternatives: ["Brita"],
    },
    {
      name: "Świeże zioła",
      image: "fresh-herbs.jpg",
      alternatives: ["Fresh Herbs"],
    },
    {
      name: "Pasta miso",
      image: "miso-paste.jpg",
      alternatives: ["Miso Paste"],
    },
    {
      name: "Tofu",
      image: "tofu.jpg",
      alternatives: [],
    },
    {
      name: "Sos butter chicken",
      image: "butter-chicken-sauce.jpg",
      alternatives: ["Butter Chicken Sauce"],
    },
  ],
};

const GarageCategory: CategoryMetadata = {
  name: "Garaż",
  folder: "garage",
  examples: [
    {
      name: "Młotek",
      image: "hammer.jpg",
      alternatives: ["Hammer"],
    },
    {
      name: "Śrubokręt",
      image: "screwdriver.jpg",
      alternatives: ["Screwdriver"],
    },
    {
      name: "Wiertarka",
      image: "power-drill.jpg",
      alternatives: ["Power Drill"],
    },
    {
      name: "Wkrętarka akumulatorowa",
      image: "cordless-drill.jpg",
      alternatives: ["Cordless Drill"],
    },
    {
      name: "Klucz",
      image: "wrench.jpg",
      alternatives: ["Wrench"],
    },
    {
      name: "Piła",
      image: "saw.jpg",
      alternatives: ["Saw"],
    },
    {
      name: "Gwóźdź",
      image: "nail.jpg",
      alternatives: ["Nail"],
    },
    {
      name: "Śruby",
      image: "screws.jpg",
      alternatives: ["Screws"],
    },
    {
      name: "Skrzynka na narzędzia",
      image: "toolbox.jpg",
      alternatives: ["Toolbox"],
    },
    {
      name: "Przedłużacz",
      image: "extension-cord.jpg",
      alternatives: ["Extension Cord"],
    },
    {
      name: "Rękawice robocze",
      image: "work-gloves.jpg",
      alternatives: ["Work Gloves"],
    },
    {
      name: "Stół warsztatowy",
      image: "workbench.jpg",
      alternatives: ["Workbench"],
    },
    {
      name: "Zestaw kluczy nasadowych",
      image: "socket-set.jpg",
      alternatives: ["Socket Set"],
    },
    {
      name: "Wiertła",
      image: "drill-bits.jpg",
      alternatives: ["Drill Bits"],
    },
    {
      name: "Pędzel",
      image: "paintbrush.jpg",
      alternatives: ["Paintbrush"],
    },
    {
      name: "Wałek malarski",
      image: "paint-roller.jpg",
      alternatives: ["Paint Roller"],
    },
    {
      name: "Puszka farby",
      image: "paint-can.jpg",
      alternatives: ["Paint Can"],
    },
    {
      name: "Łopata",
      image: "shovel.jpg",
      alternatives: ["Shovel"],
    },
    {
      name: "Grabie",
      image: "rake.jpg",
      alternatives: ["Rake"],
    },
    {
      name: "Kosiarka",
      image: "lawn-mower.jpg",
      alternatives: ["Lawn Mower"],
    },
    {
      name: "Wąż ogrodowy",
      image: "garden-hose.jpg",
      alternatives: ["Garden Hose"],
    },
    {
      name: "Rower",
      image: "bicycle.jpg",
      alternatives: ["Bicycle"],
    },
    {
      name: "Kask rowerowy",
      image: "bike-helmet.jpg",
      alternatives: ["Bike Helmet"],
    },
    {
      name: "Lodówka turystyczna",
      image: "cooler.jpg",
      alternatives: ["Cooler"],
    },
    {
      name: "Krzesło składane",
      image: "folding-chair.jpg",
      alternatives: ["Folding Chair"],
    },
    {
      name: "Walizki",
      image: "luggage.jpg",
      alternatives: ["Luggage"],
    },
    {
      name: "Wrotki",
      image: "roller-skates.jpg",
      alternatives: ["Roller Skates"],
    },
    {
      name: "Sprzęt sportowy",
      image: "sports-equipment.jpg",
      alternatives: ["Sports Equipment"],
    },
    {
      name: "Drabina",
      image: "step-ladder.jpg",
      alternatives: ["Step Ladder"],
    },
    {
      name: "Plandeka",
      image: "tarp.jpg",
      alternatives: ["Tarp"],
    },
    {
      name: "Pompka",
      image: "air-pump.jpg",
      alternatives: ["Air Pump"],
    },
    {
      name: "Kable rozruchowe",
      image: "jumper-cables.jpg",
      alternatives: ["Jumper Cables"],
    },
    {
      name: "Olej silnikowy",
      image: "motor-oil.jpg",
      alternatives: ["Motor Oil"],
    },
    {
      name: "Płyn do chłodnic",
      image: "antifreeze.jpg",
      alternatives: ["Antifreeze"],
    },
    {
      name: "Podnośnik samochodowy",
      image: "car-jack.jpg",
      alternatives: ["Car Jack"],
    },
    {
      name: "Koło zapasowe",
      image: "spare-tire.jpg",
      alternatives: ["Spare Tire"],
    },
    {
      name: "WD-40",
      image: "wd-40.jpg",
      alternatives: ["Wd 40"],
    },
    {
      name: "Wiadro z marketu budowlanego",
      image: "home-depot-bucket.jpg",
      alternatives: ["Home Depot Bucket"],
    },
    {
      name: "Pasy transportowe",
      image: "ratchet-straps.jpg",
      alternatives: ["Ratchet Straps"],
    },
    {
      name: "Dmuchawa do liści",
      image: "leaf-blower.jpg",
      alternatives: ["Leaf Blower"],
    },
    {
      name: "Podkaszarka",
      image: "weed-whacker.jpg",
      alternatives: ["Weed Whacker"],
    },
    {
      name: "Łopata do śniegu",
      image: "snow-shovel.jpg",
      alternatives: ["Snow Shovel"],
    },
    {
      name: "Kuchenka turystyczna",
      image: "camp-stove.jpg",
      alternatives: ["Camp Stove"],
    },
    {
      name: "Piła łańcuchowa",
      image: "chainsaw.jpg",
      alternatives: ["Chainsaw"],
    },
    {
      name: "Nożyce do żywopłotu",
      image: "hedge-trimmer.jpg",
      alternatives: ["Hedge Trimmer"],
    },
    {
      name: "Odkurzacz warsztatowy",
      image: "shop-vac.jpg",
      alternatives: ["Shop Vac"],
    },
  ],
};

const HolidaysCategory: CategoryMetadata = {
  name: "Święta",
  folder: "holidays",
  examples: [
    {
      name: "Boże Narodzenie",
      image: "christmas.jpg",
      alternatives: ["Christmas"],
    },
    {
      name: "Święto Dziękczynienia",
      image: "thanksgiving.jpg",
      alternatives: ["Thanksgiving"],
    },
    {
      name: "Halloween",
      image: "halloween.jpg",
      alternatives: [],
    },
    {
      name: "Sylwester",
      image: "new-years-eve.jpg",
      alternatives: ["New Years Eve"],
    },
    {
      name: "Dzień Niepodległości USA",
      image: "independence-day.jpg",
      alternatives: ["Independence Day"],
    },
    {
      name: "Wielkanoc",
      image: "easter.jpg",
      alternatives: ["Easter"],
    },
    {
      name: "Walentynki",
      image: "valentines-day.jpg",
      alternatives: ["Valentines Day"],
    },
    {
      name: "Dzień Świętego Patryka",
      image: "st-patricks-day.jpg",
      alternatives: ["St Patricks Day"],
    },
    {
      name: "Dzień Matki",
      image: "mothers-day.jpg",
      alternatives: ["Mothers Day"],
    },
    {
      name: "Dzień Ojca",
      image: "fathers-day.jpg",
      alternatives: ["Fathers Day"],
    },
    {
      name: "Dzień Pamięci",
      image: "memorial-day.jpg",
      alternatives: ["Memorial Day"],
    },
    {
      name: "Święto Pracy",
      image: "labor-day.jpg",
      alternatives: ["Labor Day"],
    },
    {
      name: "Dzień Weterana",
      image: "veterans-day.jpg",
      alternatives: ["Veterans Day"],
    },
    {
      name: "Dzień Martina Luthera Kinga",
      image: "martin-luther-king-jr-day.jpg",
      alternatives: ["Martin Luther King Jr Day"],
    },
    {
      name: "Chanuka",
      image: "hanukkah.jpg",
      alternatives: ["Hanukkah"],
    },
    {
      name: "Ramadan",
      image: "ramadan.jpg",
      alternatives: [],
    },
    {
      name: "Diwali",
      image: "diwali.jpg",
      alternatives: [],
    },
    {
      name: "Chiński Nowy Rok",
      image: "lunar-new-year.jpg",
      alternatives: ["Lunar New Year"],
    },
    {
      name: "Cinco De Mayo",
      image: "cinco-de-mayo.jpg",
      alternatives: [],
    },
    {
      name: "Mardi Gras",
      image: "mardi-gras.jpg",
      alternatives: [],
    },
    {
      name: "Dzień Dumy",
      image: "pride-day.jpg",
      alternatives: ["Pride Day"],
    },
    {
      name: "Dzień Świstaka",
      image: "groundhog-day.jpg",
      alternatives: ["Groundhog Day"],
    },
    {
      name: "Dzień Ziemi",
      image: "earth-day.jpg",
      alternatives: ["Earth Day"],
    },
    {
      name: "Dzień Zmarłych",
      image: "day-of-the-dead.jpg",
      alternatives: ["Day Of The Dead"],
    },
    {
      name: "Kwanzaa",
      image: "kwanzaa.jpg",
      alternatives: [],
    },
    {
      name: "Pascha",
      image: "passover.jpg",
      alternatives: ["Passover"],
    },
    {
      name: "Rosh Hashanah",
      image: "rosh-hashanah.jpg",
      alternatives: [],
    },
    {
      name: "Yom Kippur",
      image: "yom-kippur.jpg",
      alternatives: [],
    },
    {
      name: "Id al-Fitr",
      image: "eid-al-fitr.jpg",
      alternatives: ["Eid Al Fitr"],
    },
    {
      name: "Wielki Piątek",
      image: "good-friday.jpg",
      alternatives: ["Good Friday"],
    },
    {
      name: "Dzień Kolumba",
      image: "columbus-day-indigenous-peoples-day.jpg",
      alternatives: ["Columbus Day Indigenous Peoples Day"],
    },
    {
      name: "Dzień Kanady",
      image: "canada-day.jpg",
      alternatives: ["Canada Day"],
    },
    {
      name: "Dzień Bastylii",
      image: "bastille-day.jpg",
      alternatives: ["Bastille Day"],
    },
    {
      name: "Oktoberfest",
      image: "oktoberfest.jpg",
      alternatives: [],
    },
    {
      name: "Święto Środka Jesieni",
      image: "mid-autumn-festival.jpg",
      alternatives: ["Mid Autumn Festival"],
    },
    {
      name: "Dzień Liczby Pi",
      image: "pi-day.jpg",
      alternatives: ["Pi Day"],
    },
    {
      name: "Dzień Drzewa",
      image: "arbor-day.jpg",
      alternatives: ["Arbor Day"],
    },
  ],
};

const SportsCategory: CategoryMetadata = {
  name: "Sporty",
  folder: "sports",
  examples: [
    {
      name: "Futbol amerykański",
      image: "football.jpg",
      alternatives: ["Football"],
    },
    {
      name: "Koszykówka",
      image: "basketball.jpg",
      alternatives: ["Basketball"],
    },
    {
      name: "Baseball",
      image: "baseball.jpg",
      alternatives: [],
    },
    {
      name: "Piłka nożna",
      image: "soccer.jpg",
      alternatives: ["Soccer"],
    },
    {
      name: "Tenis",
      image: "tennis.jpg",
      alternatives: ["Tennis"],
    },
    {
      name: "Golf",
      image: "golf.jpg",
      alternatives: [],
    },
    {
      name: "Hokej",
      image: "hockey.jpg",
      alternatives: ["Hockey"],
    },
    {
      name: "Pływanie",
      image: "swimming.jpg",
      alternatives: ["Swimming"],
    },
    {
      name: "Siatkówka",
      image: "volleyball.jpg",
      alternatives: ["Volleyball"],
    },
    {
      name: "Boks",
      image: "boxing.jpg",
      alternatives: ["Boxing"],
    },
    {
      name: "Wyścigi samochodowe",
      image: "auto-racing.jpg",
      alternatives: ["Auto Racing"],
    },
    {
      name: "Kolarstwo",
      image: "cycling.jpg",
      alternatives: ["Cycling"],
    },
    {
      name: "Maraton",
      image: "marathon.jpg",
      alternatives: ["Marathon"],
    },
    {
      name: "Narciarstwo",
      image: "skiing.jpg",
      alternatives: ["Skiing"],
    },
    {
      name: "Snowboard",
      image: "snowboarding.jpg",
      alternatives: ["Snowboarding"],
    },
    {
      name: "Surfing",
      image: "surfing.jpg",
      alternatives: [],
    },
    {
      name: "Skateboarding",
      image: "skateboarding.jpg",
      alternatives: [],
    },
    {
      name: "Gimnastyka",
      image: "gymnastics.jpg",
      alternatives: ["Gymnastics"],
    },
    {
      name: "Lekkoatletyka",
      image: "track-and-field.jpg",
      alternatives: ["Track And Field"],
    },
    {
      name: "Softball",
      image: "softball.jpg",
      alternatives: [],
    },
    {
      name: "Kręgle",
      image: "bowling.jpeg",
      alternatives: ["Bowling"],
    },
    {
      name: "Tenis stołowy",
      image: "table-tennis.jpg",
      alternatives: ["Table Tennis"],
    },
    {
      name: "Badminton",
      image: "badminton.jpg",
      alternatives: [],
    },
    {
      name: "Krykiet",
      image: "cricket.jpg",
      alternatives: ["Cricket"],
    },
    {
      name: "Rugby",
      image: "rugby.jpg",
      alternatives: [],
    },
    {
      name: "Lacrosse",
      image: "lacrosse.jpg",
      alternatives: [],
    },
    {
      name: "Hokej na trawie",
      image: "field-hockey.jpg",
      alternatives: ["Field Hockey"],
    },
    {
      name: "Cheerleading",
      image: "cheerleading.jpg",
      alternatives: [],
    },
    {
      name: "Wspinaczka",
      image: "climbing.jpg",
      alternatives: ["Climbing"],
    },
    {
      name: "Wioślarstwo",
      image: "rowing.jpg",
      alternatives: ["Rowing"],
    },
    {
      name: "Triathlon",
      image: "triathlon.jpg",
      alternatives: [],
    },
    {
      name: "Ultimate frisbee",
      image: "ultimate-frisbee.jpg",
      alternatives: ["Ultimate Frisbee"],
    },
    {
      name: "Pickleball",
      image: "pickleball.jpg",
      alternatives: [],
    },
    {
      name: "Piłka wodna",
      image: "water-polo.jpg",
      alternatives: ["Water Polo"],
    },
    {
      name: "Wyścigi konne",
      image: "horse-racing.jpg",
      alternatives: ["Horse Racing"],
    },
    {
      name: "MMA",
      image: "mma.jpg",
      alternatives: ["Mma"],
    },
    {
      name: "Zapasy",
      image: "wrestling.jpg",
      alternatives: ["Wrestling"],
    },
    {
      name: "Trójbój siłowy",
      image: "powerlifting.jpg",
      alternatives: ["Powerlifting"],
    },
    {
      name: "Kulturystyka",
      image: "bodybuilding.jpg",
      alternatives: ["Bodybuilding"],
    },
    {
      name: "Rzutki",
      image: "darts.jpg",
      alternatives: ["Darts"],
    },
    {
      name: "Bilard",
      image: "billiards.jpg",
      alternatives: ["Billiards"],
    },
    {
      name: "Disc golf",
      image: "disc-golf.jpg",
      alternatives: ["Disc Golf"],
    },
    {
      name: "Zbijak",
      image: "dodgeball.jpg",
      alternatives: ["Dodgeball"],
    },
    {
      name: "Kickball",
      image: "kickball.jpg",
      alternatives: [],
    },
    {
      name: "Piłka ręczna",
      image: "handball.jpg",
      alternatives: ["Handball"],
    },
    {
      name: "Łucznictwo",
      image: "archery.jpg",
      alternatives: ["Archery"],
    },
    {
      name: "Broomball",
      image: "broomball.jpg",
      alternatives: [],
    },
    {
      name: "Curling",
      image: "curling.jpg",
      alternatives: [],
    },
    {
      name: "Szermierka",
      image: "fencing.jpg",
      alternatives: ["Fencing"],
    },
    {
      name: "Polo",
      image: "polo.jpg",
      alternatives: [],
    },
  ],
};

const PoolEquipmentCategory: CategoryMetadata = {
  name: "Wyposażenie basenu",
  folder: "pool-equipment",
  examples: [
    {
      name: "Zakaz skakania do wody",
      image: "no-diving-sign.jpg",
      alternatives: ["No Diving Sign", "No Diving"],
    },
    {
      name: "Podnośnik basenowy",
      image: "pool-lift.jpg",
      alternatives: ["Pool Lift", "ADA Pool Lift", "Pool Chair Lift"],
    },
    {
      name: "Lampa basenowa",
      image: "pool-light.jpg",
      alternatives: ["Pool Light"],
    },
    {
      name: "Oznaczenie głębokości",
      image: "depth-marker.webp",
      alternatives: ["Depth Marker", "Depth Marking"],
    },
    {
      name: "Zatrzask furtki",
      image: "gate-latch.jpg",
      alternatives: ["Gate Latch"],
    },
    {
      name: "Samozamykający zawias",
      image: "self-closing-hinge.jpg",
      alternatives: ["Self-Closing Hinge", "Self Closing Hinge"],
    },
    {
      name: "Furtka basenowa",
      image: "pool-gate.jpg",
      alternatives: ["Pool Gate", "Safety Gate"],
    },
    {
      name: "Defibrylator AED",
      image: "AED.jpg",
      alternatives: ["AED", "Defibrillator", "Automated External Defibrillator"],
    },
    {
      name: "Apteczka",
      image: "first-aid-kit.jpg",
      alternatives: ["First Aid Kit", "First-Aid Kit"],
    },
    {
      name: "Ratownik",
      image: "lifeguard.jpg",
      alternatives: ["Lifeguard"],
    },
    {
      name: "Hak ratowniczy",
      image: "shepherds-crook.jpg",
      alternatives: ["Shepherd's Crook", "Rescue Hook", "Pool Hook", "Shepherds Crook"],
    },
    {
      name: "Koło ratunkowe",
      image: "ring-buoy.jpg",
      alternatives: ["Ring Buoy", "Life Ring", "Lifebuoy", "Life Preserver"],
    },
    {
      name: "Stanowisko ratownika",
      image: "lifeguard-chair.jpg",
      alternatives: ["Lifeguard Chair", "Lifeguard Stand"],
    },
    {
      name: "Poręcz basenowa",
      image: "pool-handrail.png",
      alternatives: ["Pool Handrail", "Handrail"],
    },
    {
      name: "Drabinka basenowa",
      image: "pool-ladder.jpg",
      alternatives: ["Pool Ladder", "Ladder"],
    },
    {
      name: "Drążek teleskopowy",
      image: "telescopic-pool.webp",
      alternatives: ["Telescopic Pole", "Telescoping Pole", "Pool Pole"],
    },
    {
      name: "Siatka do basenu",
      image: "pool-net.jpg",
      alternatives: ["Pool Net", "Skimmer Net", "Leaf Net", "Hand Skimmer"],
    },
    {
      name: "Szczotka basenowa",
      image: "pool-brush.webp",
      alternatives: ["Pool Brush"],
    },
    {
      name: "Odkurzacz basenowy",
      image: "pool-vacuum.jpg",
      alternatives: ["Pool Vacuum", "Vacuum"],
    },
    {
      name: "Króciec odkurzacza",
      image: "vacuum-port.jpg",
      alternatives: ["Vacuum Port"],
    },
    {
      name: "Dysza powrotna",
      image: "return-jet.webp",
      alternatives: ["Return Jet", "Return", "Jet", "Inlet"],
    },
    {
      name: "Odpływ denny",
      image: "main-drain.jpg",
      alternatives: ["Main Drain"],
    },
    {
      name: "Kratka odpływu dennego",
      image: "main-drain-cover.webp",
      alternatives: ["Main Drain Cover", "Drain Cover"],
    },
    {
      name: "Przepływomierz",
      image: "flow-meter.jpg",
      alternatives: ["Flow Meter"],
    },
    {
      name: "Termometr basenowy",
      image: "pool-thermometer.webp",
      alternatives: ["Pool Thermometer", "Thermometer"],
    },
    {
      name: "Miernik pH",
      image: "ph-meter.jpg",
      alternatives: ["PH Meter"],
    },
    {
      name: "Paski testowe",
      image: "pool-test-strips.webp",
      alternatives: ["Pool Test Strips", "Test Strips"],
    },
    {
      name: "Tester wody",
      image: "pool-test-kit.jpg",
      alternatives: ["Pool Test Kit", "Test Kit", "Water Test Kit"],
    },
    {
      name: "Tabletki chlorowe",
      image: "chlorine-tablets.jpg",
      alternatives: ["Chlorine Tablets", "Chlorine Tabs", "Chlorine Pucks"],
    },
    {
      name: "Chlorownik",
      image: "chlorinator.jpg",
      alternatives: ["Chlorinator", "Chlorine Feeder"],
    },
    {
      name: "Podgrzewacz basenowy",
      image: "pool-heater.jpg",
      alternatives: ["Pool Heater", "Heater"],
    },
    {
      name: "Płukanie wsteczne",
      image: "backwash.jpg",
      alternatives: ["Backwash", "Backwash Valve"],
    },
    {
      name: "Manometr",
      image: "pressure-gauge.jpg",
      alternatives: ["Pressure Gauge"],
    },
    {
      name: "Wkład filtracyjny",
      image: "filter-cartridge.jpg",
      alternatives: ["Filter Cartridge", "Cartridge"],
    },
    {
      name: "Filtr basenowy",
      image: "pool-filter.jpg",
      alternatives: ["Pool Filter", "Filter"],
    },
    {
      name: "Kosz wstępny pompy",
      image: "pump-strainer-basket.jpg",
      alternatives: ["Pump Strainer Basket", "Strainer Basket", "Pump Basket"],
    },
    {
      name: "Pompa basenowa",
      image: "pool-pump.jpg",
      alternatives: ["Pool Pump", "Pump"],
    },
    {
      name: "Skimmer",
      image: "pool-skimmer.jpg",
      alternatives: ["Pool Skimmer", "Skimmer"],
    },
    {
      name: "Koszyk skimmera",
      image: "skimmer-basket.jpg",
      alternatives: ["Skimmer Basket"],
    },
  ],
};

/**
 * Photos from Wikimedia Commons, scaled to 1600px. Most are CC BY / CC BY-SA,
 * which require crediting the author -- see public/credits/polish-dishes.txt
 * (served at /credits/polish-dishes.txt) and scripts/polish-dishes-sources.json.
 */
const PolishDishesCategory: CategoryMetadata = {
  name: "Polskie potrawy",
  folder: "polish-dishes",
  examples: [
    { name: "Babka", image: "babka.jpg", alternatives: ["Babka piaskowa", "Babka marmurkowa"] },
    { name: "Barszcz z uszkami", image: "barszcz-z-uszkami.jpg", alternatives: ["Barszcz czerwony", "Barszcz", "Uszka"] },
    { name: "Biała kiełbasa", image: "biala-kielbasa.jpg", alternatives: ["Kiełbasa biała"] },
    { name: "Bigos", image: "bigos.jpg", alternatives: ["Kapusta myśliwska"] },
    { name: "Chłodnik", image: "chlodnik.jpg", alternatives: ["Chłodnik litewski", "Zimna zupa"] },
    { name: "Czernina", image: "czernina.jpg", alternatives: ["Czarnina", "Czarna polewka"] },
    { name: "Fasolka po bretońsku", image: "fasolka-po-bretonsku.jpg", alternatives: ["Fasolka"] },
    { name: "Faworki", image: "faworki.jpg", alternatives: ["Chruściki", "Chrust"] },
    { name: "Golonka", image: "golonka.jpg", alternatives: ["Golonka pieczona", "Golonka z kapustą"] },
    { name: "Gołąbki", image: "golabki.jpg", alternatives: [] },
    { name: "Groch z kapustą", image: "groch-z-kapusta.jpg", alternatives: ["Kapusta z grochem"] },
    { name: "Grochówka", image: "grochowka.jpg", alternatives: ["Zupa grochowa"] },
    { name: "Kapuśniak", image: "kapusniak.jpg", alternatives: ["Zupa z kapusty"] },
    { name: "Karpatka", image: "karpatka.jpg", alternatives: [] },
    { name: "Kartacze", image: "kartacze.jpg", alternatives: ["Cepeliny"] },
    { name: "Kaszanka", image: "kaszanka.jpg", alternatives: ["Krupniok", "Kiszka"] },
    { name: "Kiełbasa krakowska", image: "kielbasa-krakowska.jpg", alternatives: ["Krakowska"] },
    { name: "Kluski leniwe", image: "kluski-leniwe.jpg", alternatives: ["Leniwe", "Pierogi leniwe"] },
    { name: "Kluski śląskie", image: "kluski-slaskie.jpg", alternatives: ["Kluski z dziurką", "Gumiklyjzy"] },
    { name: "Knedle ze śliwkami", image: "knedle-ze-sliwkami.jpg", alternatives: ["Knedle"] },
    { name: "Kogel-mogel", image: "kogel-mogel.jpg", alternatives: ["Kogiel-mogiel"] },
    { name: "Kopytka", image: "kopytka.jpg", alternatives: [] },
    { name: "Kotlet schabowy", image: "kotlet-schabowy.jpg", alternatives: ["Schabowy", "Schabowe"] },
    { name: "Kremówka", image: "kremowka.jpg", alternatives: ["Kremówka papieska", "Napoleonka"] },
    { name: "Kutia", image: "kutia.jpg", alternatives: ["Kucja"] },
    { name: "Kwaśnica", image: "kwasnica.jpg", alternatives: ["Kwaśnica góralska"] },
    { name: "Makowiec", image: "makowiec.jpg", alternatives: ["Strucla makowa"] },
    { name: "Mazurek", image: "mazurek.jpg", alternatives: ["Mazurek wielkanocny"] },
    { name: "Mizeria", image: "mizeria.jpg", alternatives: ["Sałatka z ogórków"] },
    { name: "Naleśniki", image: "nalesniki.jpg", alternatives: ["Naleśniki z serem"] },
    { name: "Obwarzanek krakowski", image: "obwarzanek-krakowski.jpg", alternatives: ["Obwarzanek", "Precel"] },
    { name: "Ogórki kiszone", image: "ogorki-kiszone.jpg", alternatives: ["Kiszone ogórki", "Ogórki kwaszone"] },
    { name: "Oscypek", image: "oscypek.jpg", alternatives: ["Oscypki", "Ser góralski"] },
    { name: "Pasztet", image: "pasztet.jpg", alternatives: [] },
    { name: "Pańska skórka", image: "panska-skorka.jpg", alternatives: [] },
    { name: "Pierniki toruńskie", image: "pierniki-torunskie.jpg", alternatives: ["Pierniki", "Piernik"] },
    { name: "Pierogi", image: "pierogi.jpg", alternatives: ["Pierogi ruskie"] },
    { name: "Placki ziemniaczane", image: "placki-ziemniaczane.jpg", alternatives: ["Placki", "Placki kartoflane"] },
    { name: "Pyry z gzikiem", image: "pyry-z-gzikiem.jpg", alternatives: ["Gzik", "Ziemniaki z gzikiem"] },
    { name: "Pyzy", image: "pyzy.jpg", alternatives: ["Pyzy z mięsem"] },
    { name: "Pączki", image: "paczki.jpg", alternatives: ["Pączek"] },
    { name: "Racuchy", image: "racuchy.jpg", alternatives: ["Racuszki", "Placuszki"] },
    { name: "Rogal świętomarciński", image: "rogal-swietomarcinski.jpg", alternatives: ["Rogal marciński", "Rogal"] },
    { name: "Rosół", image: "rosol.jpg", alternatives: ["Rosół z makaronem"] },
    { name: "Ryba po grecku", image: "ryba-po-grecku.jpg", alternatives: [] },
    { name: "Sałatka jarzynowa", image: "salatka-jarzynowa.jpg", alternatives: ["Sałatka warzywna", "Sałatka ziemniaczana"] },
    { name: "Sernik", image: "sernik.jpg", alternatives: ["Sernik krakowski"] },
    { name: "Szarlotka", image: "szarlotka.jpg", alternatives: ["Jabłecznik", "Ciasto z jabłkami"] },
    { name: "Tatar", image: "tatar.jpg", alternatives: ["Befsztyk tatarski", "Tatar wołowy"] },
    { name: "Zapiekanka", image: "zapiekanka.jpg", alternatives: [] },
    { name: "Zupa ogórkowa", image: "zupa-ogorkowa.jpg", alternatives: ["Ogórkowa"] },
    { name: "Zupa pomidorowa", image: "zupa-pomidorowa.jpg", alternatives: ["Pomidorowa"] },
    { name: "Żurek", image: "zurek.jpg", alternatives: ["Żur", "Żurek w chlebie"] },
  ],
};

/**
 * Portraits from Wikimedia Commons, scaled to 1600px. Credits in
 * public/credits/polish-athletes.txt (served at /credits/polish-athletes.txt).
 */
const PolishAthletesCategory: CategoryMetadata = {
  name: "Polscy sportowcy",
  folder: "polish-athletes",
  examples: [
    { name: "Maria Andrejczyk", image: "maria-andrejczyk.jpg", alternatives: ["Andrejczyk"] },
    { name: "Andrzej Bargiel", image: "andrzej-bargiel.jpg", alternatives: ["Bargiel"] },
    { name: "Leszek Blanik", image: "leszek-blanik.jpg", alternatives: ["Blanik"] },
    { name: "Zbigniew Boniek", image: "zbigniew-boniek.jpg", alternatives: ["Boniek"] },
    { name: "Artur Boruc", image: "artur-boruc.jpg", alternatives: ["Boruc"] },
    { name: "Jan Błachowicz", image: "jan-blachowicz.jpg", alternatives: ["Błachowicz"] },
    { name: "Jakub Błaszczykowski", image: "jakub-blaszczykowski.jpg", alternatives: ["Błaszczykowski", "Kuba"] },
    { name: "Matty Cash", image: "matty-cash.jpg", alternatives: ["Cash"] },
    { name: "Kazimierz Deyna", image: "kazimierz-deyna.jpg", alternatives: ["Deyna"] },
    { name: "Jerzy Dudek", image: "jerzy-dudek.jpg", alternatives: ["Dudek"] },
    { name: "Sofia Ennaoui", image: "sofia-ennaoui.jpg", alternatives: ["Ennaoui"] },
    { name: "Paweł Fajdek", image: "pawel-fajdek.jpg", alternatives: ["Fajdek"] },
    { name: "Mateusz Gamrot", image: "mateusz-gamrot.jpg", alternatives: ["Gamrot"] },
    { name: "Kamil Glik", image: "kamil-glik.jpg", alternatives: ["Glik"] },
    { name: "Tomasz Gollob", image: "tomasz-gollob.jpg", alternatives: ["Gollob"] },
    { name: "Marcin Gortat", image: "marcin-gortat.jpg", alternatives: ["Gortat"] },
    { name: "Andrzej Gołota", image: "andrzej-golota.jpg", alternatives: ["Gołota"] },
    { name: "Hubert Hurkacz", image: "hubert-hurkacz.jpg", alternatives: ["Hurkacz", "Hubi"] },
    { name: "Otylia Jędrzejczak", image: "otylia-jedrzejczak.jpg", alternatives: ["Jędrzejczak"] },
    { name: "Joanna Jędrzejczyk", image: "joanna-jedrzejczyk.jpg", alternatives: ["Jędrzejczyk"] },
    { name: "Robert Korzeniowski", image: "robert-korzeniowski.jpg", alternatives: ["Korzeniowski"] },
    { name: "Justyna Kowalczyk", image: "justyna-kowalczyk.jpg", alternatives: ["Kowalczyk"] },
    { name: "Władysław Kozakiewicz", image: "wladyslaw-kozakiewicz.jpg", alternatives: ["Kozakiewicz"] },
    { name: "Adam Kszczot", image: "adam-kszczot.jpg", alternatives: ["Kszczot"] },
    { name: "Dawid Kubacki", image: "dawid-kubacki.jpg", alternatives: ["Kubacki"] },
    { name: "Robert Kubica", image: "robert-kubica.jpg", alternatives: ["Kubica"] },
    { name: "Bartosz Kurek", image: "bartosz-kurek.jpg", alternatives: ["Kurek"] },
    { name: "Michał Kwiatkowski", image: "michal-kwiatkowski.jpg", alternatives: ["Kwiatkowski"] },
    { name: "Grzegorz Lato", image: "grzegorz-lato.jpg", alternatives: ["Lato"] },
    { name: "Robert Lewandowski", image: "robert-lewandowski.jpg", alternatives: ["Lewandowski", "Lewy"] },
    { name: "Marcin Lewandowski", image: "marcin-lewandowski.jpg", alternatives: ["Lewandowski"] },
    { name: "Wilfredo León", image: "wilfredo-leon.jpg", alternatives: ["León"] },
    { name: "Magda Linette", image: "magda-linette.jpg", alternatives: ["Linette"] },
    { name: "Włodzimierz Lubański", image: "wlodzimierz-lubanski.jpg", alternatives: ["Lubański"] },
    { name: "Tomasz Majewski", image: "tomasz-majewski.jpg", alternatives: ["Majewski"] },
    { name: "Rafał Majka", image: "rafal-majka.jpg", alternatives: ["Majka"] },
    { name: "Szymon Marciniak", image: "szymon-marciniak.jpg", alternatives: ["Marciniak"] },
    { name: "Adam Małysz", image: "adam-malysz.jpg", alternatives: ["Małysz", "Orzeł z Wisły"] },
    { name: "Dariusz Michalczewski", image: "dariusz-michalczewski.jpg", alternatives: ["Michalczewski", "Tiger"] },
    { name: "Arkadiusz Milik", image: "arkadiusz-milik.jpg", alternatives: ["Milik"] },
    { name: "Aleksandra Mirosław", image: "aleksandra-miroslaw.jpg", alternatives: ["Mirosław"] },
    { name: "Katarzyna Niewiadoma", image: "katarzyna-niewiadoma.jpg", alternatives: ["Niewiadoma"] },
    { name: "Łukasz Piszczek", image: "lukasz-piszczek.jpg", alternatives: ["Piszczek"] },
    { name: "Krzysztof Piątek", image: "krzysztof-piatek.jpg", alternatives: ["Piątek"] },
    { name: "Mariusz Pudzianowski", image: "mariusz-pudzianowski.jpg", alternatives: ["Pudzianowski", "Pudzian"] },
    { name: "Agnieszka Radwańska", image: "agnieszka-radwanska.jpg", alternatives: ["Radwańska"] },
    { name: "Jeremy Sochan", image: "jeremy-sochan.jpg", alternatives: ["Sochan"] },
    { name: "Kamil Stoch", image: "kamil-stoch.jpg", alternatives: ["Stoch"] },
    { name: "Ewa Swoboda", image: "ewa-swoboda.jpg", alternatives: ["Swoboda"] },
    { name: "Wojciech Szczęsny", image: "wojciech-szczesny.jpg", alternatives: ["Szczęsny"] },
    { name: "Irena Szewińska", image: "irena-szewinska.jpg", alternatives: ["Szewińska"] },
    { name: "Jan Tomaszewski", image: "jan-tomaszewski.jpg", alternatives: ["Tomaszewski"] },
    { name: "Krzysztof Wielicki", image: "krzysztof-wielicki.jpg", alternatives: ["Wielicki"] },
    { name: "Mariusz Wlazły", image: "mariusz-wlazly.jpg", alternatives: ["Wlazły"] },
    { name: "Anita Włodarczyk", image: "anita-wlodarczyk.jpg", alternatives: ["Włodarczyk"] },
    { name: "Maja Włoszczowska", image: "maja-wloszczowska.jpg", alternatives: ["Włoszczowska"] },
    { name: "Piotr Zieliński", image: "piotr-zielinski.jpg", alternatives: ["Zieliński"] },
    { name: "Bartosz Zmarzlik", image: "bartosz-zmarzlik.jpg", alternatives: ["Zmarzlik"] },
    { name: "Iga Świątek", image: "iga-swiatek.jpg", alternatives: ["Świątek"] },
    { name: "Piotr Żyła", image: "piotr-zyla.jpg", alternatives: ["Żyła"] },
  ],
};

const VideoGamesCategory: CategoryMetadata = {
  name: "Gry wideo",
  folder: "video-games",
  examples: [
     {
      name: "Guitar Hero",
      image: "guitarhero.jpg",
      alternatives: [],
     },
     {
      name: "Lego Batman",
      image: "legobatman.jpg",
      alternatives: [],
     },
     {
      name: "Fortnite",
      image: "fortnite.jpg",
      alternatives: [],
     },
     {
      name: "Super Smash Bros",
      image: "supersmashbros.jpg",
      alternatives: [],
     },
     {
      name: "Call of Dutye",
      image: "callofduty.jpg",
      alternatives: [],
     },
     {
      name: "God of War",
      image: "GodofWar.png",
      alternatives: [],
     },
     {
      name: "Halo",
      image: "Halo.jpg",
      alternatives: [],
     },
     {
      name: "Mario 64",
      image: "Mario64.jpg",
      alternatives: ["Super Mario 64"],
     },
     {
      name: "Among Us",
      image: "amongus.jpg",
      alternatives: [],
     },
     {
      name: "Angry Birds",
      image: "angrybirds.jpg",
      alternatives: [],
     },
     {
      name: "Madden",
      image: "madden.jpg",
      alternatives: [],
     },
     {
      name: "Overwatch",
      image: "overwatch.jpg",
      alternatives: [],
     },
     {
      name: "Animal Crossing",
      image: "animalcrossing.jpg",
      alternatives: [],
     },
     {
      name: "Wii Sports",
      image: "wiisports.jpg",
      alternatives: [],
     },
     {
      name: "Skylanders",
      image: "skylanders.jpg",
      alternatives: [],
     },
     {
      name: "Lego Star Wars",
      image: "legostarwars.jpg",
      alternatives: [],
     },
     {
      name: "SSX Tricky",
      image: "ssxtricky.png",
      alternatives: [],
     },
     {
      name: "Mario Kart",
      image: "mariokart.jpg",
      alternatives: [],
     },
     {
      name: "Pac Man",
      image: "pacman.jpg",
      alternatives: [],
     },
     {
      name: "The Legend of Zelda",
      image: "legendofzelda.jpg",
      alternatives: ["Breath of the Wild"],
     },
     {
      name: "Tetris",
      image: "tetris.jpg",
      alternatives: [],
     },
     {
      name: "Pokemon Go",
      image: "pokemongo.png",
      alternatives: [],
     },
     {
      name: "Mario and Sonic at the Olympic Games",
      image: "mariosonicolympic.png",
      alternatives: [],
     },
     {
      name: "Star Wars The Force Unleashed",
      image: "starwarsforceunleashed.jpg",
      alternatives: [],
     },
     {
      name: "The Sims",
      image: "thesims.jpg",
      alternatives: [],
     },
     {
      name: "Rachet and Clank",
      image: "rachet&clank.jpg",
      alternatives: [],
     },
     {
      name: "Batman Arkham Asylum",
      image: "batmanarkhamasylum.jpg",
      alternatives: [],
     },
     {
      name: "Fallout",
      image: "fallout.jpg",
      alternatives: [],
     },
     {
      name: "Boomerang Fu",
      image: "boomerangfu.jpg",
      alternatives: [],
     },
     {
      name: "Star Wars Battlefront",
      image: "starwarsbattlefront.jpg",
      alternatives: [],
     },
     {
      name: "Assassin's Creed",
      image: "assassinscreed.jpg",
      alternatives: [],
     },
     {
      name: "Minecraft",
      image: "minecraft.jpg",
      alternatives: [],
     },
     {
      name: "Disney Extreme Skate Adventure",
      image: "disneyextremeskateadventure.png",
      alternatives: [],
     },
     {
      name: "Pong",
      image: "pong.png",
      alternatives: [],
     },
     {
      name: "Tomb Raider",
      image: "tombraider.jpg",
      alternatives: [],
     },
     {
      name: "Uncharted",
      image: "uncharted.jpg",
      alternatives: [],
     },
     {
      name: "Candy Crush",
      image: "candycrush.jpg",
      alternatives: [],
     },
     {
      name: "Kingdom Hearts",
      image: "kingdomhearts.png",
      alternatives: [],
     },
     {
      name: "Gang Beasts",
      image: "gangbeasts.jpg",
      alternatives: [],
     },
     {
      name: "Palworld",
      image: "palworld.jpg",
      alternatives: [],
     },
     {
      name: "Fall Guys",
      image: "fallguys.png",
      alternatives: [],
     },
     {
      name: "Horizon Zero Dawn",
      image: "horizonzerodawn.jpg",
      alternatives: [],
     },
  ],
};

// const ChilisCategory: CategoryMetadata = {
//   name: "Chilis",
//   folder: "chilis",
//   examples: [],
// };

export const CATEGORY_METADATA: Record<Category, CategoryMetadata> = {
  "Wesołe miasteczka": AmusementParksCategory,
  "Owoce": FruitsCategory,
  "Aplikacje": AppsCategory,
  "Gry planszowe": BoardGamesCategory,
  "Książki": BooksCategory,
  "Slogany reklamowe": BrandSlogansCategory,
  "Atrakcje Chicago": ChicagoTouristStuffCategory,
  "Panoramy miast": CitySkylinesCategory,
  "Filmy Disney Channel": DisneyChannelOriginalMoviesCategory,
  "Postacie Disneya": DisneyCharactersCategory,
  "Psy": DogsCategory,
  "Jedzenie z jarmarku": FairFoodsCategory,
  "Sławni, którzy zmarli przed 30":
    FamousPeopleWhoDiedBeforeTurning30Category,
  "Sieci fast food": FastFoodChainsCategory,
  "Lodówka": FridgeCategory,
  "Garaż": GarageCategory,
  "Postacie z Harry'ego Pottera": HarryPotterCharactersCategory,
  "Święta": HolidaysCategory,
  "Konie": HorsesCategory,
  "Szuflada z rupieciami": JunkDrawerCategory,
  "Gadżety kuchenne": KitchenGadgetsCategory,
  "Pranie": LaundryCategory,
  "Matematyka": MathCategory,
  "Filmy": MoviesCategory,
  "Diwy popu": PopDivasCategory,
  "Pokémony": PokemonCategory,
  "Wyposażenie basenu": PoolEquipmentCategory,
  "Komedie romantyczne": RomComsCategory,
  "Kostiumy na Halloween": SpiritHalloweenCatalogueCategory,
  "Sporty": SportsCategory,
  "Superbohaterowie": SuperherosCategory,
  "Teksty Taylor Swift": TaylorSwiftLyricsCategory,
  "The Office": TheOfficeCategory,
  "Święto Dziękczynienia": ThanksgivingCategory,
  "Postacie z gier wideo": VideoGameCharactersCategory,
  "Gry wideo": VideoGamesCategory,
  "Polskie potrawy": PolishDishesCategory,
  "Polscy sportowcy": PolishAthletesCategory,
  "Tabliczka mnożenia": TimesTablesCategory,
  "Anime": AnimeCategory,
  "Minecraft": MinecraftCategory,
  "Flagi Europy": EuropeanFlagsCategory,
};
