import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Volume2, ArrowRight, ArrowLeft, Play, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveStats } from "@/lib/live-data";
import { speakText } from "@/lib/voice-engine";
import { useLang } from "@/lib/lang-context";

interface StoryPage {
  text: string;
  illustration: string; // Emoji symbols/visual structure
  characterBg: string;
}

export function StoryCreator() {
  const { stats, addCustomStory, awardXP } = useLiveStats();
  const { lang } = useLang();
  
  // Form states
  const [childName, setChildName] = useState("Aarav");
  const [favAnimal, setFavAnimal] = useState("Monkey");
  const [favColor, setFavColor] = useState("Blue");
  const [favFood, setFavFood] = useState("Mango");
  const [favSuperhero, setFavSuperhero] = useState("Iron Man");
  
  // Interactive reader states
  const [storyTitle, setStoryTitle] = useState("");
  const [storyPages, setStoryPages] = useState<StoryPage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);

  const generateStory = () => {
    const title = `${childName} & the Magic ${favAnimal}`;
    
    // Construct custom slides dynamically
    const p1 = `Once upon a time, in a magical land painted bright ${favColor}, lived a happy child named ${childName}. One sunny morning, ${childName} met a friendly little ${favAnimal} wearing a tiny superhero cape, just like ${favSuperhero}!`;
    const p2 = `The ${favAnimal} looked hungry, so ${childName} shared their absolute favorite food, a delicious sweet ${favFood}! To express thanks, the ${favAnimal} performed a funny superhero dance, making everyone giggle.`;
    const p3 = `With full tummies and happy hearts, ${childName} and their superhero ${favAnimal} friend flew high up into the clouds. From that day on, they explored the magic world together, learning something new every day! The End.`;

    const pages: StoryPage[] = [
      { text: p1, illustration: "👑👦🦁🦸‍♂️", characterBg: "bg-blue-500" },
      { text: p2, illustration: "🐒🥭🍰✨", characterBg: "bg-amber-500" },
      { text: p3, illustration: "☁️🌈🚁🏠", characterBg: "bg-indigo-500" }
    ];

    setStoryTitle(title);
    setStoryPages(pages);
    setCurrentSlide(0);
    setIsGenerated(true);
    awardXP(50, 2);

    // Persist into user stories list in LiveStats
    const fullStoryText = `${p1} ${p2} ${p3}`;
    addCustomStory(title, favAnimal, favColor, favFood, favSuperhero, fullStoryText);

    if (window.triggerMascotCelebrate) {
      window.triggerMascotCelebrate(`Yay, Aarav! We created a new magic storybook! Let's read it! 📖`);
    }
  };

  const handleReadSlide = () => {
    if (storyPages.length === 0) return;
    setIsNarrating(true);
    speakText(storyPages[currentSlide].text, lang, () => {
      setIsNarrating(false);
    });
  };

  const handleNext = () => {
    if (currentSlide < storyPages.length - 1) {
      setCurrentSlide(c => c + 1);
      setIsNarrating(false);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(c => c - 1);
      setIsNarrating(false);
    }
  };

  const resetCreator = () => {
    setIsGenerated(false);
    setStoryPages([]);
    setStoryTitle("");
  };

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-card max-w-2xl mx-auto">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-pink-100 text-pink-600 dark:bg-pink-950">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-base">AI Story Creator</h3>
          <p className="text-xs text-muted-foreground">Co-create bedtime stories starring your child</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isGenerated ? (
          /* Input Form */
          <motion.div
            key="story-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2 space-y-1">
                <label className="font-bold text-xs text-muted-foreground">Child's Name</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full h-10 px-4 rounded-2xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-xs text-muted-foreground">Favourite Animal</label>
                <select
                  value={favAnimal}
                  onChange={(e) => setFavAnimal(e.target.value)}
                  className="w-full h-10 px-3 rounded-2xl border bg-background text-sm outline-none focus:ring-2"
                >
                  <option value="Monkey">Monkey 🐒</option>
                  <option value="Lion">Lion 🦁</option>
                  <option value="Puppy">Puppy 🐶</option>
                  <option value="Rabbit">Rabbit 🐰</option>
                  <option value="Elephant">Elephant 🐘</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-xs text-muted-foreground">Favourite Colour</label>
                <select
                  value={favColor}
                  onChange={(e) => setFavColor(e.target.value)}
                  className="w-full h-10 px-3 rounded-2xl border bg-background text-sm outline-none focus:ring-2"
                >
                  <option value="Blue">Blue 🔵</option>
                  <option value="Red">Red 🔴</option>
                  <option value="Yellow">Yellow 🟡</option>
                  <option value="Green">Green 🟢</option>
                  <option value="Pink">Pink 🌸</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-xs text-muted-foreground">Favourite Food</label>
                <select
                  value={favFood}
                  onChange={(e) => setFavFood(e.target.value)}
                  className="w-full h-10 px-3 rounded-2xl border bg-background text-sm outline-none focus:ring-2"
                >
                  <option value="Mango">Mango 🥭</option>
                  <option value="Apple">Apple 🍎</option>
                  <option value="Cake">Cake 🍰</option>
                  <option value="Banana">Banana 🍌</option>
                  <option value="Ice Cream">Ice Cream 🍦</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-xs text-muted-foreground">Favourite Superhero</label>
                <select
                  value={favSuperhero}
                  onChange={(e) => setFavSuperhero(e.target.value)}
                  className="w-full h-10 px-3 rounded-2xl border bg-background text-sm outline-none focus:ring-2"
                >
                  <option value="Iron Man">Iron Man 🦸‍♂️</option>
                  <option value="Spider-Man">Spider-Man 🕷️</option>
                  <option value="Shaktimaan">Shaktimaan ⚡</option>
                  <option value="Hanuman">Hanuman 🐒</option>
                  <option value="Batman">Batman 🦇</option>
                </select>
              </div>
            </div>

            <Button
              onClick={generateStory}
              className="w-full rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold h-12 shadow-glow flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-5 w-5" /> Co-Create Storybook (+50 XP)
            </Button>
          </motion.div>
        ) : (
          /* Interactive Storybook Slider */
          <motion.div
            key="story-reader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            {/* Story Header */}
            <h4 className="font-display font-extrabold text-xl text-center text-indigo-600 mb-2">
              {storyTitle}
            </h4>

            {/* Pagination / Slide indicator */}
            <span className="text-xs font-bold text-muted-foreground mb-4">
              Page {currentSlide + 1} of {storyPages.length}
            </span>

            {/* Paginated Card Graphics Display */}
            <div className="w-full aspect-[2/1.2] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border flex flex-col items-center justify-center relative p-6 text-center shadow-inner">
              <span className="text-7xl select-none animate-pulse">
                {storyPages[currentSlide].illustration}
              </span>
              
              {/* Dynamic animated graphics background highlights */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-pink-400/10 blur-3xl pointer-events-none" />
            </div>

            {/* Narrated story text content */}
            <p className="mt-6 text-base font-bold text-foreground leading-relaxed text-center px-4 min-h-[72px]">
              {storyPages[currentSlide].text}
            </p>

            {/* Storybook actions & TTS play triggers */}
            <div className="w-full flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={resetCreator}
                  title="Make New Story"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleReadSlide}
                  className={`rounded-full px-5 font-bold shadow-soft flex items-center gap-1.5 ${
                    isNarrating ? "bg-green-600 hover:bg-green-500" : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                >
                  {isNarrating ? <Volume2 className="h-4 w-4 animate-bounce" /> : <Play className="h-4 w-4" />}
                  {isNarrating ? "Reading..." : "Read Aloud"}
                </Button>
              </div>

              {/* Slider Navigation */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  disabled={currentSlide === 0}
                  onClick={handlePrev}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  disabled={currentSlide === storyPages.length - 1}
                  onClick={handleNext}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
