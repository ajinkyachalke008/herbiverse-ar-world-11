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
  uses: string;
  category: string[];
}

const herbsData: Herb[] = [
  {
    id: "1",
    scientificName: "Abelmoschus moschatus",
    commonName: "Ambrette / Musk mallow",
    uses: "Useful in urinary disorders, eye ailments, aphrodisiac",
    category: ["Urinary", "Eye Care"]
  },
  {
    id: "2",
    scientificName: "Achillea millefolium",
    commonName: "Yarrow",
    uses: "Treats fever, indigestion, wounds (antiseptic, digestive tea)",
    category: ["Digestive", "Wound Care"]
  },
  {
    id: "3",
    scientificName: "Achyranthes aspera",
    commonName: "Prickly chaff flower",
    uses: "Effective in arthritis, fever, urinary problems",
    category: ["Joint Health", "Urinary"]
  },
  {
    id: "4",
    scientificName: "Aconitum napellus",
    commonName: "Monkshood / Aconite",
    uses: "Used in diluted form for neuralgia and pain",
    category: ["Pain Relief"]
  },
  {
    id: "5",
    scientificName: "Adhatoda vasica",
    commonName: "Malabar nut / Vasaka",
    uses: "Heals cough, asthma, bronchitis",
    category: ["Respiratory"]
  },
  {
    id: "6",
    scientificName: "Aegle marmelos",
    commonName: "Bael",
    uses: "Treats diarrhea, dysentery, digestive disorders",
    category: ["Digestive"]
  },
  {
    id: "7",
    scientificName: "Allium sativum",
    commonName: "Garlic / Lahsun",
    uses: "Effective for colds, hypertension, infections",
    category: ["Immunity", "Heart"]
  },
  {
    id: "8",
    scientificName: "Aloe vera",
    commonName: "Ghritkumari",
    uses: "Heals burns, wounds, constipation",
    category: ["Skin", "Digestive"]
  },
  {
    id: "9",
    scientificName: "Alpinia galanga",
    commonName: "Greater galangal",
    uses: "Used for digestion, cold, cough",
    category: ["Digestive", "Respiratory"]
  },
  {
    id: "10",
    scientificName: "Alstonia scholaris",
    commonName: "Devil's tree / Saptaparni",
    uses: "Treats fever, malaria, cough",
    category: ["Respiratory"]
  },
  {
    id: "11",
    scientificName: "Andrographis paniculata",
    commonName: "Kalmegh",
    uses: "Used in fever, cold, liver disorders",
    category: ["Immunity", "Liver"]
  },
  {
    id: "12",
    scientificName: "Anethum graveolens",
    commonName: "Dill / Suwa",
    uses: "Heals indigestion, colic",
    category: ["Digestive"]
  },
  {
    id: "13",
    scientificName: "Anacyclus pyrethrum",
    commonName: "Akkalkara",
    uses: "Relief in toothache, paralysis, rheumatism",
    category: ["Pain Relief", "Joint Health"]
  },
  {
    id: "14",
    scientificName: "Arctium lappa",
    commonName: "Burdock",
    uses: "Purifies blood, heals skin diseases",
    category: ["Skin"]
  },
  {
    id: "15",
    scientificName: "Artemisia absinthium",
    commonName: "Wormwood",
    uses: "Effective in digestion, worms",
    category: ["Digestive"]
  },
  {
    id: "16",
    scientificName: "Asparagus racemosus",
    commonName: "Shatavari",
    uses: "Women's health, lactation, stress relief",
    category: ["Women's Health"]
  },
  {
    id: "17",
    scientificName: "Azadirachta indica",
    commonName: "Neem",
    uses: "Heals skin infections, fever, diabetes",
    category: ["Skin", "Immunity"]
  },
  {
    id: "18",
    scientificName: "Bacopa monnieri",
    commonName: "Brahmi",
    uses: "Brain tonic, improves memory, reduces anxiety",
    category: ["Mental Health"]
  },
  {
    id: "19",
    scientificName: "Bauhinia variegata",
    commonName: "Kanchnaar",
    uses: "Used for thyroid problems, obesity",
    category: ["Thyroid"]
  },
  {
    id: "20",
    scientificName: "Boswellia serrata",
    commonName: "Salai guggul",
    uses: "Relief in arthritis, asthma",
    category: ["Joint Health", "Respiratory"]
  },
  {
    id: "21",
    scientificName: "Calendula officinalis",
    commonName: "Marigold",
    uses: "Heals wounds, skin inflammation",
    category: ["Skin", "Wound Care"]
  },
  {
    id: "22",
    scientificName: "Camellia sinensis",
    commonName: "Tea",
    uses: "Antioxidant, supports heart health",
    category: ["Heart", "Immunity"]
  },
  {
    id: "23",
    scientificName: "Carica papaya",
    commonName: "Papaya",
    uses: "Digestive aid, wound healing, anti-parasitic",
    category: ["Digestive", "Wound Care"]
  },
  {
    id: "24",
    scientificName: "Cinnamomum verum",
    commonName: "Cinnamon / Dalchini",
    uses: "Diabetes, colds, indigestion",
    category: ["Digestive", "Immunity"]
  },
  {
    id: "25",
    scientificName: "Centella asiatica",
    commonName: "Gotu kola",
    uses: "Improves memory, wound healing",
    category: ["Mental Health", "Wound Care"]
  },
  {
    id: "26",
    scientificName: "Commiphora mukul",
    commonName: "Guggul",
    uses: "Reduces cholesterol, arthritis",
    category: ["Heart", "Joint Health"]
  },
  {
    id: "27",
    scientificName: "Convolvulus pluricaulis",
    commonName: "Shankhapushpi",
    uses: "Improves memory, reduces anxiety",
    category: ["Mental Health"]
  },
  {
    id: "28",
    scientificName: "Emblica officinalis",
    commonName: "Amla",
    uses: "Boosts immunity, digestion, anemia",
    category: ["Immunity", "Digestive"]
  },
  {
    id: "29",
    scientificName: "Ficus religiosa",
    commonName: "Peepal",
    uses: "Asthma, diarrhea",
    category: ["Respiratory", "Digestive"]
  },
  {
    id: "30",
    scientificName: "Glycyrrhiza glabra",
    commonName: "Licorice / Mulethi",
    uses: "Cough, ulcers",
    category: ["Respiratory", "Digestive"]
  },
  {
    id: "31",
    scientificName: "Gymnema sylvestre",
    commonName: "Gudmar",
    uses: "Diabetes management",
    category: ["Diabetes"]
  },
  {
    id: "32",
    scientificName: "Tinospora cordifolia",
    commonName: "Giloy",
    uses: "Immunity booster, fever",
    category: ["Immunity"]
  },
  {
    id: "33",
    scientificName: "Moringa oleifera",
    commonName: "Drumstick tree",
    uses: "Malnutrition, inflammation",
    category: ["Immunity"]
  },
  {
    id: "34",
    scientificName: "Ocimum tenuiflorum",
    commonName: "Tulsi / Holy basil",
    uses: "Cold, cough, immunity",
    category: ["Respiratory", "Immunity"]
  },
  {
    id: "35",
    scientificName: "Piper nigrum",
    commonName: "Black pepper",
    uses: "Digestion, cough",
    category: ["Digestive", "Respiratory"]
  },
  {
    id: "36",
    scientificName: "Punica granatum",
    commonName: "Pomegranate",
    uses: "Heart health, dysentery",
    category: ["Heart", "Digestive"]
  },
  {
    id: "37",
    scientificName: "Terminalia arjuna",
    commonName: "Arjuna",
    uses: "Heart tonic",
    category: ["Heart"]
  },
  {
    id: "38",
    scientificName: "Trigonella foenum-graecum",
    commonName: "Fenugreek / Methi",
    uses: "Diabetes, lactation aid",
    category: ["Women's Health", "Diabetes"]
  },
  {
    id: "39",
    scientificName: "Withania somnifera",
    commonName: "Ashwagandha",
    uses: "Stress, arthritis, fatigue",
    category: ["Mental Health", "Joint Health"]
  },
  {
    id: "40",
    scientificName: "Santalum album",
    commonName: "Sandalwood",
    uses: "Skin cooling, fever",
    category: ["Skin"]
  }
];

const categories = [
  "All",
  "Digestive",
  "Respiratory", 
  "Immunity",
  "Women's Health",
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
        herb.uses.toLowerCase().includes(searchTerm.toLowerCase());
      
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
            Explore our comprehensive collection of medicinal herbs and their therapeutic uses
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
              className="group"
            >
              <CardHeader>
                <CardTitle className="text-xl text-accent group-hover:text-accent-glow transition-colors">
                  {herb.commonName}
                </CardTitle>
                <CardDescription className="italic text-sm">
                  {herb.scientificName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
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