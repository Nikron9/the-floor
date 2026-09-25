import type { CategoryMetadata } from "./types";

// Solid colour squares generated in-house; the hex code is in the comment next to each entry.
export const ColorsCategory: CategoryMetadata = {
  name: "Jaki to kolor?",
  folder: "colors",
  instruction: "Na ekranie pojawi się kolorowy kwadrat. Podaj nazwę koloru.",
  // Basic colours first, then ever finer shades -- never alphabetical.
  examples: [
    { pl: "Czerwony", properEn: "Red", image: "czerwony.png" }, // #E10600
    { pl: "Zielony", properEn: "Green", image: "zielony.png" }, // #12A33B
    { pl: "Niebieski", properEn: "Blue", image: "niebieski.png" }, // #1446E0
    { pl: "Żółty", properEn: "Yellow", image: "zolty.png" }, // #FFE11A
    { pl: "Czarny", properEn: "Black", image: "czarny.png" }, // #000000
    { pl: "Biały", properEn: "White", image: "bialy.png" }, // #FFFFFF
    { pl: "Pomarańczowy", plAlt: ["Oranżowy"], properEn: "Orange", image: "pomaranczowy.png" }, // #FF8A00
    { pl: "Różowy", properEn: "Pink", image: "rozowy.png" }, // #FF6FB5
    { pl: "Fioletowy", plAlt: ["Lila"], properEn: "Purple", image: "fioletowy.png" }, // #7B2FBE
    { pl: "Brązowy", properEn: "Brown", image: "brazowy.png" }, // #7B4A1E
    { pl: "Szary", properEn: "Grey", image: "szary.png" }, // #8A8A8A
    { pl: "Błękitny", plAlt: ["Jasnoniebieski"], properEn: "Light blue", image: "blekitny.png" }, // #8CCFF2
    { pl: "Granatowy", plAlt: ["Ciemnoniebieski"], properEn: "Navy blue", image: "granatowy.png" }, // #14224F
    { pl: "Złoty", properEn: "Gold", image: "zloty.png" }, // #D4AF37
    { pl: "Srebrny", plAlt: ["Jasnoszary"], properEn: "Silver", image: "srebrny.png" }, // #C4C7CC
    { pl: "Beżowy", properEn: "Beige", image: "bezowy.png" }, // #D9C3A0
    { pl: "Bordowy", plAlt: ["Burgund"], properEn: "Burgundy", image: "bordowy.png" }, // #7A0A26
    { pl: "Turkusowy", plAlt: ["Turkus"], properEn: "Turquoise", image: "turkusowy.png" }, // #2FD3C5
    { pl: "Jasnozielony", plAlt: ["Limonkowy"], properEn: "Lime", image: "jasnozielony.png" }, // #9BE31E
    { pl: "Ciemnozielony", plAlt: ["Butelkowa zieleń"], properEn: "Dark green", image: "ciemnozielony.png" }, // #0B4D2C
    { pl: "Miętowy", properEn: "Mint", image: "mietowy.png" }, // #A8F0C6
    { pl: "Kremowy", plAlt: ["Ecru"], properEn: "Cream", image: "kremowy.png" }, // #FFF6D6
    { pl: "Łososiowy", properEn: "Salmon", image: "lososiowy.png" }, // #FA8A74
    { pl: "Oliwkowy", plAlt: ["Khaki"], properEn: "Olive", image: "oliwkowy.png" }, // #7F7F16
    { pl: "Koralowy", properEn: "Coral", image: "koralowy.png" }, // #FF6F4F
    { pl: "Liliowy", plAlt: ["Wrzosowy"], properEn: "Lilac", image: "liliowy.png" }, // #C8A2D8
    { pl: "Fuksja", plAlt: ["Magenta", "Amarantowy"], properEn: "Fuchsia", image: "fuksja.png" }, // #FF14B4
    { pl: "Musztardowy", properEn: "Mustard", image: "musztardowy.png" }, // #D8A800
    { pl: "Grafitowy", plAlt: ["Antracytowy", "Ciemnoszary"], properEn: "Graphite", image: "grafitowy.png" }, // #3A3B3F
    { pl: "Pudrowy róż", plAlt: ["Jasnoróżowy"], properEn: "Powder pink", image: "pudrowy-roz.png" }, // #F2C4C8
    { pl: "Karmazynowy", plAlt: ["Szkarłatny"], properEn: "Crimson", image: "karmazynowy.png" }, // #D2143A
    { pl: "Szmaragdowy", plAlt: ["Szmaragd"], properEn: "Emerald", image: "szmaragdowy.png" }, // #1FA968
    { pl: "Indygo", properEn: "Indigo", image: "indygo.png" }, // #3F0A86
    { pl: "Cyjan", properEn: "Cyan", image: "cyjan.png" }, // #00E5F0
    { pl: "Rdzawy", plAlt: ["Ceglasty"], properEn: "Rust", image: "rdzawy.png" }, // #B24A12
    { pl: "Terakota", plAlt: ["Terakotowy"], properEn: "Terracotta", image: "terakota.png" }, // #D46A4C
    { pl: "Lawendowy", properEn: "Lavender", image: "lawendowy.png" }, // #B7A3E3
    { pl: "Seledynowy", plAlt: ["Seledyn"], properEn: "Celadon", image: "seledynowy.png" }, // #ACE1AF
    { pl: "Malinowy", properEn: "Raspberry", image: "malinowy.png" }, // #D1195C
    { pl: "Wiśniowy", properEn: "Cherry red", image: "wisniowy.png" }, // #8E0E2A
    { pl: "Morski", plAlt: ["Petrol", "Zielononiebieski"], properEn: "Teal", image: "morski.png" }, // #1F7F80
    { pl: "Kobaltowy", plAlt: ["Kobalt"], properEn: "Cobalt blue", image: "kobaltowy.png" }, // #0047AB
    { pl: "Pistacjowy", properEn: "Pistachio", image: "pistacjowy.png" }, // #98C87A
    { pl: "Khaki", plAlt: ["Wojskowy"], image: "khaki.png" }, // #BFA97A
    { pl: "Śliwkowy", properEn: "Plum", image: "sliwkowy.png" }, // #7A2F63
    { pl: "Brzoskwiniowy", properEn: "Peach", image: "brzoskwiniowy.png" }, // #FFC9A3
    { pl: "Szafirowy", plAlt: ["Szafir"], properEn: "Sapphire", image: "szafirowy.png" }, // #0F4DB5
    { pl: "Ochra", plAlt: ["Ochrowy"], properEn: "Ochre", image: "ochra.png" }, // #C9781E
    { pl: "Sepia", image: "sepia.png" }, // #704214
    { pl: "Kość słoniowa", plAlt: ["Écru"], properEn: "Ivory", image: "kosc-sloniowa.png" }, // #FFFDEE
    { pl: "Ultramaryna", plAlt: ["Ultramarynowy"], properEn: "Ultramarine", image: "ultramaryna.png" }, // #3F10F0
    { pl: "Cynober", plAlt: ["Cynobrowy"], properEn: "Vermilion", image: "cynober.png" }, // #E34A27
    { pl: "Pruski błękit", properEn: "Prussian blue", image: "pruski-blekit.png" }, // #0B3552
    { pl: "Umbra", properEn: "Umber", image: "umbra.png" }, // #5F4A3A
    { pl: "Karminowy", plAlt: ["Karmin"], properEn: "Carmine", image: "karminowy.png" }, // #960018
    { pl: "Chartreuse", plAlt: ["Groszkowy"], image: "chartreuse.png" }, // #7FFF00
    { pl: "Heliotropowy", plAlt: ["Heliotrop"], properEn: "Heliotrope", image: "heliotrop.png" }, // #DF73FF
    { pl: "Perłowy", properEn: "Pearl", image: "perlowy.png" }, // #EAE0C8
    { pl: "Akwamaryna", plAlt: ["Akwamarynowy"], properEn: "Aquamarine", image: "akwamaryna.png" }, // #7FFFD4
  ],
};
