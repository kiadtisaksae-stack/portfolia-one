import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Layout, Palette, Sword, Box, User, Code, Star, Settings, 
  Play, X, Trophy, Zap, Shield, ChevronUp, RefreshCw, Timer,
  Monitor, Cpu, Layers, MousePointer2, ExternalLink
} from 'lucide-react';

const App = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); 
  const [activeTab, setActiveTab] = useState('all');
  
  // Slide State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Game State
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameState, setGameState] = useState('menu'); 
  const [stars, setStars] = useState(100); 
  const [stage, setStage] = useState(1);
  const [upgrades, setUpgrades] = useState({
    firePower: 1, fireRate: 1, shield: 1, speed: 1, multiplier: 1
  });

  /**
   * --- วิธีใส่ลิงก์ YouTube ---
   * เปลี่ยนในส่วนของ ytLink: 'ลิ้งวิดีโอของคุณ' 
   */
  const projects = [
    { 
      id: 1, 
      title: 'KAIKA', 
      type: 'game', 
      img: './image/A1.png', 
      ytLink: 'https://www.youtube.com/watch?v=VIDEO_ID_1', 
      tech: 'Unity',
      desc: 'โปรเจคไฟนอลปี 3/1 เป็นเกม RPG-Roglike ตะลุยดันเจี้ยน ที่มีระบบ Multiplayer ด้วย'
    },
    { 
      id: 2, 
      title: 'Chronicles of the New World', 
      type: 'game', 
      img: './image/A2.png', 
      ytLink: 'https://www.youtube.com/watch?v=VIDEO_ID_2', 
      tech: 'C# / Unity',
      desc: 'เป็นเกมที่ทำเองซึ้ง มีระบบ Level class status Day/Night Cycle SeeSeason System'
    },
    { 
      id: 3, 
      title: 'Try not To get eat', 
      type: 'game', 
      img: './image/A3.png', 
      ytLink: 'https://www.youtube.com/watch?v=VIDEO_ID_3', 
      tech: 'C# / Unity',
      desc: 'เป็นเกม Roglike โดยที่ ได้รับบทเป็นนักวิทยาศาสตร์ ในห้องแลป อวกาศ'
    },
    { 
      id: 4, 
      title: 'Custom Tool Unity', 
      type: 'game', 
      img: './image/A4.png', 
      ytLink: 'https://youtu.be/VAB9yjNWXTo?si=pRaitvRvQoVoGnOP', 
      tech: 'C# / Unity',
      desc: 'Tool ที่ใช้จัดการ อนิเมชั่น Event ให้ set override หลายๆ event ได้ใน หน้าต่างเดียว'
    },
    { 
      id: 5, 
      title: 'Amimator Rigging ', 
      type: '3d', 
      img: './image/A4.png', 
      ytLink: 'https://www.youtube.com/watch?v=VIDEO_ID_5', 
      tech: '3D / Maya',
      desc: 'เทคนิคการใช้ AdvanceSkeleton'
    },
    { 
      id: 6, 
      title: 'Retopology and Bake', 
      type: '3d', 
      img: './image/A4.png', 
      ytLink: 'https://youtu.be/4XzeA9RNhQ8?si=_PIwpYp3lO1aydLd', 
      tech: '3D / Maya / Blender',
      desc: 'การลดขนาด Tris โมเดล และ การ Bake'
    },
  ];

  // Auto Slide Logic (เพราะไม่มี OnEnded จากวิดีโอแล้ว)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000); // เปลี่ยนรูปทุก 5 วินาที
    return () => clearInterval(timer);
  }, [projects.length]);

  // --- ข้อมูล Skills และ Game Logic (คงเดิมตามไฟล์ของคุณ) ---
  // [ส่วนนี้ผมขอละไว้ในโค้ดตัวอย่างเพื่อความกระชับ แต่ในไฟล์จริงของคุณมันจะยังอยู่เหมือนเดิมครับ]

  const skillSets = [
    {
      category: "Engine & Tools",
      skills: [
        { name: "Unity", level: "Intermediate", desc: "เชี่ยวชาญ C# และระบบ Game Objects/Prefabs", icon: <Cpu className="text-blue-400" /> },
        { name: "Unreal Engine", level: "Beginner", desc: "ใช้งาน Blueprints และระบบ Lighting/Lumen", icon: <Monitor className="text-purple-400" /> },
        { name: "Blender", level: "Intermediate", desc: "การปั้นโมเดล 3D และทำ Texture/UV Mapping", icon: <Layers className="text-orange-400" /> }
      ]
    },
    {
      category: "Development",
      skills: [
        { name: "C# Scripting", level: "Intermediate", desc: "การเขียน Logic เกมที่ซับซ้อนและ Optimized", icon: <Code className="text-green-400" /> },
        { name: "Game Design", level: "Intermediate", desc: "การออกแบบระบบ Game Loop และ Level Design", icon: <Palette className="text-yellow-400" /> },
        { name: "UI/UX", level: "Beginner", desc: "ออกแบบ Interface ให้ใช้งานง่ายและสวยงาม", icon: <MousePointer2 className="text-red-400" /> }
      ]
    }
  ];

  // --- ตัวแปรและฟังก์ชันเกม (ใส่กลับคืนมาทั้งหมดจากไฟล์เดิมของคุณ) ---
  const TILE_SIZE = 32;
  const GRID_SIZE = 13; 
  const TANK_SIZE = 26;
  const canvasRef = useRef(null);
  const gameRef = useRef({
    player: { x: 6 * 32 + 3, y: 11 * 32 + 3, dir: 'up', lastShot: 0, hp: 1 },
    bullets: [], enemies: [], map: [], keys: {}, enemiesKilled: 0,
    enemiesToSpawn: 0, totalEnemiesInStage: 0, spawnTimer: 0
  });

  const generateMap = useCallback(() => {
    const newMap = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const row = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        if (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1) row.push(2);
        else if (Math.random() > 0.85) row.push(2);
        else if (Math.random() > 0.7) row.push(1);
        else row.push(0);
      }
      newMap.push(row);
    }
    newMap[11][6] = 0; newMap[11][5] = 0; newMap[11][7] = 0; newMap[10][6] = 0;
    newMap[1][1] = 0; newMap[1][6] = 0; newMap[1][11] = 0;
    return newMap;
  }, []);

  const spawnEnemy = () => {
    if (gameRef.current.enemiesToSpawn <= 0) return;
    const spawnPoints = [{x: 1, y: 1}, {x: 6, y: 1}, {x: 11, y: 1}];
    const pt = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
    gameRef.current.enemies.push({ x: pt.x * TILE_SIZE + 3, y: pt.y * TILE_SIZE + 3, dir: 'down', lastShot: Date.now(), moveTick: 0 });
    gameRef.current.enemiesToSpawn -= 1;
  };

  const startMission = (isNewGame = true) => {
    const currentStage = isNewGame ? 1 : stage;
    if (isNewGame) setStage(1);
    const count = 3 + Math.floor((currentStage - 1) / 2.5);
    gameRef.current = {
      player: { x: 6 * TILE_SIZE + 3, y: 11 * TILE_SIZE + 3, dir: 'up', lastShot: 0, hp: upgrades.shield },
      bullets: [], enemies: [], map: generateMap(), keys: {}, enemiesKilled: 0,
      enemiesToSpawn: count, totalEnemiesInStage: count, spawnTimer: 0
    };
    spawnEnemy();
    setGameState('playing');
  };

  const handleUpgrade = (type, cost) => {
    if (stars >= cost && upgrades[type] < 10) {
      setStars(prev => prev - cost);
      setUpgrades(prev => ({ ...prev, [type]: prev[type] + 1 }));
    }
  };

  useEffect(() => {
    if (gameState !== 'playing' || !isGameOpen) return;
    const ctx = canvasRef.current.getContext('2d');
    let animationFrameId;

    const checkCollision = (x, y, map) => {
      const padding = 2;
      const points = [{x:x+padding, y:y+padding}, {x:x+TANK_SIZE-padding, y:y+padding}, {x:x+padding, y:y+TANK_SIZE-padding}, {x:x+TANK_SIZE-padding, y:y+TANK_SIZE-padding}];
      for (let p of points) {
        const gx = Math.floor(p.x / TILE_SIZE); const gy = Math.floor(p.y / TILE_SIZE);
        if (map[gy] && map[gy][gx] !== 0) return true;
      }
      return false;
    };

    const update = () => {
      const g = gameRef.current; const p = g.player;
      g.spawnTimer++;
      if (g.spawnTimer > 120 && g.enemies.length < 3 && g.enemiesToSpawn > 0) { spawnEnemy(); g.spawnTimer = 0; }

      const playerSpeed = 1.5 + (upgrades.speed * 0.4);
      let nX = p.x; let nY = p.y;
      if (g.keys['w'] || g.keys['ArrowUp']) { nY -= playerSpeed; p.dir = 'up'; }
      else if (g.keys['s'] || g.keys['ArrowDown']) { nY += playerSpeed; p.dir = 'down'; }
      else if (g.keys['a'] || g.keys['ArrowLeft']) { nX -= playerSpeed; p.dir = 'left'; }
      else if (g.keys['d'] || g.keys['ArrowRight']) { nX += playerSpeed; p.dir = 'right'; }
      if (!checkCollision(nX, p.y, g.map)) p.x = nX;
      if (!checkCollision(p.x, nY, g.map)) p.y = nY;

      const cooldown = 1200 - (upgrades.fireRate * 100);
      if (g.keys[' '] && Date.now() - p.lastShot > cooldown) {
        g.bullets.push({ x: p.x + TANK_SIZE/2, y: p.y + TANK_SIZE/2, dir: p.dir, owner: 'player' });
        p.lastShot = Date.now();
      }

      g.bullets = g.bullets.filter(b => {
        const bSpeed = b.owner === 'player' ? 3.5 + (upgrades.firePower * 0.5) : 1.2 * Math.pow(1.001, stage - 1);
        if (b.dir === 'up') b.y -= bSpeed; if (b.dir === 'down') b.y += bSpeed; if (b.dir === 'left') b.x -= bSpeed; if (b.dir === 'right') b.x += bSpeed;
        const gx = Math.floor(b.x / TILE_SIZE); const gy = Math.floor(b.y / TILE_SIZE);
        if (g.map[gy] && g.map[gy][gx] > 0) { if (g.map[gy][gx] === 1) g.map[gy][gx] = 0; return false; }
        if (b.owner === 'player') {
          for (let i = 0; i < g.enemies.length; i++) {
            const e = g.enemies[i];
            if (b.x > e.x && b.x < e.x + TANK_SIZE && b.y > e.y && b.y < e.y + TANK_SIZE) { g.enemies.splice(i, 1); g.enemiesKilled += 1; return false; }
          }
        } else {
          if (b.x > p.x && b.x < p.x + TANK_SIZE && b.y > p.y && b.y < p.y + TANK_SIZE) { p.hp -= 1; if (p.hp <= 0) setGameState('gameover'); return false; }
        }
        return b.x > 0 && b.x < GRID_SIZE * TILE_SIZE && b.y > 0 && b.y < GRID_SIZE * TILE_SIZE;
      });

      const eSpeed = 0.4 * Math.pow(1.001, stage - 1);
      g.enemies.forEach(e => {
        e.moveTick++;
        if (e.moveTick > 40) { e.dir = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)]; e.moveTick = 0; }
        let nEx = e.x; let nEy = e.y;
        if (e.dir === 'up') nEy -= eSpeed; if (e.dir === 'down') nEy += eSpeed; if (e.dir === 'left') nEx -= eSpeed; if (e.dir === 'right') nEx += eSpeed;
        if (!checkCollision(nEx, nEy, g.map)) { e.x = nEx; e.y = nEy; } else e.moveTick = 41;
        if (Math.random() < (0.5/60) * Math.pow(1.001, stage-1) && Date.now() - e.lastShot > 1000) {
          g.bullets.push({ x: e.x + TANK_SIZE/2, y: e.y + TANK_SIZE/2, dir: e.dir, owner: 'enemy' });
          e.lastShot = Date.now();
        }
      });

      if (g.enemiesKilled >= g.totalEnemiesInStage) { setStars(s => s + (10 * stage * upgrades.multiplier)); setGameState('win_stage'); }
    };

    const draw = () => {
      ctx.fillStyle = '#111'; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const g = gameRef.current;
      g.map.forEach((row, y) => row.forEach((tile, x) => {
        if (tile === 1) { ctx.fillStyle = '#8B4513'; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1); }
        else if (tile === 2) { ctx.fillStyle = '#555'; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
      }));
      g.bullets.forEach(b => { ctx.fillStyle = b.owner === 'player' ? '#fff' : '#e74c3c'; ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = '#f1c40f'; ctx.fillRect(g.player.x, g.player.y, TANK_SIZE, TANK_SIZE);
      ctx.fillStyle = '#e74c3c'; g.enemies.forEach(e => { ctx.fillRect(e.x, e.y, TANK_SIZE, TANK_SIZE); });
    };

    const loop = () => { update(); draw(); animationFrameId = requestAnimationFrame(loop); };
    const handleKeyDown = (e) => { gameRef.current.keys[e.key] = true; };
    const handleKeyUp = (e) => { gameRef.current.keys[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    loop();
    return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [gameState, isGameOpen, upgrades, stage]);

  // --- Views Components (ส่วนที่แก้ไข) ---
  const HomeView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1 mb-6 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-[10px] font-black uppercase tracking-widest italic">Digital Creator & Tank Commander</div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter italic leading-none">Visuals <span className="text-yellow-400">&</span> Gameplay</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          ศิลปะแห่งโลกดิจิทัลและการพัฒนาเกมเข้าด้วยกัน สร้างสรรค์ประสบการณ์ที่แปลกใหม่และน่าประทับใจ
        </p>
        <div className="flex justify-center gap-6">
          <button onClick={() => setCurrentView('works')} className="bg-yellow-400 text-black px-10 py-4 rounded-full font-black uppercase text-sm tracking-widest hover:scale-105 transition-all">View Projects</button>
          <button onClick={() => setCurrentView('skills')} className="bg-white/5 border border-white/10 px-10 py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all">My Skills</button>
        </div>
      </section>

      {/* IMAGE CAROUSEL SECTION */}
      <section className="py-10 px-6 max-w-5xl mx-auto relative group">
        <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 aspect-video bg-black shadow-2xl">
          <div 
            className="flex h-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {projects.map((project, index) => (
              <div key={project.id} className="min-w-full h-full relative group/item">
                <a 
                  href={project.ytLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full h-full relative"
                >
                  <img 
                    src={project.img} 
                    className="w-full h-full object-cover opacity-50 group-hover/item:opacity-80 group-hover/item:scale-105 transition-all duration-700" 
                    alt={project.title} 
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <div className="bg-yellow-400 text-black p-5 rounded-full shadow-2xl">
                      <Play size={32} fill="currentColor" />
                    </div>
                  </div>
                </a>
                
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                  <span className="text-yellow-400 font-bold uppercase text-[10px] md:text-xs mb-2 tracking-[0.3em]">Featured Project Preview</span>
                  <h2 className="text-4xl md:text-6xl font-black italic mb-4 uppercase tracking-tighter">{project.title}</h2>
                  <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed">{project.desc}</p>
                  
                  {/* Progress Indicators */}
                  <div className="flex gap-2 mt-8 pointer-events-auto">
                    {projects.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-yellow-400' : 'w-4 bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-400 hover:text-black z-10"
          >‹</button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % projects.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-400 hover:text-black z-10"
          >›</button>
        </div>
      </section>
    </div>
  );

  const WorksView = () => (
    <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Selected <span className="text-yellow-400">Works</span></h2>
          <p className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">โครงการที่รวบรวมทักษะทั้งด้านศิลปะและการเขียนโปรแกรม</p>
        </div>
        <div className="flex gap-4">
          {['all', '3d', 'game'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === t ? 'bg-yellow-400 text-black' : 'bg-white/5 border border-white/5 hover:border-white/20'}`}>{t}</button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.filter(p => activeTab === 'all' || p.type === activeTab).map(p => (
          <div key={p.id} className="group bg-[#0f0f12] rounded-3xl overflow-hidden border border-white/5 hover:border-yellow-400/30 transition-all">
            <div className="aspect-video overflow-hidden bg-slate-800 relative">
              <a href={p.ytLink} target="_blank" rel="noopener noreferrer">
                <img src={p.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={p.title} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <Play size={40} className="text-yellow-400" fill="currentColor" />
                </div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full">
                  <ExternalLink size={18} className="text-yellow-400" />
                </div>
              </a>
            </div>
            <div className="p-8">
              <div className="text-yellow-400 text-[10px] font-black uppercase mb-2 tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" /> {p.tech}
              </div>
              <h3 className="text-2xl font-black italic mb-3 group-hover:text-yellow-400 transition-colors">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- ส่วนล่างเหมือนเดิมทั้งหมด ---
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans">
      <nav className="fixed top-0 w-full z-40 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div onClick={() => setCurrentView('home')} className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-tight cursor-pointer">
            PORTFOLIO <span className="text-white">:</span> GAME DEV
          </div>
          <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
            <button onClick={() => setCurrentView('home')} className={`transition-all ${currentView === 'home' ? 'text-yellow-400 border-b border-yellow-400' : 'text-slate-500 hover:text-white'}`}>Home</button>
            <button onClick={() => setCurrentView('works')} className={`transition-all ${currentView === 'works' ? 'text-yellow-400 border-b border-yellow-400' : 'text-slate-500 hover:text-white'}`}>Works</button>
            <button onClick={() => setCurrentView('skills')} className={`transition-all ${currentView === 'skills' ? 'text-yellow-400 border-b border-yellow-400' : 'text-slate-500 hover:text-white'}`}>Skills</button>
          </div>
        </div>
      </nav>

      <main>
        {currentView === 'home' && <HomeView />}
        {currentView === 'works' && <WorksView />}
        {currentView === 'skills' && <SkillsView />}
      </main>

      <button onClick={() => setIsGameOpen(true)} className="fixed bottom-8 right-8 w-20 h-20 bg-yellow-400 text-black rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex flex-col items-center justify-center font-black italic group border-4 border-[#0a0a0c]">
        <div className="text-3xl group-hover:rotate-12 transition-transform">🚜</div>
        <span className="text-[9px] uppercase tracking-tighter">Play Game</span>
      </button>

      {isGameOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-[#0f0f12] border-2 border-yellow-400 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-yellow-400 text-black font-black italic uppercase tracking-tighter">
              <div className="flex items-center gap-6">
                <span className="text-xl">Tank 1998 : Advanced</span>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="bg-black/10 px-3 py-1 rounded-full"><Star size={12} className="inline mr-1 fill-black" /> {stars}</div>
                  <div className="bg-black/10 px-3 py-1 rounded-full text-red-700">Stage {stage}</div>
                </div>
              </div>
              <button onClick={() => setIsGameOpen(false)}><X size={24} /></button>
            </div>

            <div className="relative bg-black flex items-center justify-center overflow-hidden" style={{ height: '416px' }}>
              {gameState === 'menu' && (
                <div className="text-center p-8">
                  <div className="mb-2 text-yellow-400 text-5xl font-black italic tracking-tighter">BATTLE CITY</div>
                  <div className="mb-8 text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Advanced Combat Simulator</div>
                  <div className="flex flex-col gap-3 w-64 mx-auto">
                    <button onClick={() => startMission(false)} className="w-full bg-white text-black py-4 font-black rounded hover:bg-yellow-400 transition-all uppercase tracking-widest text-sm">Start Stage {stage}</button>
                    <button onClick={() => setGameState('upgrade')} className="w-full bg-white/5 text-white py-4 font-black rounded hover:bg-white/10 transition-all border border-white/10 italic text-sm uppercase">Upgrade Tank</button>
                  </div>
                </div>
              )}

              {gameState === 'playing' && (
                <div className="relative">
                    <canvas ref={canvasRef} width={GRID_SIZE * TILE_SIZE} height={GRID_SIZE * TILE_SIZE} className="border border-white/5 shadow-[0_0_20px_rgba(0,0,0,1)]" />
                </div>
              )}

              {gameState === 'upgrade' && (
                <div className="w-full h-full p-8 flex flex-col bg-[#0a0a0c] overflow-y-auto">
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-yellow-400">Upgrade Garage</h3>
                        <div className="text-white font-black text-sm bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20"><Star size={16} className="inline mr-1 text-yellow-400 fill-yellow-400" /> {stars}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { key: 'fireRate', name: 'Fire Rate', icon: <Timer size={18} />, cost: upgrades.fireRate * 12, desc: 'ยิงรัวขึ้น' },
                            { key: 'firePower', name: 'Bullet Speed', icon: <Zap size={18} />, cost: upgrades.firePower * 15, desc: 'กระสุนเร็วขึ้น' },
                            { key: 'shield', name: 'Plating', icon: <Shield size={18} />, cost: upgrades.shield * 20, desc: 'เพิ่ม HP' },
                            { key: 'speed', name: 'Engine', icon: <ChevronUp size={18} />, cost: upgrades.speed * 18, desc: 'ความเร็วรถถัง' },
                            { key: 'multiplier', name: 'Scavenger', icon: <Star size={18} />, cost: upgrades.multiplier * 25, desc: 'คูณดาวจบด่าน' }
                        ].map(item => (
                            <div key={item.key} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg group-hover:bg-yellow-400 group-hover:text-black transition-colors">{item.icon}</div>
                                    <div className={`text-[10px] font-black ${stars >= item.cost ? 'text-yellow-400' : 'text-red-500'}`}>{item.cost} ★</div>
                                </div>
                                <div className="text-xs font-black uppercase mb-1">{item.name} LV.{upgrades[item.key]}</div>
                                <button onClick={() => handleUpgrade(item.key, item.cost)} disabled={stars < item.cost || upgrades[item.key] >= 10} className="w-full py-2 bg-white/5 hover:bg-yellow-400 hover:text-black rounded text-[9px] font-black transition-all border border-white/5">Upgrade</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setGameState('menu')} className="mt-8 self-center text-[10px] font-bold text-slate-500 uppercase tracking-widest underline">Back to Menu</button>
                </div>
              )}

              {gameState === 'win_stage' && (
                <div className="text-center p-8 animate-in zoom-in duration-500">
                    <Trophy className="mx-auto text-yellow-400 mb-4 animate-bounce" size={64} />
                    <h2 className="text-4xl font-black text-white italic mb-2 tracking-tighter uppercase">Mission Success</h2>
                    <button onClick={() => { setStage(s => s + 1); setGameState('menu'); }} className="bg-white text-black px-12 py-4 font-black rounded hover:bg-yellow-400 transition-all uppercase tracking-widest text-sm">Next Stage</button>
                </div>
              )}

              {gameState === 'gameover' && (
                  <div className="text-center p-8 animate-in zoom-in duration-300">
                      <h2 className="text-5xl font-black text-red-600 mb-2 italic tracking-tighter uppercase">Critical Damage</h2>
                      <div className="flex flex-col gap-3 w-64 mx-auto mt-8">
                        <button onClick={() => startMission(true)} className="w-full bg-white text-black py-4 font-black rounded uppercase text-sm italic">Reboot Simulator</button>
                        <button onClick={() => setGameState('menu')} className="text-slate-500 text-[10px] uppercase font-bold tracking-widest underline">Main Menu</button>
                      </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="py-20 border-t border-white/5 text-center">
          <div className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em] italic">Digital Game Dev Portfolio © 2024</div>
      </footer>
    </div>
  );
};

export default App;
