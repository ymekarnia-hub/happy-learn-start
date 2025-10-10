import { useState } from "react";
import { Search, BookOpen, LayoutDashboard, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const subjects = [
  { name: "Mathématiques", icon: "🧮", color: "bg-green-50 hover:bg-green-100", locked: false },
  { name: "Histoire", icon: "👑", color: "bg-yellow-50 hover:bg-yellow-100", locked: false },
  { name: "Géographie", icon: "🌍", color: "bg-blue-50 hover:bg-blue-100", locked: false },
  { name: "Physique-Chimie", icon: "🧪", color: "bg-teal-50 hover:bg-teal-100", locked: false },
  { name: "Enseignement scientifique", icon: "🧲", color: "bg-red-50 hover:bg-red-100", locked: false },
  { name: "SVT", icon: "🧬", color: "bg-purple-50 hover:bg-purple-100", locked: false },
  { name: "SES", icon: "🪙", color: "bg-amber-50 hover:bg-amber-100", locked: false },
  { name: "Anglais", icon: "🇬🇧", color: "bg-slate-50 hover:bg-slate-100", locked: false },
  { name: "Allemand", icon: "🇩🇪", color: "bg-yellow-50 hover:bg-yellow-100", locked: false },
  { name: "Espagnol", icon: "🇪🇸", color: "bg-red-50 hover:bg-red-100", locked: false },
  { name: "Géopolitique", icon: "♟️", color: "bg-gray-50 hover:bg-gray-100", locked: false },
  { name: "Humanités", icon: "🏺", color: "bg-orange-50 hover:bg-orange-100", locked: false },
  { name: "LLCE Anglais", icon: "💂", color: "bg-pink-50 hover:bg-pink-100", locked: false },
  { name: "Philosophie", icon: "🏛️", color: "bg-blue-50 hover:bg-blue-100", locked: false },
  { name: "Mathématiques complémentaires", icon: "🧮", color: "bg-green-50 hover:bg-green-100", locked: false },
];

const Parcourir = () => {
  const [selectedLevel, setSelectedLevel] = useState("terminale");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("parcourir");

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Mon compte</p>
              <p className="text-xs text-muted-foreground">Gérer mon compte</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab("parcourir")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "parcourir"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Parcourir
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "dashboard"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Tableau de bord
          </button>

          <button
            onClick={() => setActiveTab("recherche")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "recherche"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Search className="w-5 h-5" />
            Recherche
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="bg-primary/5 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Encore 10 contenus offerts</p>
            </div>
          </div>
          <Button className="w-full" variant="default">
            S'abonner
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sixieme">6ème</SelectItem>
                  <SelectItem value="cinquieme">5ème</SelectItem>
                  <SelectItem value="quatrieme">4ème</SelectItem>
                  <SelectItem value="troisieme">3ème</SelectItem>
                  <SelectItem value="seconde">Seconde</SelectItem>
                  <SelectItem value="premiere">Première</SelectItem>
                  <SelectItem value="terminale">Terminale</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredSubjects.map((subject, index) => (
              <Card
                key={index}
                className={`${subject.color} border-none transition-all duration-200 cursor-pointer hover:shadow-md relative overflow-hidden`}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="text-6xl mb-4">{subject.icon}</div>
                  <h3 className="font-semibold text-foreground text-sm leading-tight">
                    {subject.name}
                  </h3>
                  {subject.locked && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="h-1 bg-gradient-to-r from-primary/20 to-accent/20" />
              </Card>
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune matière ne correspond à votre recherche</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Parcourir;
