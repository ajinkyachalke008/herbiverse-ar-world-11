import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Leaf } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Herb data structure
interface Herb {
  id: string;
  scientificName: string;
  commonName: string;
  sanskritName?: string;
  uses: string;
  category: string[];
  image: string;
  description?: string;
}

const herbsData: Herb[] = [
  {
    id: "1",
    scientificName: "Abelmoschus moschatus",
    commonName: "Ambrette / Musk mallow",
    sanskritName: "Kasturi Bhindi",
    uses: "Useful in urinary disorders, eye ailments, aphrodisiac",
    category: ["Urinary", "Eye Care"],
    image: "https://images.unsplash.com/photo-1628016876037-c5f8827e4224?w=800&q=80"
  },
  {
    id: "2",
    scientificName: "Achillea millefolium",
    commonName: "Yarrow",
    sanskritName: "Gandana",
    uses: "Treats fever, indigestion, wounds (antiseptic, digestive tea)",
    category: ["Digestive", "Wound Care"],
    image: "https://images.unsplash.com/photo-1628016877037-7f55df5e2d3e?w=800&q=80"
  },
  {
    id: "3",
    scientificName: "Achyranthes aspera",
    commonName: "Prickly chaff flower",
    sanskritName: "Apamarga",
    uses: "Effective in arthritis, fever, urinary problems",
    category: ["Joint Health", "Urinary"],
    image: "https://images.unsplash.com/photo-1588241257620-7bbec6b5bb06?w=800&q=80"
  },
  {
    id: "4",
    scientificName: "Aconitum napellus",
    commonName: "Monkshood / Aconite",
    sanskritName: "Vatsanabha",
    uses: "Used in diluted form for neuralgia and pain",
    category: ["Pain Relief"],
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80"
  },
  {
    id: "5",
    scientificName: "Adhatoda vasica",
    commonName: "Malabar nut / Vasaka",
    sanskritName: "Vasaka",
    uses: "Heals cough, asthma, bronchitis",
    category: ["Respiratory"],
    image: "https://images.unsplash.com/photo-1612522098243-f7e7d4cf73e2?w=800&q=80"
  },
  {
    id: "6",
    scientificName: "Aegle marmelos",
    commonName: "Bael",
    sanskritName: "Bilva",
    uses: "Treats diarrhea, dysentery, digestive disorders",
    category: ["Digestive"],
    image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&q=80"
  },
  {
    id: "7",
    scientificName: "Allium sativum",
    commonName: "Garlic / Lahsun",
    sanskritName: "Lasuna",
    uses: "Effective for colds, hypertension, infections",
    category: ["Immunity", "Heart"],
    image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80"
  },
  {
    id: "8",
    scientificName: "Aloe vera",
    commonName: "Ghritkumari",
    sanskritName: "Kumari",
    uses: "Heals burns, wounds, constipation",
    category: ["Skin", "Digestive"],
    image: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=800&q=80"
  },
  {
    id: "9",
    scientificName: "Alpinia galanga",
    commonName: "Greater galangal",
    sanskritName: "Kulanjan",
    uses: "Used for digestion, cold, cough",
    category: ["Digestive", "Respiratory"],
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80"
  },
  {
    id: "10",
    scientificName: "Alstonia scholaris",
    commonName: "Devil's tree / Saptaparni",
    sanskritName: "Saptaparni",
    uses: "Treats fever, malaria, cough",
    category: ["Respiratory"],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
  },
  {
    id: "11",
    scientificName: "Andrographis paniculata",
    commonName: "Kalmegh",
    sanskritName: "Bhunimba",
    uses: "Used in fever, cold, liver disorders",
    category: ["Immunity", "Liver"],
    image: "https://images.unsplash.com/photo-1628016877028-0a35e21e8368?w=800&q=80"
  },
  {
    id: "12",
    scientificName: "Anethum graveolens",
    commonName: "Dill / Suwa",
    sanskritName: "Shatapushpa",
    uses: "Heals indigestion, colic",
    category: ["Digestive"],
    image: "https://images.unsplash.com/photo-1615485925450-e2c5e3c0b9c2?w=800&q=80"
  },
  {
    id: "13",
    scientificName: "Anacyclus pyrethrum",
    commonName: "Akkalkara",
    sanskritName: "Akkarakara",
    uses: "Relief in toothache, paralysis, rheumatism",
    category: ["Pain Relief", "Joint Health"],
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7ca?w=800&q=80"
  },
  {
    id: "14",
    scientificName: "Arctium lappa",
    commonName: "Burdock",
    sanskritName: "Gobo",
    uses: "Purifies blood, heals skin diseases",
    category: ["Skin"],
    image: "https://images.unsplash.com/photo-1574856344991-8f6efc515e4e?w=800&q=80"
  },
  {
    id: "15",
    scientificName: "Artemisia absinthium",
    commonName: "Wormwood",
    sanskritName: "Damanaka",
    uses: "Effective in digestion, worms",
    category: ["Digestive"],
    image: "https://images.unsplash.com/photo-1587154147600-4c5c9a3f50b4?w=800&q=80"
  },
  {
    id: "16",
    scientificName: "Asparagus racemosus",
    commonName: "Shatavari",
    sanskritName: "Shatavari",
    uses: "Women's health, lactation, stress relief",
    category: ["Women's Health"],
    image: "https://images.unsplash.com/photo-1574856344991-8f6efc515e4e?w=800&q=80"
  },
  {
    id: "17",
    scientificName: "Azadirachta indica",
    commonName: "Neem",
    sanskritName: "Nimba",
    uses: "Heals skin infections, fever, diabetes",
    category: ["Skin", "Immunity"],
    image: "https://images.unsplash.com/photo-1594115963828-4a1c48b1d9b4?w=800&q=80"
  },
  {
    id: "18",
    scientificName: "Bacopa monnieri",
    commonName: "Brahmi",
    sanskritName: "Brahmi",
    uses: "Brain tonic, improves memory, reduces anxiety",
    category: ["Mental Health"],
    image: "https://images.unsplash.com/photo-1605437513414-3a0b4ec30f80?w=800&q=80"
  },
  {
    id: "19",
    scientificName: "Bauhinia variegata",
    commonName: "Kanchnaar",
    sanskritName: "Kanchana",
    uses: "Used for thyroid problems, obesity",
    category: ["Thyroid"],
    image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&q=80"
  },
  {
    id: "20",
    scientificName: "Boswellia serrata",
    commonName: "Salai guggul",
    sanskritName: "Shallaki",
    uses: "Relief in arthritis, asthma",
    category: ["Joint Health", "Respiratory"],
    image: "https://images.unsplash.com/photo-1576670159605-ce5c5ae8e3e8?w=800&q=80"
  },
  {
    id: "21",
    scientificName: "Calendula officinalis",
    commonName: "Marigold",
    sanskritName: "Genda",
    uses: "Heals wounds, skin inflammation",
    category: ["Skin", "Wound Care"],
    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800&q=80"
  },
  {
    id: "22",
    scientificName: "Camellia sinensis",
    commonName: "Tea",
    sanskritName: "Chai",
    uses: "Antioxidant, supports heart health",
    category: ["Heart", "Immunity"],
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80"
  },
  {
    id: "23",
    scientificName: "Carica papaya",
    commonName: "Papaya",
    sanskritName: "Papita",
    uses: "Digestive aid, wound healing, anti-parasitic",
    category: ["Digestive", "Wound Care"],
    image: "https://images.unsplash.com/photo-1587241321921-91a834d82fcd?w=800&q=80"
  },
  {
    id: "24",
    scientificName: "Cinnamomum verum",
    commonName: "Cinnamon / Dalchini",
    sanskritName: "Tvak",
    uses: "Diabetes, colds, indigestion",
    category: ["Digestive", "Immunity"],
    image: "https://images.unsplash.com/photo-1604157019338-71a57e9c45c1?w=800&q=80"
  },
  {
    id: "25",
    scientificName: "Centella asiatica",
    commonName: "Gotu kola",
    sanskritName: "Mandukaparni",
    uses: "Improves memory, wound healing",
    category: ["Mental Health", "Wound Care"],
    image: "https://images.unsplash.com/photo-1596548438230-923e2a4f9e6f?w=800&q=80"
  },
  {
    id: "26",
    scientificName: "Commiphora mukul",
    commonName: "Guggul",
    sanskritName: "Guggulu",
    uses: "Reduces cholesterol, arthritis",
    category: ["Heart", "Joint Health"],
    image: "https://images.unsplash.com/photo-1586016212347-05c89a5ac588?w=800&q=80"
  },
  {
    id: "27",
    scientificName: "Convolvulus pluricaulis",
    commonName: "Shankhapushpi",
    sanskritName: "Shankhapushpi",
    uses: "Improves memory, reduces anxiety",
    category: ["Mental Health"],
    image: "https://images.unsplash.com/photo-1572374411316-5a2dac2eacfa?w=800&q=80"
  },
  {
    id: "28",
    scientificName: "Emblica officinalis",
    commonName: "Amla",
    sanskritName: "Amalaki",
    uses: "Boosts immunity, digestion, anemia",
    category: ["Immunity", "Digestive"],
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80"
  },
  {
    id: "29",
    scientificName: "Ficus religiosa",
    commonName: "Peepal",
    sanskritName: "Ashvattha",
    uses: "Asthma, diarrhea",
    category: ["Respiratory", "Digestive"],
    image: "https://images.unsplash.com/photo-1586016212347-05c89a5ac588?w=800&q=80"
  },
  {
    id: "30",
    scientificName: "Glycyrrhiza glabra",
    commonName: "Licorice / Mulethi",
    sanskritName: "Yashtimadhu",
    uses: "Cough, ulcers",
    category: ["Respiratory", "Digestive"],
    image: "https://images.unsplash.com/photo-1628016877021-cdb5e3f6d4b2?w=800&q=80"
  },
  {
    id: "31",
    scientificName: "Gymnema sylvestre",
    commonName: "Gudmar",
    sanskritName: "Meshashringi",
    uses: "Diabetes management",
    category: ["Diabetes"],
    image: "https://images.unsplash.com/photo-1628016876928-cc79e25f4eea?w=800&q=80"
  },
  {
    id: "32",
    scientificName: "Tinospora cordifolia",
    commonName: "Giloy",
    sanskritName: "Guduchi",
    uses: "Immunity booster, fever",
    category: ["Immunity"],
    image: "https://images.unsplash.com/photo-1574856344991-8f6efc515e4e?w=800&q=80"
  },
  {
    id: "33",
    scientificName: "Moringa oleifera",
    commonName: "Drumstick tree",
    sanskritName: "Shigru",
    uses: "Malnutrition, inflammation",
    category: ["Immunity"],
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80"
  },
  {
    id: "34",
    scientificName: "Ocimum tenuiflorum",
    commonName: "Tulsi / Holy basil",
    sanskritName: "Tulasi",
    uses: "Cold, cough, immunity",
    category: ["Respiratory", "Immunity"],
    image: "https://images.unsplash.com/photo-1628016877037-7f55df5e2d3e?w=800&q=80"
  },
  {
    id: "35",
    scientificName: "Piper nigrum",
    commonName: "Black pepper",
    sanskritName: "Maricha",
    uses: "Digestion, cough",
    category: ["Digestive", "Respiratory"],
    image: "https://images.unsplash.com/photo-1593364388838-cd6b41a84edb?w=800&q=80"
  },
  {
    id: "36",
    scientificName: "Punica granatum",
    commonName: "Pomegranate",
    sanskritName: "Dadima",
    uses: "Heart health, dysentery",
    category: ["Heart", "Digestive"],
    image: "https://images.unsplash.com/photo-1589922009771-e91a6e0f0a74?w=800&q=80"
  },
  {
    id: "37",
    scientificName: "Terminalia arjuna",
    commonName: "Arjuna",
    sanskritName: "Arjuna",
    uses: "Heart tonic",
    category: ["Heart"],
    image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=800&q=80"
  },
  {
    id: "38",
    scientificName: "Trigonella foenum-graecum",
    commonName: "Fenugreek / Methi",
    sanskritName: "Methi",
    uses: "Diabetes, lactation aid",
    category: ["Women's Health", "Diabetes"],
    image: "https://images.unsplash.com/photo-1615485925450-e2c5e3c0b9c2?w=800&q=80"
  },
  {
    id: "39",
    scientificName: "Withania somnifera",
    commonName: "Ashwagandha",
    sanskritName: "Ashwagandha",
    uses: "Stress, arthritis, fatigue",
    category: ["Mental Health", "Joint Health"],
    image: "https://images.unsplash.com/photo-1628016876037-c5f8827e4224?w=800&q=80"
  },
  {
    id: "40",
    scientificName: "Santalum album",
    commonName: "Sandalwood",
    sanskritName: "Chandana",
    uses: "Skin cooling, fever",
    category: ["Skin"],
    image: "https://images.unsplash.com/photo-1587241321921-91a834d82fcd?w=800&q=80"
  },
  {
    id: "41",
    scientificName: "Terminalia chebula",
    commonName: "Haritaki",
    sanskritName: "Haritaki",
    uses: "Digestive disorders, anti-aging, rejuvenation",
    category: ["Digestive", "Immunity"],
    image: "https://images.unsplash.com/photo-1589922009771-e91a6e0f0a74?w=800&q=80"
  },
  {
    id: "42",
    scientificName: "Terminalia bellirica",
    commonName: "Bibhitaki",
    sanskritName: "Bibhitaki",
    uses: "Respiratory disorders, digestive tonic, detoxification",
    category: ["Respiratory", "Digestive"],
    image: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=800&q=80"
  },
  {
    id: "43",
    scientificName: "Tribulus terrestris",
    commonName: "Gokshura",
    sanskritName: "Gokshura",
    uses: "Kidney stones, urinary problems, vitality",
    category: ["Urinary", "Men's Health"],
    image: "https://images.unsplash.com/photo-1574856344991-8f6efc515e4e?w=800&q=80"
  },
  {
    id: "44",
    scientificName: "Boerhavia diffusa",
    commonName: "Punarnava",
    sanskritName: "Punarnava",
    uses: "Kidney disorders, edema, rejuvenation",
    category: ["Urinary", "Liver"],
    image: "https://images.unsplash.com/photo-1628016876928-cc79e25f4eea?w=800&q=80"
  },
  {
    id: "45",
    scientificName: "Piper longum",
    commonName: "Long pepper / Pippali",
    sanskritName: "Pippali",
    uses: "Respiratory problems, digestion, immunity",
    category: ["Respiratory", "Digestive", "Immunity"],
    image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80"
  },
  {
    id: "46",
    scientificName: "Phyllanthus niruri",
    commonName: "Bhumyamalaki",
    sanskritName: "Bhumyamalaki",
    uses: "Liver disorders, jaundice, kidney stones",
    category: ["Liver", "Urinary"],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
  },
  {
    id: "47",
    scientificName: "Picrorhiza kurroa",
    commonName: "Kutki",
    sanskritName: "Katuki",
    uses: "Liver protection, fever, asthma",
    category: ["Liver", "Respiratory"],
    image: "https://images.unsplash.com/photo-1574856344991-8f6efc515e4e?w=800&q=80"
  },
  {
    id: "48",
    scientificName: "Rubia cordifolia",
    commonName: "Manjistha",
    sanskritName: "Manjistha",
    uses: "Blood purifier, skin diseases, wound healing",
    category: ["Skin", "Wound Care"],
    image: "https://images.unsplash.com/photo-1604157019338-71a57e9c45c1?w=800&q=80"
  },
  {
    id: "49",
    scientificName: "Nardostachys jatamansi",
    commonName: "Jatamansi",
    sanskritName: "Jatamansi",
    uses: "Mental stress, insomnia, memory enhancement",
    category: ["Mental Health"],
    image: "https://images.unsplash.com/photo-1572374411316-5a2dac2eacfa?w=800&q=80"
  },
  {
    id: "50",
    scientificName: "Acorus calamus",
    commonName: "Sweet flag / Vacha",
    sanskritName: "Vacha",
    uses: "Memory, speech disorders, digestive problems",
    category: ["Mental Health", "Digestive"],
    image: "https://images.unsplash.com/photo-1605437513414-3a0b4ec30f80?w=800&q=80"
  },
  {
    id: "51",
    scientificName: "Embelia ribes",
    commonName: "Vidanga",
    sanskritName: "Vidanga",
    uses: "Intestinal worms, obesity, skin diseases",
    category: ["Digestive", "Skin"],
    image: "https://images.unsplash.com/photo-1587154147600-4c5c9a3f50b4?w=800&q=80"
  },
  {
    id: "52",
    scientificName: "Elettaria cardamomum",
    commonName: "Cardamom / Ela",
    sanskritName: "Ela",
    uses: "Digestion, respiratory issues, oral health",
    category: ["Digestive", "Respiratory"],
    image: "https://images.unsplash.com/photo-1615485925450-e2c5e3c0b9c2?w=800&q=80"
  },
  {
    id: "53",
    scientificName: "Curcuma longa",
    commonName: "Turmeric / Haridra",
    sanskritName: "Haridra",
    uses: "Anti-inflammatory, wound healing, liver protection",
    category: ["Skin", "Liver", "Immunity"],
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80"
  },
  {
    id: "54",
    scientificName: "Panax ginseng",
    commonName: "Asian Ginseng",
    sanskritName: "Ashwagandha-like",
    uses: "Energy booster, immune support, cognitive function",
    category: ["Mental Health", "Immunity"],
    image: "https://images.unsplash.com/photo-1628016877021-cdb5e3f6d4b2?w=800&q=80"
  },
  {
    id: "55",
    scientificName: "Zingiber officinale",
    commonName: "Ginger / Adrak",
    sanskritName: "Shunthi",
    uses: "Nausea, digestion, inflammation, colds",
    category: ["Digestive", "Respiratory", "Immunity"],
    image: "https://images.unsplash.com/photo-1615485925450-e2c5e3c0b9c2?w=800&q=80"
  },
  {
    id: "56",
    scientificName: "Mucuna pruriens",
    commonName: "Kapikacchu",
    sanskritName: "Kapikacchu",
    uses: "Parkinson's disease, fertility, mood enhancement",
    category: ["Mental Health", "Men's Health"],
    image: "https://images.unsplash.com/photo-1574856344991-8f6efc515e4e?w=800&q=80"
  },
  {
    id: "57",
    scientificName: "Coleus forskohlii",
    commonName: "Forskolin",
    sanskritName: "Makandi",
    uses: "Weight loss, heart health, asthma",
    category: ["Heart", "Respiratory"],
    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800&q=80"
  },
  {
    id: "58",
    scientificName: "Lawsonia inermis",
    commonName: "Henna / Mehndi",
    sanskritName: "Madayantika",
    uses: "Skin cooling, hair care, wound healing",
    category: ["Skin", "Wound Care"],
    image: "https://images.unsplash.com/photo-1587241321921-91a834d82fcd?w=800&q=80"
  },
  {
    id: "59",
    scientificName: "Syzygium aromaticum",
    commonName: "Clove / Lavang",
    sanskritName: "Lavanga",
    uses: "Toothache, digestion, antiseptic",
    category: ["Pain Relief", "Digestive"],
    image: "https://images.unsplash.com/photo-1604157019338-71a57e9c45c1?w=800&q=80"
  },
  {
    id: "60",
    scientificName: "Myristica fragrans",
    commonName: "Nutmeg / Jaiphal",
    sanskritName: "Jatiphala",
    uses: "Insomnia, digestion, pain relief",
    category: ["Mental Health", "Digestive", "Pain Relief"],
    image: "https://images.unsplash.com/photo-1593364388838-cd6b41a84edb?w=800&q=80"
  }
];

