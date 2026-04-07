import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Library, X, Swords, Gem, ArrowDownUp } from 'lucide-react';

// --- DATI DI GIOCO ---
const CHARACTER_POOL = [
  // --- RARITÀ: R (Dal BP minore al maggiore) ---
  { id: 1, name: "Slime", rarity: "R", bp: 500, image: "https://raw.githubusercontent.com/fidosesk/mythicgacha-files/main/Gemini_Generated_Image_z9wlzyz9wlzyz9wl.png" },
  { id: 2, name: "Ratto Gigante", rarity: "R", bp: 600, image: "https://raw.githubusercontent.com/fidosesk/mythicgacha-files/a1a4a00d8fdd42c9603a6e7077cb17f19789ddf7/Gemini_Generated_Image_qjpfmeqjpfmeqjpf.png" },
  { id: 3, name: "Pipistrello", rarity: "R", bp: 800, image: "https://raw.githubusercontent.com/fidosesk/mythicgacha-files/refs/heads/main/Gemini_Generated_Image_qf2p2mqf2p2mqf2p.png" },
  { id: 4, name: "Melma Tossica", rarity: "R", bp: 900, image: "https://raw.githubusercontent.com/fidosesk/mythicgacha-files/refs/heads/main/melma%20tossica.png" },
  { id: 5, name: "Scheletro", rarity: "R", bp: 1000, image: "https://raw.githubusercontent.com/fidosesk/mythicgacha-files/refs/heads/main/scheletro.png" },
  { id: 6, name: "Goblin Furbo", rarity: "R", bp: 1200, image: "https://raw.githubusercontent.com/fidosesk/mythicgacha-files/refs/heads/main/goblin%20furbo.png" },
  { id: 7, name: "Spirito Minore", rarity: "R", bp: 1500 },
  { id: 8, name: "Soldato Reale", rarity: "R", bp: 2500 },
  { id: 9, name: "Lupo Mannaro", rarity: "R", bp: 3000 },

  // --- RARITÀ: SR (Dal BP minore al maggiore) ---
  { id: 15, name: "Chierico", rarity: "SR", bp: 5500 },
  { id: 16, name: "Maga Arcana", rarity: "SR", bp: 6500 },
  { id: 17, name: "Necromante", rarity: "SR", bp: 6600 },
  { id: 18, name: "Paladino", rarity: "SR", bp: 6800 },
  { id: 19, name: "Assassino Ombra", rarity: "SR", bp: 7000 },
  { id: 20, name: "Golem di Ferro", rarity: "SR", bp: 7200 },
  { id: 21, name: "Cavaliere Oscuro", rarity: "SR", bp: 7400 },
  { id: 22, name: "Angelo Caduto", rarity: "SR", bp: 11800, image: "https://raw.githubusercontent.com/fidosesk/mythicgacha-files/refs/heads/main/Angelo%20caduto.png" },
  { id: 23, name: "Re dei Demoni", rarity: "SR", bp: 12000 },
  { id: 24, name: "Titano di Roccia", rarity: "SR", bp: 12200 },
  { id: 25, name: "Fenice Infernale", rarity: "SR", bp: 12500 },
  { id: 26, name: "Drago Antico", rarity: "SR", bp: 13000 },
  { id: 27, name: "Leviatano Abissale", rarity: "SR", bp: 13500 },
  { id: 28, name: "Sovrano del Tempo", rarity: "SR", bp: 15000, image: "https://raw.githubusercontent.com/fidosesk/mythicgacha-files/refs/heads/main/Sovrano%20del%20tempo.png" },

  // --- RARITÀ: SSR (Dal BP minore al maggiore) ---
  { id: 31, name: "Yuki", rarity: "SSR", bp: 20000 },
  { id: 32, name: "Maki", rarity: "SSR", bp: 20000, image: "https://raw.githubusercontent.com/fidosesk/mythicgacha-files/refs/heads/main/Maki.png" }
];

const RARITY_COLORS = {
  SSR: "text-yellow-500 border-yellow-500 bg-yellow-50",
  SR: "text-purple-500 border-purple-500 bg-purple-50",
  R: "text-blue-500 border-blue-500 bg-blue-50"
};

