const fs = require('fs');
const path = require('path');

// --- 1. Définition des fichiers et du contenu ---

const packageJson = {
  "name": "footlocker-mini-game",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "wouter": "^3.0.0",
    "lucide-react": "^0.344.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
};

const tsConfig = {
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
};

const tsConfigNode = {
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
};

const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;

const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fl-red': '#DC143C',
        'fl-black': '#000000',
      },
      animation: {
        'pop': 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
`;

const postcssConfig = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

const indexHtml = `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Foot Locker - Striper Challenge</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const indexCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #1a1a1a;
    color: white;
  }
}
`;

const mainTsx = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

const appTsx = `
import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Form from "./pages/Form";
import Success from "./pages/Success";

function App() {
  return (
    <div className="min-h-screen bg-neutral-900 font-sans text-white selection:bg-fl-red selection:text-white overflow-x-hidden">
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #333 0%, #000 100%)',
          backgroundSize: "cover"
        }}
      />
      <div className="relative z-10">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/game" component={Game} />
          <Route path="/form" component={Form} />
          <Route path="/success" component={Success} />
        </Switch>
      </div>
    </div>
  );
}
export default App;
`;

// --- PAGES COMPONENT CONTENT ---

const homeTsx = `
import { useLocation } from "wouter";
import { Shirt, ShoppingBag, Gift } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="mb-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase">
          Foot <span className="text-fl-red">Locker</span>
        </h1>
        <div className="h-2 w-full bg-fl-red mt-2 rounded-full shadow-[0_0_20px_#DC143C]" />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold uppercase mb-4 tracking-wide">Habille l'Employé</h2>
      <p className="text-gray-300 text-lg md:text-xl max-w-xl mb-12">Deviens styliste pour un jour et crée la tenue parfaite pour notre équipe !</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl w-full">
        {[
          { icon: Shirt, title: "1. Crée le style", desc: "Choisis les vêtements" },
          { icon: ShoppingBag, title: "2. Valide", desc: "Confirme la tenue" },
          { icon: Gift, title: "3. Gagne", desc: "-10% & Accès FLX" },
        ].map((step, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm hover:border-fl-red/50 transition-colors">
            <step.icon className="w-10 h-10 text-fl-red mx-auto mb-4" />
            <h3 className="font-bold text-xl uppercase mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400">{step.desc}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setLocation("/game")} className="group relative bg-fl-red hover:bg-red-700 text-white text-xl font-bold py-6 px-12 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(220,20,60,0.4)]">
        COMMENCER LE JEU
        <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm font-medium bg-black/80 px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">🏆 JEU 100% GAGNANT</span>
      </button>
    </div>
  );
}
`;

const gameTsx = `
import { useState } from 'react';
import { useLocation } from "wouter";
import { Check, User, Shirt, Footprints } from "lucide-react";

type ItemType = 'shirt' | 'pants' | 'shoes' | 'cap';
interface ClothingItem { id: string; type: ItemType; name: string; color: string; }

const WARDROBE: ClothingItem[] = [
  { id: 'item-cap', type: 'cap', name: 'Casquette FL Official', color: 'bg-black' },
  { id: 'item-shirt', type: 'shirt', name: 'Maillot Referee', color: 'bg-white' },
  { id: 'item-pants', type: 'pants', name: 'Pantalon Jogger', color: 'bg-gray-800' },
  { id: 'item-shoes', type: 'shoes', name: 'Air Jordan Bred', color: 'bg-red-600' },
];