const categories = [
  "All",
  "Digestive",
  "Respiratory", 
  "Immunity",
  "Women's Health",
  "Men's Health",
  "Skin",
  "Heart",
  "Mental Health",
  "Joint Health",
  "Urinary",
  "Wound Care",
  "Pain Relief",
  "Eye Care",
  "Liver",
  "Thyroid",
  "Diabetes"
];

const HerbalDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredHerbs = useMemo(() => {
    return herbsData.filter(herb => {
      const matchesSearch = 
        herb.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        herb.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        herb.uses.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (herb.sanskritName && herb.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === "All" || 
        herb.category.includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="h-8 w-8 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
              Herbal Database
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our comprehensive collection of {herbsData.length}+ medicinal herbs and their therapeutic uses
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search herbs, diseases, or ailments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-accent/30 focus:border-accent-glow"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground shadow-glow"
                    : "border-accent/30 hover:border-accent-glow hover:shadow-glow"
                }`}
              >
                <Filter className="h-3 w-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredHerbs.length} of {herbsData.length} herbs
          </p>
        </div>

        {/* Herbs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHerbs.map((herb) => (
            <Card
              key={herb.id}
              variant="plant"
              className="group overflow-hidden"
            >
              {/* Herb Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={herb.image}
                  alt={herb.commonName}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1628016876037-c5f8827e4224?w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-accent group-hover:text-accent-glow transition-colors">
                  {herb.commonName}
                </CardTitle>
                <CardDescription className="space-y-1">
                  <p className="italic text-sm">{herb.scientificName}</p>
                  {herb.sanskritName && (
                    <p className="text-xs text-muted-foreground">Sanskrit: {herb.sanskritName}</p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                  {herb.uses}
                </p>
                <div className="flex flex-wrap gap-1">
                  {herb.category.map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="text-xs bg-accent/20 text-accent border-accent/30"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredHerbs.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No herbs found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HerbalDatabase;