const RARITY_WEIGHT = { SSR: 3, SR: 2, R: 1 };

export default function App() {
  const [currentTab, setCurrentTab] = useState('gacha'); // 'gacha' | 'index' | 'dungeon'
  
  // STATI DEL GIOCATORE
  const [crystals, setCrystals] = useState(3000); // Valuta iniziale
  const [inventory, setInventory] = useState([]); // Array di { ...character, count: X }
  
  // STATI DEL GACHA
  const [lastPulls, setLastPulls] = useState([]);
  const [pullMessage, setPullMessage] = useState("");
  
  // STATI DELL'INDICE
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [sortBy, setSortBy] = useState('rarity'); // 'rarity' | 'bp'
  
  // STATI DEL DUNGEON
  const [dungeonFloor, setDungeonFloor] = useState(1);
  const [battleLog, setBattleLog] = useState({ message: "", type: "" });

  // Generazione automatica di cristalli ogni 5 secondi
  useEffect(() => {
    const timer = setInterval(() => {
      setCrystals(prev => prev + 500);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // --- LOGICA DEL GACHA ---
  const handlePull = (amount) => {
    const cost = amount === 1 ? 200 : 2000;
    
    if (crystals < cost) {
      setPullMessage("Cristalli insufficienti!");
      setTimeout(() => setPullMessage(""), 2000);
      return;
    }

    setCrystals(prev => prev - cost);
    setPullMessage("");

    const newPulls = [];
    const inventoryUpdates = {};

    for (let i = 0; i < amount; i++) {
      const roll = Math.random() * 100;
      let pulledRarity = "R";
      if (roll <= 2) pulledRarity = "SSR";
      else if (roll <= 15) pulledRarity = "SR";

      const availableCharacters = CHARACTER_POOL.filter(c => c.rarity === pulledRarity);
      const pulledChar = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
      
      newPulls.push({ ...pulledChar, instanceId: Math.random().toString(36).substring(7) });
      inventoryUpdates[pulledChar.id] = (inventoryUpdates[pulledChar.id] || 0) + 1;
    }

    setLastPulls(newPulls);

    // Aggiorna inventario gestendo i doppioni
    setInventory(prev => {
      const newInv = [...prev];
      for (const [id, count] of Object.entries(inventoryUpdates)) {
        const existingIndex = newInv.findIndex(c => c.id === parseInt(id));
        if (existingIndex >= 0) {
          newInv[existingIndex].count += count;
          // Calcola il nuovo BP: BP base + 10% per ogni doppione
          const baseBP = CHARACTER_POOL.find(c => c.id === parseInt(id)).bp;
          newInv[existingIndex].bp = Math.floor(baseBP * (1 + 0.1 * (newInv[existingIndex].count - 1)));
        } else {
          const template = CHARACTER_POOL.find(c => c.id === parseInt(id));
          // Applica il bonus se vengono trovati multipli dello stesso nuovo personaggio in una multi-pull
          const initialBP = Math.floor(template.bp * (1 + 0.1 * (count - 1)));
          newInv.push({ ...template, count: count, bp: initialBP });
        }
      }
      return newInv;
    });
  };

  // --- LOGICA DELL'INDICE ---
  const sortedInventory = useMemo(() => {
    return [...inventory].sort((a, b) => {
      if (sortBy === 'bp') return b.bp - a.bp;
      if (sortBy === 'rarity') {
        if (RARITY_WEIGHT[b.rarity] !== RARITY_WEIGHT[a.rarity]) {
          return RARITY_WEIGHT[b.rarity] - RARITY_WEIGHT[a.rarity];
        }
        return b.bp - a.bp; // Spareggio in base al BP
      }
      return 0;
    });
  }, [inventory, sortBy]);

  const lockedCharacters = useMemo(() => {
    const unlockedIds = new Set(inventory.map(c => c.id));
    return CHARACTER_POOL.filter(c => !unlockedIds.has(c.id)).sort((a, b) => {
      if (sortBy === 'bp') return b.bp - a.bp;
      if (sortBy === 'rarity') {
        if (RARITY_WEIGHT[b.rarity] !== RARITY_WEIGHT[a.rarity]) {
          return RARITY_WEIGHT[b.rarity] - RARITY_WEIGHT[a.rarity];
        }
        return b.bp - a.bp;
      }
      return 0;
    });
  }, [inventory, sortBy]);

  // --- LOGICA DEL DUNGEON ---
  const topTeam = useMemo(() => {
    return [...inventory].sort((a, b) => b.bp - a.bp).slice(0, 6);
  }, [inventory]);

  const teamTotalBP = topTeam.reduce((sum, char) => sum + char.bp, 0);
  const monsterBP = dungeonFloor * 4000;
  const floorReward = dungeonFloor * 100;

  const handleBattle = () => {
    if (topTeam.length === 0) {
      setBattleLog({ message: "Non hai nessun personaggio per combattere!", type: "error" });
      return;
    }

    // Aggiunge un pizzico di RNG (Randomness)
    const myPower = teamTotalBP * (0.8 + Math.random() * 0.4);
    const foePower = monsterBP * (0.9 + Math.random() * 0.2);

    if (myPower >= foePower) {
      setCrystals(prev => prev + floorReward);
      setDungeonFloor(prev => prev + 1);
      setBattleLog({ message: `Vittoria! Hai sconfitto i mostri del Piano ${dungeonFloor} e guadagnato +${floorReward} Cristalli.`, type: "success" });
    } else {
      setBattleLog({ message: `Sconfitta al Piano ${dungeonFloor}. Il tuo team non è abbastanza forte, pulla nuovi personaggi!`, type: "error" });
    }
  };

  // --- COMPONENTI UI INTERNI ---
  const CharacterCard = ({ character, onClick, showDuplicates = true, isLocked = false }) => {
    const styleClasses = isLocked 
      ? "text-gray-500 border-gray-300 bg-gray-50 cursor-pointer grayscale opacity-80 hover:shadow-md hover:-translate-y-1" 
      : `${RARITY_COLORS[character.rarity]} cursor-pointer hover:shadow-lg hover:-translate-y-1`;

    return (
      <div 
        onClick={onClick}
        className={`relative bg-white border-2 rounded-2xl w-32 h-52 flex flex-col items-center overflow-hidden transition-all shadow-sm ${styleClasses}`}
      >
        <div className="w-full h-32 bg-slate-100 overflow-hidden relative">
          {character.image ? (
            <img 
              src={character.image} 
              alt={character.name} 
              className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${isLocked ? 'grayscale' : ''}`} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 font-black opacity-20">
              ?
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-1 text-center">
            <span className="text-white text-lg font-black drop-shadow-md">{character.rarity}</span>
          </div>
        </div>

        <div className="p-2 w-full flex-1 flex flex-col justify-center items-center bg-white">
          <span className="text-[11px] text-center leading-tight font-bold text-slate-700 break-words w-full">
            {character.name}
          </span>
          
          <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
            BP: {character.bp.toLocaleString()}
          </span>
        </div>

        {showDuplicates && character.count > 1 && !isLocked && (
          <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white shadow-md z-20">
            +{character.count - 1}
          </div>
        )}
      </div>
    );
  };

  const CharacterModal = () => {
    if (!selectedCharacter) return null;
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCharacter(null)}>
        <div className="bg-white w-full max-w-2xl h-[400px] rounded-2xl flex relative overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
          <button onClick={() => setSelectedCharacter(null)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-700 transition-colors z-10">
            <X size={20} />
          </button>

          <div className={`w-1/2 flex items-center justify-center p-4 border-r ${RARITY_COLORS[selectedCharacter.rarity].split(' ')[2] || 'bg-slate-50'} ${selectedCharacter.isLocked ? 'grayscale opacity-90' : ''}`}>
            {selectedCharacter.image ? (
              <img 
                src={selectedCharacter.image} 
                alt={selectedCharacter.name} 
                className="w-full h-full object-cover rounded-xl shadow-lg" 
              />
            ) : (
              <div className="w-full h-full border-4 border-dashed border-white/50 rounded-xl flex items-center justify-center text-slate-400 text-center bg-white/30 backdrop-blur-sm">
                <span className="font-medium text-slate-500">Immagine<br/>non disponibile</span>
              </div>
            )}
          </div>

          <div className="w-1/2 p-8 flex flex-col justify-center relative">
            {selectedCharacter.isLocked && (
              <div className="absolute top-8 right-8 bg-slate-200 text-slate-500 font-black px-3 py-1 rounded-md text-sm border border-slate-300">
                Da Sbloccare
              </div>
            )}
            <div className="mb-6">
              <h4 className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Nome Personaggio</h4>
              <h2 className="text-3xl font-black text-slate-800 leading-tight">{selectedCharacter.name}</h2>
            </div>
            <div className="mb-6">
              <h4 className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Rarità</h4>
              <span className={`inline-block px-3 py-1 rounded-md text-xl font-bold border bg-white ${RARITY_COLORS[selectedCharacter.rarity].split(' ')[0]} ${RARITY_COLORS[selectedCharacter.rarity].split(' ')[1]}`}>
                {selectedCharacter.rarity}
              </span>
            </div>
            <div>
              <h4 className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Battle Power (BP)</h4>
              <div className="text-4xl font-black text-slate-800 flex items-baseline gap-2">
                {selectedCharacter.bp.toLocaleString()}
                {selectedCharacter.count > 1 && (
                  <span className="text-lg text-green-500 font-bold">
                    (+{(selectedCharacter.count - 1) * 10}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tighter text-indigo-600 flex items-center gap-2">
            <Sparkles className="text-yellow-400" />
            UNTITLED GACHA by Fidosesk
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
              <Gem size={18} className="text-sky-500" />
              <span className="font-bold text-sky-600 text-lg">{crystals.toLocaleString()}</span>
            </div>

            <nav className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button onClick={() => setCurrentTab('gacha')} className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${currentTab === 'gacha' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                <Sparkles size={16} /> Pull
              </button>
              <button onClick={() => setCurrentTab('index')} className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${currentTab === 'index' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                <Library size={16} /> Indice
              </button>
              <button onClick={() => setCurrentTab('dungeon')} className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${currentTab === 'dungeon' ? 'bg-white shadow-sm text-red-500' : 'text-slate-500 hover:text-slate-700'}`}>
                <Swords size={16} /> Dungeon
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {currentTab === 'gacha' && (
          <div className="flex flex-col items-center justify-between min-h-[70vh] bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="text-center">
              <h2 className="text-3xl font-black mb-2 text-slate-800">Evoca nuovi Personaggi</h2>
              <p className="text-slate-500">I doppioni verranno potenziati automaticamente nell'Indice (+1).</p>
            </div>

            <div className="flex-1 w-full flex items-center justify-center py-8">
              {lastPulls.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl animate-bounce-short">
                  {lastPulls.map((char) => (
                    <CharacterCard key={char.instanceId} character={char} showDuplicates={false} />
                  ))}
                </div>
              ) : (
                <div className="w-32 h-48 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50">
                  <span className="text-sm font-medium">Spazio vuoto</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="h-6 flex items-center justify-center">
                {pullMessage && <span className="text-red-500 font-bold animate-pulse">{pullMessage}</span>}
              </div>
              <div className="flex gap-4">
                <button onClick={() => handlePull(1)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-indigo-200 transform transition active:scale-95 flex flex-col items-center min-w-[160px]">
                  <span className="text-xl">PULL 1x</span>
                  <span className="text-indigo-200 text-sm flex items-center gap-1"><Gem size={14}/> 200</span>
                </button>
                <button onClick={() => handlePull(10)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-yellow-200 transform transition active:scale-95 flex flex-col items-center min-w-[160px]">
                  <span className="text-xl text-yellow-50">PULL 10x</span>
                  <span className="text-yellow-100 text-sm flex items-center gap-1"><Gem size={14}/> 2000</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'index' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[70vh]">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">I tuoi Personaggi ({inventory.length})</h2>
                <p className="text-slate-500 text-sm">Clicca per i dettagli. I doppioni si uniscono potenziando la carta.</p>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <ArrowDownUp size={16} className="text-slate-500" />
                <span className="text-sm font-bold text-slate-600 mr-2">Ordina per:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 font-semibold outline-none"
                >
                  <option value="rarity">Rarità (SSR → R)</option>
                  <option value="bp">Battle Power (Max → Min)</option>
                </select>
              </div>
            </div>

            {inventory.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 mb-8">
                <p className="text-slate-500 font-medium mb-4">Non hai ancora nessun personaggio sbloccato.</p>
                <button onClick={() => setCurrentTab('gacha')} className="text-indigo-600 font-bold hover:underline">
                  Vai a fare la tua prima Pull!
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-12">
                {sortedInventory.map((character) => (
                  <CharacterCard 
                    key={character.id} 
                    character={character} 
                    onClick={() => setSelectedCharacter(character)}
                  />
                ))}
              </div>
            )}

            {lockedCharacters.length > 0 && (
              <div>
                <h3 className="text-xl font-black text-slate-400 mb-6 border-t border-slate-200 pt-6">
                  Da Sbloccare ({lockedCharacters.length})
                </h3>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {lockedCharacters.map((character) => (
                    <CharacterCard 
                      key={`locked-${character.id}`} 
                      character={character} 
                      isLocked={true}
                      showDuplicates={false}
                      onClick={() => setSelectedCharacter({ ...character, isLocked: true })}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === 'dungeon' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[70vh]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-800">Dungeon dei Cristalli</h2>
              <p className="text-slate-500">I tuoi 6 personaggi migliori vengono schierati in automatico.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              
              <div className="flex-1 bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-center w-full max-w-sm">
                <h3 className="text-indigo-800 font-black mb-1">LA TUA SQUADRA</h3>
                <div className="text-3xl font-black text-indigo-600 mb-6">{teamTotalBP.toLocaleString()} BP</div>
                
                <div className="flex flex-wrap justify-center gap-2 min-h-[80px]">
                  {topTeam.length > 0 ? topTeam.map(c => (
                    <div key={c.id} className="bg-white px-2 py-1 rounded text-xs font-bold border border-indigo-200 shadow-sm">
                      <span className={`${c.rarity === 'SSR' ? 'text-yellow-500' : c.rarity === 'SR' ? 'text-purple-500' : 'text-blue-500'}`}>{c.rarity}</span> {c.name}
                    </div>
                  )) : (
                    <div className="text-slate-400 text-sm">Nessun personaggio trovato.</div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center px-4">
                <div className="bg-slate-800 text-white font-black text-xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg mb-4">VS</div>
                <button 
                  onClick={handleBattle}
                  className="bg-red-500 hover:bg-red-600 text-white font-black py-3 px-8 rounded-xl shadow-lg shadow-red-200 transform transition active:scale-95 text-lg flex items-center gap-2"
                >
                  <Swords size={20} /> COMBATTI
                </button>
              </div>

              <div className="flex-1 bg-red-50 p-6 rounded-3xl border border-red-100 text-center w-full max-w-sm">
                <h3 className="text-red-800 font-black mb-1">PIANO {dungeonFloor}</h3>
                <div className="text-3xl font-black text-red-600 mb-6">{monsterBP.toLocaleString()} BP</div>
                <div className="flex flex-col items-center justify-center min-h-[80px]">
                  <span className="text-4xl mb-2">👹</span>
                  <div className="text-xs font-bold text-red-400 bg-white px-3 py-1 rounded border border-red-200">
                    Ricompensa: +{floorReward} 💎
                  </div>
                </div>
              </div>
            </div>

            <div className={`text-center p-4 rounded-xl font-bold min-h-[60px] flex items-center justify-center ${battleLog.type === 'success' ? 'bg-green-100 text-green-700' : battleLog.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-slate-50 text-slate-400'}`}>
              {battleLog.message || "Premi Combatti per iniziare l'esplorazione!"}
            </div>

          </div>
        )}

      </main>

      <CharacterModal />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-short {
          0% { transform: scale(0.9); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />
    </div>
  );
}