export default function Game() {
  const [, setLocation] = useLocation();
  const [selectedItems, setSelectedItems] = useState<Record<string, ClothingItem>>({});
  const isComplete = Object.keys(selectedItems).length === 4;

  const handleSelect = (item: ClothingItem) => {
    setSelectedItems(prev => ({ ...prev, [item.type]: item }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:hidden bg-black p-4 border-b-4 border-fl-red text-center sticky top-0 z-50">
        <h2 className="text-xl font-black uppercase">Habille l'Employé</h2>
        <div className="flex justify-center gap-2 mt-2">
            {['cap', 'shirt', 'pants', 'shoes'].map(type => (
                <div key={type} className={\`w-3 h-3 rounded-full \${selectedItems[type] ? 'bg-fl-red' : 'bg-gray-600'}\`} />
            ))}
        </div>
      </div>

      <div className="relative flex-1 bg-gradient-to-b from-gray-900 to-black min-h-[50vh] lg:min-h-screen flex items-center justify-center border-b-4 lg:border-b-0 lg:border-r-4 border-fl-red overflow-hidden order-1">
        <div className="relative w-[320px] h-[600px] flex items-center justify-center">
            <div className="absolute w-[140px] h-[380px] bg-gray-400 rounded-2xl top-[60px] z-0 shadow-inner">
                <div className="absolute -top-[50px] left-1/2 -translate-x-1/2 w-[70px] h-[80px] bg-gray-400 rounded-full" />
                <div className="absolute -bottom-[120px] left-2 w-[40px] h-[140px] bg-gray-400 rounded-b-lg" />
                <div className="absolute -bottom-[120px] right-2 w-[40px] h-[140px] bg-gray-400 rounded-b-lg" />
            </div>

            {selectedItems['cap'] && (
                <div className="absolute top-[10px] z-40 animate-pop">
                    <div className="w-[80px] h-[40px] bg-black rounded-t-full border-b-2 border-red-600 relative shadow-xl">
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[90px] h-[10px] bg-black rounded-full opacity-80" />
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] text-fl-red font-bold">FL</div>
                    </div>
                </div>
            )}
            {selectedItems['shirt'] && (
                <div className="absolute top-[70px] z-30 animate-pop">
                    <div className="w-[160px] h-[180px] bg-black rounded-xl shadow-2xl relative overflow-hidden border-2 border-white/20">
                         <div className="absolute inset-0" style={{background: 'repeating-linear-gradient(90deg, #000, #000 10px, #fff 10px, #fff 20px)'}}></div>
                    </div>
                </div>
            )}
            {selectedItems['pants'] && (
                <div className="absolute top-[220px] z-20 animate-pop">
                    <div className="flex gap-2 justify-center">
                         <div className="w-[45px] h-[200px] bg-gray-900 rounded-b-lg border-r-4 border-fl-red shadow-xl"></div>
                         <div className="w-[45px] h-[200px] bg-gray-900 rounded-b-lg border-l-4 border-fl-red shadow-xl"></div>
                    </div>
                </div>
            )}
            {selectedItems['shoes'] && (
                <div className="absolute bottom-[20px] z-50 flex gap-12 animate-pop w-full justify-center">
                    <div className="w-[50px] h-[30px] bg-black border-b-4 border-white rounded-lg rounded-tl-3xl shadow-lg relative"></div>
                    <div className="w-[50px] h-[30px] bg-black border-b-4 border-white rounded-lg rounded-tr-3xl shadow-lg relative"></div>
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 bg-neutral-900 p-6 flex flex-col order-2">
        <div className="hidden lg:block mb-6">
            <h2 className="text-4xl font-black uppercase text-white">Vestiaire</h2>
            <div className="h-1 w-20 bg-fl-red mt-2"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1 content-start">
            {WARDROBE.map((item) => {
                const isSelected = selectedItems[item.type]?.id === item.id;
                return (
                    <button key={item.id} onClick={() => handleSelect(item)} className={\`relative group p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 h-[160px] lg:h-[200px] \${isSelected ? 'bg-white/10 border-fl-red scale-95 ring-2 ring-fl-red/50' : 'bg-gray-800/40 border-white/10 hover:border-white/50 hover:bg-gray-800 hover:scale-105'}\`}>
                        {isSelected && <div className="absolute top-2 right-2 bg-fl-red text-white rounded-full p-1"><Check size={16} strokeWidth={4} /></div>}
                        <div className={\`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-3xl mb-2 \${item.color}\`}>
                            {item.type === 'shirt' && <Shirt className="text-black" />}
                            {item.type === 'pants' && <User className="text-white" />} 
                            {item.type === 'shoes' && <Footprints className="text-white" />}
                            {item.type === 'cap' && <div className="text-white text-xs font-black">CAP</div>}
                        </div>
                        <span className="text-sm font-bold uppercase text-gray-300 group-hover:text-white">{item.name}</span>
                    </button>
                )
            })}
        </div>
        <div className="mt-6">
            <button disabled={!isComplete} onClick={() => isComplete && setLocation("/form")} className={\`w-full py-5 rounded-full text-xl font-black uppercase tracking-widest transition-all \${isComplete ? 'bg-fl-red hover:bg-red-700 text-white animate-pulse shadow-[0_0_30px_#DC143C]' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}\`}>
                {isComplete ? "✨ VALIDER LA TENUE ✨" : \`Sélectionne \${4 - Object.keys(selectedItems).length} article(s)\`}
            </button>
        </div>
      </div>
    </div>
  );
}
`;

const formTsx = `
import { useState } from "react";
import { useLocation } from "wouter";

export default function Form() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ email: "", birthdate: "", gender: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return setError("Email invalide");
    if (!formData.birthdate) return setError("Date de naissance requise");
    if (!formData.gender) return setError("Sélectionne un genre");
    
    localStorage.setItem("flx_user_data", JSON.stringify(formData));
    setLocation("/success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black/80 border border-fl-red p-8 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="text-center mb-8">
            <span className="text-4xl">🎉</span>
            <h2 className="text-3xl font-black uppercase mt-2 text-white">Bravo !</h2>
            <p className="text-gray-400">Ta tenue est parfaite. Rejoins FLX pour ton code.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Email</label>
                <input type="email" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:border-fl-red outline-none" placeholder="ton.email@exemple.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Date de naissance</label>
                <input type="date" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:border-fl-red outline-none" value={formData.birthdate} onChange={(e) => setFormData({...formData, birthdate: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Genre</label>
                <div className="grid grid-cols-3 gap-3">
                    {['Homme', 'Femme', 'Autre'].map((g) => (
                        <button key={g} type="button" onClick={() => setFormData({...formData, gender: g})} className={\`p-3 rounded-lg border font-medium transition-all \${formData.gender === g ? 'bg-fl-red border-fl-red text-white' : 'bg-gray-900 border-gray-700 text-gray-400'}\`}>{g}</button>
                    ))}
                </div>
            </div>
            {error && <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm text-center border border-red-500/50">⚠️ {error}</div>}
            <button type="submit" className="w-full bg-fl-red hover:bg-red-700 text-white font-black py-5 rounded-full uppercase tracking-wider transition-all shadow-lg">Obtenir mon code promo</button>
        </form>
      </div>
    </div>
  );
}
`;

const successTsx = `
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Copy, Check, ExternalLink } from "lucide-react";

export default function Success() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { setCode(\`FL\${Math.random().toString(36).substring(2, 10).toUpperCase()}\`); }, []);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      <div className="max-w-lg w-full">
        <div className="mb-8 animate-bounce text-6xl">🎊</div>
        <h1 className="text-5xl md:text-6xl font-black italic uppercase mb-2">Félicitations !</h1>
        <p className="text-gray-400 text-xl mb-8">Tu as débloqué ton accès VIP</p>
        <div className="bg-white text-black p-8 rounded-xl relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-black via-fl-red to-black"></div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Ton Code Promo Exclusif</p>
            <div className="text-4xl md:text-5xl font-black tracking-wider text-fl-red font-mono my-4">{code || "LOADING..."}</div>
            <button onClick={handleCopy} className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                {copied ? <Check size={20} className="text-green-400"/> : <Copy size={20}/>} {copied ? "COPIÉ !" : "COPIER LE CODE"}
            </button>
        </div>
        <div className="mt-8 flex flex-col gap-4">
            <a href="https://www.footlocker.fr" target="_blank" className="bg-fl-red text-white font-bold py-4 rounded-full uppercase flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">Utiliser sur FootLocker.fr <ExternalLink size={20}/></a>
            <button onClick={() => setLocation("/")} className="text-gray-500 hover:text-white font-bold uppercase text-sm tracking-widest transition-colors">Rejouer</button>
        </div>
      </div>
    </div>
  );
}
`;

// --- 2. FONCTION DE GÉNÉRATION DES FICHIERS ---

const files = [
  { path: 'package.json', content: JSON.stringify(packageJson, null, 2) },
  { path: 'tsconfig.json', content: JSON.stringify(tsConfig, null, 2) },
  { path: 'tsconfig.node.json', content: JSON.stringify(tsConfigNode, null, 2) },
  { path: 'vite.config.ts', content: viteConfig },
  { path: 'tailwind.config.js', content: tailwindConfig },
  { path: 'postcss.config.js', content: postcssConfig },
  { path: 'index.html', content: indexHtml },
  { path: 'src/main.tsx', content: mainTsx },
  { path: 'src/index.css', content: indexCss },
  { path: 'src/App.tsx', content: appTsx },
  { path: 'src/vite-env.d.ts', content: '/// <reference types="vite/client" />' },
  { path: 'src/pages/Home.tsx', content: homeTsx },
  { path: 'src/pages/Game.tsx', content: gameTsx },
  { path: 'src/pages/Form.tsx', content: formTsx },
  { path: 'src/pages/Success.tsx', content: successTsx },
];

function createProject() {
  console.log("🚀 Initialisation du projet Foot Locker Game...");

  if (!fs.existsSync('src')) fs.mkdirSync('src');
  if (!fs.existsSync('src/pages')) fs.mkdirSync('src/pages');

  files.forEach(file => {
    fs.writeFileSync(path.join(__dirname, file.path), file.content.trim());
    console.log(`✅ Créé : ${file.path}`);
  });

  console.log("\n🎉 Projet généré avec succès !");
  console.log("👉 Pour lancer le jeu, exécute les commandes suivantes dans ton terminal :");
  console.log("\n   npm install");
  console.log("   npm run dev\n");
}

createProject();