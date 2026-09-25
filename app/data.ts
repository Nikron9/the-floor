import { AmusementParksCategory } from "./categories/data/amusement-parks";
import { AnimeCategory } from "./categories/data/anime";
import { AppsCategory } from "./categories/data/apps";
import { BoardGamesCategory } from "./categories/data/board-games";
import { BooksCategory } from "./categories/data/books";
import { BrandSlogansCategory } from "./categories/data/brand-slogans";
import { CitySkylinesCategory } from "./categories/data/city-skylines";
import { Cartoons2000sCategory } from "./categories/data/cartoons-2000s";
import { DisneyCharactersCategory } from "./categories/data/disney-characters";
import { DogsCategory } from "./categories/data/dogs";
import { EuropeanFlagsCategory } from "./categories/data/european-flags";
import { FairFoodsCategory } from "./categories/data/fair-foods";
import { FastFoodChainsCategory } from "./categories/data/fast-food-chains";
import { FridgeCategory } from "./categories/data/fridge";
import { FruitsCategory } from "./categories/data/fruits";
import { GarageCategory } from "./categories/data/garage";
import { GothicCategory } from "./categories/data/gothic";
import { HarryPotterCharactersCategory } from "./categories/data/harry-potter-characters";
import { HolidaysCategory } from "./categories/data/holidays";
import { HorsesCategory } from "./categories/data/horses";
import { JunkDrawerCategory } from "./categories/data/junk-drawer";
import { KitchenGadgetsCategory } from "./categories/data/kitchen-gadgets";
import { LaundryCategory } from "./categories/data/laundry";
import { MathCategory } from "./categories/data/math";
import { MinecraftCategory } from "./categories/data/minecraft";
import { MoviesCategory } from "./categories/data/movies";
import { PokemonCategory } from "./categories/data/pokemon";
import { PolishAthletesCategory } from "./categories/data/polish-athletes";
import { PolishDishesCategory } from "./categories/data/polish-dishes";
import { PolishEntertainmentCategory } from "./categories/data/polish-entertainment";
import { PolishLandmarksCategory } from "./categories/data/polish-landmarks";
import { PolishNatureCategory } from "./categories/data/polish-nature";
import { PolishActressesCategory } from "./categories/data/polish-actresses";
import { PolishActorsCategory } from "./categories/data/polish-actors";
import { CatBreedsCategory } from "./categories/data/cat-breeds";
import { PolishRappersCategory } from "./categories/data/polish-rappers";
import { PolishInfluencersCategory } from "./categories/data/polish-influencers";
import { ScaryAnimalsCategory } from "./categories/data/scary-animals";
import { HalloweenDecorationsCategory } from "./categories/data/halloween-decorations";
import { MonstersCategory } from "./categories/data/monsters";
import { MovieVillainsCategory } from "./categories/data/movie-villains";
import { PopDivasCategory } from "./categories/data/pop-divas";
import { SpiritHalloweenCatalogueCategory } from "./categories/data/spirit-halloween-catalogue";
import { SportsCategory } from "./categories/data/sports";
import { SuperherosCategory } from "./categories/data/superheros";
import { TimesTablesCategory } from "./categories/data/times-tables";
import { VideoGameCharactersCategory } from "./categories/data/video-game-characters";
import { VideoGamesCategory } from "./categories/data/video-games";
import type { CategoryMetadata } from "./categories/data/types";

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
    category: "Polskie aktorki",
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
    category: "Polscy aktorzy",
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
    category: "Czarne charaktery z filmów",
    hasPlayed: false,
    isStillInTheGame: true,
  },
  {
    person: "Pat",
    category: "Halloween",
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
    category: "Znane budynki i pomniki",
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
    category: "Bajki i filmy 2000-2010",
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
  | "Znane budynki i pomniki"
  | "Rozrywka w Polsce"
  | "Przyroda Polski"
  | "Polskie aktorki"
  | "Polscy aktorzy"
  | "Rasy kotów"
  | "Polscy raperzy"
  | "Polscy influencerzy i celebryci"
  | "Straszne zwierzęta"
  | "Halloween"
  | "Potwory i demony"
  | "Czarne charaktery z filmów"
  | "Gry planszowe"
  | "Postacie z Harry'ego Pottera"
  | "Kostiumy na Halloween"
  | "Superbohaterowie"
  | "Postacie z gier wideo"
  | "Panoramy miast"
  | "Filmy"
  | "Książki"
  | "Bajki i filmy 2000-2010"
  | "Slogany reklamowe"
  | "Psy"
  | "Konie"
  | "Wesołe miasteczka"
  | "Jedzenie z jarmarku"
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
  | "Gry wideo"
  | "Polskie potrawy"
  | "Polscy sportowcy"
  | "Gothic"
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

export const FLOOR_DATA: FloorData[] =
  FLOOR_DATA_CONST as unknown as FloorData[];

export type FloorPieces = Record<number, FloorData>;

export type {
  CategoryMetadata,
  ImageExample,
  TextExample,
} from "./categories/data/types";

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
  "Znane budynki i pomniki": PolishLandmarksCategory,
  "Rozrywka w Polsce": PolishEntertainmentCategory,
  "Przyroda Polski": PolishNatureCategory,
  "Polskie aktorki": PolishActressesCategory,
  "Polscy aktorzy": PolishActorsCategory,
  "Rasy kotów": CatBreedsCategory,
  "Polscy raperzy": PolishRappersCategory,
  "Polscy influencerzy i celebryci": PolishInfluencersCategory,
  "Straszne zwierzęta": ScaryAnimalsCategory,
  Halloween: HalloweenDecorationsCategory,
  "Potwory i demony": MonstersCategory,
  "Czarne charaktery z filmów": MovieVillainsCategory,
  "Panoramy miast": CitySkylinesCategory,
  "Bajki i filmy 2000-2010": Cartoons2000sCategory,
  "Postacie Disneya": DisneyCharactersCategory,
  "Psy": DogsCategory,
  "Jedzenie z jarmarku": FairFoodsCategory,
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
  "Kostiumy na Halloween": SpiritHalloweenCatalogueCategory,
  "Sporty": SportsCategory,
  "Superbohaterowie": SuperherosCategory,
  "Postacie z gier wideo": VideoGameCharactersCategory,
  "Gry wideo": VideoGamesCategory,
  "Polskie potrawy": PolishDishesCategory,
  "Polscy sportowcy": PolishAthletesCategory,
  "Gothic": GothicCategory,
  "Tabliczka mnożenia": TimesTablesCategory,
  "Anime": AnimeCategory,
  "Minecraft": MinecraftCategory,
  "Flagi Europy": EuropeanFlagsCategory,
};
