const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let p1, p2, projectiles = [], particles = [];
let gameRunning = false;
let selectionStep = 1; 
let p1Choice = null, p2Choice = null;
let mobileModeActive = false;
let longModeActive = false;
let maxHP = 100;

const keys = {};

// --- DATOS DE LA ELEMENTAPEDIA ---
const charData = {
    agua: { emoji: '💧', name: 'Agua', type: 'Agua: control fluido y géiseres', s2Name: 'Dash Acuático', s2Desc: 'Dash frontal con estela', s2Emoji: '🌊', s3Name: 'Géiser Oculto', s3Desc: 'Invocación de géiser trampa', s3Emoji: '⛲', desc: 'Maestro del flujo continuo. Capaz de atravesar distancias cortas velozmente y castigar áreas estáticas con su géiser.' },
    fuego: { emoji: '🔥', name: 'Fuego', type: 'Fuego: ataque directo y duro', s2Name: 'Trampa Ígnea', s2Desc: 'Deja fuego explosivo en el suelo', s2Emoji: '🟧', s3Name: 'Meteorito', s3Desc: 'Lluvia de fuego desde el cielo', s3Emoji: '☄️', desc: 'Destructivo y letal. Sus llamas queman todo a su paso y controlan zonas con trampas de fuego puro.' },
    planta: { emoji: '☘️', name: 'Planta', type: 'Planta: trampa y atracción botánica', s2Name: 'Liana de Atracción', s2Desc: 'Engancha y atrae al rival', s2Emoji: '🌿', s3Name: 'Flor Gigante', s3Desc: 'Trampa floral de alto daño', s3Emoji: '🌸', desc: 'Especialista en control de espacio. Utiliza sus lianas para acercar enemigos descuidados.' },
    viento: { emoji: '🌬️', name: 'Viento', type: 'Viento: presión y órbita defensiva', s2Name: 'Tornado Atrapante', s2Desc: 'Atrapa y daña con succión continua', s2Emoji: '🌪️', s3Name: 'Escudo Órbita', s3Desc: 'Cuadrado giratorio protector (5s)', s3Emoji: '⬛', desc: 'Controla el ritmo del combate. Su tornado retiene al enemigo haciéndole perder vida sin desaparecer al instante.' },
    veneno: { emoji: '🟣', name: 'Veneno', type: 'Veneno: desgaste y silenciamiento', s2Name: 'Dardo Silenciador', s2Desc: 'Impide usar habilidades 3s', s2Emoji: '💜', s3Name: 'Mina Tóxica', s3Desc: 'Mina terrestre de daño masivo', s3Emoji: '🟪', desc: 'Mortífero a largo plazo. Debilita al rival bloqueando su acceso a ataques especiales.' },
    oscuridad: { emoji: '🌑', name: 'Oscuridad', type: 'Oscuridad: caos y teletransporte', s2Name: 'Invisibilidad', s2Desc: 'Teletransporte sorpresa oculto', s2Emoji: '👥', s3Name: 'Sartén Intercambiador', s3Desc: 'Golpea y cambia de lugar', s3Emoji: '🍳', desc: 'Impredecible y escurridizo. Confunde la posición del oponente intercambiando lugares en un segundo al acertar el sartén.' },
    hada: { emoji: '🌺', name: 'Hada', type: 'Hada: bendición y carga mítica', s2Name: 'Hongo Potenciador', s2Desc: 'Aumenta el daño temporalmente', s2Emoji: '🍄', s3Name: 'Embestida Unicornio', s3Desc: 'Carga frontal imparable', s3Emoji: '🦄', desc: 'Magia pura de apoyo y ofensiva directa con su mítica montura.' },
    hielo: { emoji: '❄️', name: 'Hielo', type: 'Hielo: congelación y barreras', s2Name: 'Cubo Helado', s2Desc: 'Congela al rival por 3s', s2Emoji: '🧊', s3Name: 'Domo Protector', s3Desc: 'Barrera impenetrable de hielo', s3Emoji: '🟦', desc: 'Especialista defensivo. Puede detener proyectiles por completo con su escudo de hielo.' },
    araña: { emoji: '🕷️', name: 'Araña', type: 'Araña: agilidad y redes veloces', s2Name: 'Red Ralentizadora', s2Desc: 'Reduce la velocidad del rival', s2Emoji: '🕸️', s3Name: 'Turbo Arácnido', s3Desc: 'Velocidad extrema temporal', s3Emoji: '⚡', desc: 'Destaca por su bajísima recarga de ataques y alta movilidad en pista.' },
    electrico: { emoji: '⚡', name: 'Eléctrico', type: 'Eléctrico: velocidad y rayos láser', s2Name: 'Rayo Láser', s2Desc: 'Proyectil ultrarrápido y potente', s2Emoji: '💡', s3Name: 'Campo Eléctrico', s3Desc: 'Dispara 4 orbes a las esquinas', s3Emoji: '🟡', desc: 'El rey de la velocidad de disparo. Sus rayos cruzan el mapa en un instante.' },
    alma: { emoji: '👻', name: 'Alma', type: 'Alma: posesión y espíritus guía', s2Name: 'Orbe de Posesión', s2Desc: 'Invierte los controles 5s', s2Emoji: '💙', s3Name: 'Alma Perseguidora', s3Desc: 'Espíritu rastreador infinito', s3Emoji: '👻', desc: 'Incomoda al rival invirtiendo sus controles y persiguéndole sin descanso.' },
    dragon: { emoji: '🐲', name: 'Dragón', type: 'Dragón: furia aérea y destrucción', s2Name: 'Vuelo Ígneo', s2Desc: 'Vuela invulnerable dejando fuego', s2Emoji: '🔺', s3Name: 'Aliento Destructor', s3Desc: 'Elimina proyectiles enemigos', s3Emoji: '🔥', desc: 'Poder puro de escamas. Capaz de anular ataques contrarios en pleno vuelo.' },
    portal: { emoji: '🌀', name: 'Portal', type: 'Portal: distorsión espacial', s2Name: 'Salto de Portal', s2Desc: 'Crea portales de teletransporte', s2Emoji: '🌀', s3Name: 'Escudo Espejo', s3Desc: 'Absorbe ataques y los devuelve en pan', s3Emoji: '🍞', desc: 'Maestro de la física cuántica, capaz de desviar ataques convirtiéndolos en pan.' },
    arena: { emoji: '⌛', name: 'Arena', type: 'Arena: lentitud y caos temporal', s2Name: 'Galleta Espejo', s2Desc: 'Desincroniza y acelera al rival', s2Emoji: '🍪', s3Name: 'Waffles Rebotadores', s3Desc: '3 waffles rebotan en paredes y jugadores', s3Emoji: '🧇', desc: 'Introduce lentitud acumulativa de hasta 1 minuto y desincroniza el movimiento rival impulsándolo velozmente.' },
    musical: { emoji: '🎶', name: 'Musical', type: 'Musical: ritmo, acumulación y curación', s2Name: 'Nota Creciente', s2Desc: 'Daño base 10 HP, se duplica cada golpe consecutivo', s2Emoji: '🎵', s3Name: 'Disparo Resonante', s3Desc: 'Onda gigante: daña al rival o cura 50 HP', s3Emoji: '🧿', desc: 'Músico táctico. Su nota (🎵) acumula daño x2 por impacto consecutivo. Su amuleto (🧿) genera una gran onda expansiva al chocar.' },
    espacial: { emoji: '🔮', name: 'Espacial', type: 'Espacial: gravitación y estelas cósmicas', s2Name: 'Línea Nebular', s2Desc: 'Deja una línea morada dañina hasta chocar', s2Emoji: '🍇', s3Name: 'Atracción Gravitacional', s3Desc: 'Dirige TODOS los proyectiles del campo al rival', s3Emoji: '🔮', desc: 'Dominante del espacio-tiempo. Puede llenar el escenario con líneas estelares dañinas y redirigir proyectiles masivos al rival.' }
};

function toggleLongMode() {
    longModeActive = !longModeActive;
    const btn = document.getElementById('long-mode-btn');
    if (longModeActive) {
        maxHP = 500;
        btn.innerText = "❤️ Modo Largo: ACTIVADO (500 HP)";
        btn.style.background = "#27ae60";
    } else {
        maxHP = 100;
        btn.innerText = "❤️ Modo Largo: DESACTIVADO (100 HP)";
        btn.style.background = "#8e44ad";
    }
}

function openElementapedia() {
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('elementapedia-screen').style.display = 'block';
    buildPediaThumbs();
    showPediaChar('fuego');
}

function closeElementapedia() {
    document.getElementById('elementapedia-screen').style.display = 'none';
    document.getElementById('selection-screen').style.display = 'block';
}

function buildPediaThumbs() {
    const container = document.getElementById('pedia-thumbs');
    container.innerHTML = '';
    for (let key in charData) {
        let data = charData[key];
        let btn = document.createElement('button');
        btn.className = 'pedia-thumb';
        btn.innerText = data.emoji;
        btn.onclick = () => showPediaChar(key);
        container.appendChild(btn);
    }
}

function showPediaChar(key) {
    let data = charData[key];
    document.getElementById('pedia-emoji').innerText = data.emoji;
    document.getElementById('pedia-type').innerText = data.type;
    document.getElementById('pedia-s2-name').innerText = data.s2Name;
    document.getElementById('pedia-s2-desc').innerText = data.s2Desc;
    document.getElementById('pedia-s2-emoji').innerText = data.s2Emoji;
    document.getElementById('pedia-s3-name').innerText = data.s3Name;
    document.getElementById('pedia-s3-desc').innerText = data.s3Desc;
    document.getElementById('pedia-s3-emoji').innerText = data.s3Emoji;
    document.getElementById('pedia-description').innerText = data.desc;
}

function toggleMobileMode() {
    mobileModeActive = !mobileModeActive;
    const btn = document.getElementById('mobile-mode-btn');
    if (mobileModeActive) {
        btn.innerText = "🖥️ Modo Celular: ACTIVADO";
        btn.style.background = "#1f6feb";
    } else {
        btn.innerText = "📱 Activar Modo Celular";
        btn.style.background = "#238636";
    }
}

function pressKey(code, isDown) { keys[code] = isDown; }

function triggerTouchAttack(char, skillSlot) {
    if (!gameRunning) return;
    const now = Date.now();
    if (now < char.silencedUntil) return;
    tryAttack(char, skillSlot);
}

const DEFAULT_CD  = { s1: 400, s2: 2500, s3: 5000 };
const SPIDER_CD   = { s1: 300, s2: 800, s3: 8000 };
const ELECTRIC_CD = { s1: 350, s2: 3000, s3: 1500 }; 
const ALMA_CD     = { s1: 450, s2: 6000, s3: 15000 };
const DRAGON_CD   = { s1: 300, s2: 7000, s3: 4000 };
const PORTAL_CD   = { s1: 400, s2: 4000, s3: 6000 };
const ARENA_CD    = { s1: 350, s2: 12000, s3: 4500 };
const MUSICAL_CD  = { s1: 400, s2: 1800, s3: 6000 };
const ESPACIAL_CD = { s1: 400, s2: 3000, s3: 8000 };

class Entity {
    constructor(x, y, color, type, isP1) {
        this.x = x; this.y = y;
        this.w = 50; this.h = 50;
        this.color = color;
        this.type = type;
        this.isP1 = isP1;
        this.hp = maxHP;
        this.lastAttack = { s1: 0, s2: 0, s3: 0 };
        this.angle = 0; 
        this.silencedUntil = 0; 
        this.frozenUntil = 0;
        this.slowedUntil = 0;
        this.speedBoostUntil = 0;
        this.invisibleUntil = 0;
        this.extraDmgUntil = 0;
        this.possessedUntil = 0;
        this.isCharging = false;
        this.chargeDir = 0;
        this.isFlying = false;
        this.lastTP = 0;
        this.sandStacks = 0; 
        this.cookieMirrorUntil = 0;
        this.windShieldUntil = 0;
        this.musicMultiplier = 10;
    }

    draw() {
        const now = Date.now();
        if (now < this.invisibleUntil || this.isFlying) { ctx.globalAlpha = 0.3; }

        if (now < this.frozenUntil && !this.isFlying) {
            ctx.fillStyle = "rgba(173, 216, 230, 0.6)";
            ctx.fillRect(this.x - 10, this.y - 10, this.w + 20, this.h + 20);
        }

        if (now < this.possessedUntil) {
            ctx.shadowBlur = 15; ctx.shadowColor = "#70a1ff";
            ctx.strokeStyle = "#70a1ff"; ctx.lineWidth = 4;
            ctx.strokeRect(this.x - 8, this.y - 8, this.w + 16, this.h + 16);
        }

        if (now < this.cookieMirrorUntil) {
            ctx.font = "30px Arial";
            ctx.fillText("🍪", this.x + 8, this.y - 15);
        }

        if (this.type === 'viento' && now < this.windShieldUntil) {
            let angle = (now / 200) % (Math.PI * 2);
            let orbitX = (this.x + 25) + Math.cos(angle) * 50;
            let orbitY = (this.y + 25) + Math.sin(angle) * 50;
            ctx.font = "30px Arial";
            ctx.fillText("⬛", orbitX - 15, orbitY + 10);
        }

        if (this.type === 'hielo' && now - this.lastAttack.s3 < 3000) {
            ctx.strokeStyle = "#00d2ff"; ctx.lineWidth = 6;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00d2ff";
            ctx.beginPath();
            ctx.arc(this.x + 25, this.y + 25, 45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = "rgba(0, 210, 255, 0.25)";
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        if (this.type === 'portal' && now - this.lastAttack.s3 < 2000) {
            ctx.strokeStyle = "#1abc9c"; ctx.lineWidth = 5;
            let target = (this.isP1 ? p2 : p1);
            let dir = target.x > this.x ? 1 : -1;
            ctx.strokeRect(this.x + (dir * 60), this.y - 10, 10, 70);
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        if (this.isCharging) {
            ctx.font = "40px Arial";
            let offset = this.chargeDir > 0 ? 35 : -40;
            ctx.fillText("🦄", this.x + offset, this.y + 35);
        }

        ctx.fillStyle = "white";
        let target = this.isP1 ? p2 : p1;
        let lookRight = target ? target.x > this.x : this.isP1;
        ctx.fillRect(lookRight ? this.x + 35 : this.x + 5, this.y + 10, 10, 10);
        ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;
    }
}

function selectCharacter(choice) {
    if (selectionStep === 1) { 
        p1Choice = choice; selectionStep = 2; 
        document.getElementById('turn-indicator').innerText = "Jugador 2: Elige tu personaje"; 
    } else { 
        p2Choice = choice; startBattle(); 
    }
}

function startBattle() {
    p1 = new Entity(150, 250, getColor(p1Choice), p1Choice, true);
    p2 = new Entity(800, 250, getColor(p2Choice), p2Choice, false);
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    canvas.style.display = 'block';
    
    if (mobileModeActive) { document.getElementById('mobile-controls').style.display = 'flex'; }

    gameRunning = true;
    loop();
}

function getColor(type) {
    const colors = { 
        agua: '#3498db', fuego: '#e67e22', planta: '#27ae60', 
        viento: '#95a5a6', veneno: '#9b59b6', oscuridad: '#485460', 
        hada: '#ff7675', hielo: '#00d2ff', araña: '#2f3542', 
        electrico: '#f1c40f', alma: '#a4b0be', dragon: '#c0392b', portal: '#1abc9c',
        arena: '#e58e26', musical: '#9936C7', espacial: '#6c5ce7'
    };
    return colors[type];
}

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

window.addEventListener('keydown', e => {
    if (!gameRunning) return;
    const now = Date.now();
    if (now < p1.silencedUntil && (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3')) return;
    if (now < p2.silencedUntil && (e.code === 'KeyJ' || e.code === 'KeyK' || e.code === 'KeyL')) return;

    if (e.code === 'Digit1') tryAttack(p1, 's1');
    if (e.code === 'Digit2') tryAttack(p1, 's2');
    if (e.code === 'Digit3') tryAttack(p1, 's3');
    if (e.code === 'KeyJ') tryAttack(p2, 's1');
    if (e.code === 'KeyK') tryAttack(p2, 's2');
    if (e.code === 'KeyL') tryAttack(p2, 's3');
});

function tryAttack(char, skillSlot) {
    const now = Date.now();
    let cds = DEFAULT_CD;
    if (char.type === 'araña') cds = SPIDER_CD;
    if (char.type === 'electrico') cds = ELECTRIC_CD;
    if (char.type === 'alma') cds = ALMA_CD;
    if (char.type === 'dragon') cds = DRAGON_CD;
    if (char.type === 'portal') cds = PORTAL_CD;
    if (char.type === 'arena') cds = ARENA_CD;
    if (char.type === 'musical') cds = MUSICAL_CD;
    if (char.type === 'espacial') cds = ESPACIAL_CD;

    if (now - char.lastAttack[skillSlot] >= cds[skillSlot]) {
        executeAttack(char, skillSlot);
        char.lastAttack[skillSlot] = now;
    }
}

function executeAttack(char, skillSlot) {
    const enemy = char.isP1 ? p2 : p1;
    const dir = (enemy.x > char.x) ? 1 : -1;
    const spawnX = char.x + (dir === 1 ? 65 : -45);
    const now = Date.now();

    if (char.type === 'espacial') {
        if (skillSlot === 's1') {
            projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '◽', dmg: 12, life: 100, owner: char });
        }
        if (skillSlot === 's2') {
            projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '🍇', dmg: 18, life: 120, owner: char, isGrapeTrail: true, startX: spawnX, startY: char.y + 20 });
        }
        if (skillSlot === 's3') {
            projectiles.forEach(p => {
                if (!p.isSonicWave && !p.isPortal) {
                    let dx = enemy.x + 25 - (p.x + 15);
                    let dy = enemy.y + 25 - (p.y + 15);
                    let dist = Math.hypot(dx, dy) || 1;
                    let speed = Math.hypot(p.vx, p.vy) || 12;
                    p.vx = (dx / dist) * speed;
                    p.vy = (dy / dist) * speed;
                }
            });
        }
    } else if (char.type === 'musical') {
        if (skillSlot === 's1') {
            projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '🔊', dmg: 12, life: 100, owner: char });
        }
        if (skillSlot === 's2') {
            projectiles.push({ x: spawnX, y: char.y, vx: 13 * dir, vy: 0, img: '🎵', dmg: char.musicMultiplier, life: 100, owner: char, isNote: true });
        }
        if (skillSlot === 's3') {
            projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🧿', dmg: 15, life: 100, owner: char, isResonantOrb: true });
        }
    } else if (char.type === 'arena') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 13 * dir, vy: 0, img: '💳', dmg: 6, life: 100, owner: char, sandStacker: true });
        if (skillSlot === 's2') char.cookieMirrorUntil = now + 4000;
        if (skillSlot === 's3') {
            for (let k = 0; k < 3; k++) {
                projectiles.push({ x: char.x + 25, y: char.y + 25, vx: (8 + Math.random() * 4) * dir, vy: (Math.random() - 0.5) * 8, img: '🧇', dmg: 14, life: 300, owner: char, bouncer: true, bouncesLeft: 6, lastBouncerHit: null });
            }
        }
    } else if (char.type === 'viento') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 16 * dir, vy: 0, img: '🌫️', dmg: 10, life: 100, owner: char });
        if (skillSlot === 's2') {
            projectiles.push({ x: spawnX, y: char.y - 10, vx: 4 * dir, vy: 0, img: '🌪️', dmg: 0.4, life: 180, owner: char, vortex: true });
        }
        if (skillSlot === 's3') char.windShieldUntil = now + 5000;
    } else if (char.type === 'oscuridad') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '🌑', dmg: 14, life: 100, owner: char });
        if (skillSlot === 's2') { char.invisibleUntil = now + 2000; setTimeout(() => { char.x = Math.random() * 800; char.y = Math.random() * 400; }, 1900); }
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '🍳', dmg: 12, life: 100, owner: char, swap: true });
    } else if (char.type === 'planta') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '☘️', dmg: 15, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🌿', dmg: 5, life: 90, owner: char, pull: true });
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 0, vy: 0, img: '🌸', dmg: 40, life: 15, owner: char });
    } else if (char.type === 'hada') {
        let extra = (now < char.extraDmgUntil) ? 6 : 0;
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 13 * dir, vy: 0, img: '🌺', dmg: 12 + extra, life: 100, owner: char });
        if (skillSlot === 's2') char.extraDmgUntil = now + 4000;
        if (skillSlot === 's3') { char.isCharging = true; char.chargeDir = dir; }
    } else if (char.type === 'hielo') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '❄️', dmg: 10, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🧊', dmg: 5, life: 100, owner: char, freeze: true });
    } else if (char.type === 'portal') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 12 * dir, vy: 0, img: '🎐', dmg: 14, life: 100, owner: char });
        if (skillSlot === 's2') {
            let exitX = Math.random() * 800 + 100, exitY = Math.random() * 300 + 100;
            projectiles.push({ x: char.x, y: char.y + 60, vx: 0, vy: 0, img: '🌀', life: 350, owner: char, isPortal: true, partnerX: exitX, partnerY: exitY - 60 });
            projectiles.push({ x: exitX, y: exitY, vx: 0, vy: 0, img: '🌀', life: 350, owner: char, isPortal: true, partnerX: char.x, partnerY: char.y });
        }
    } else if (char.type === 'dragon') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 9 * dir, vy: 0, img: '🔥', dmg: 16, life: 25, owner: char });
        if (skillSlot === 's2') {
            char.isFlying = true; char.invisibleUntil = now + 3000;
            let groundY = char.y; char.y -= 120;
            for (let i = 0; i < 8; i++) {
                setTimeout(() => { projectiles.push({ x: char.x + (i * dir * 35), y: groundY, vx: 0, vy: 0, img: '🔺', dmg: 6, life: 240, owner: char, fireLine: true }); }, i * 250);
            }
            setTimeout(() => { char.isFlying = false; char.y += 120; }, 3000);
        }
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 13 * dir, vy: 0, img: '🔥', dmg: 22, life: 100, owner: char, destroyer: true });
    } else if (char.type === 'alma') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 11 * dir, vy: 0, img: '🔹', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 9 * dir, vy: 0, img: '💙', dmg: 5, life: 100, owner: char, possess: true });
        if (skillSlot === 's3') projectiles.push({ x: spawnX, y: char.y, vx: 0, vy: 0, img: '👻', dmg: 0.8, life: 600, owner: char, homing: true });
    } else if (char.type === 'electrico') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 18 * dir, vy: 0, img: '🧽', dmg: 10, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y - 15, vx: 25 * dir, vy: 0, img: '💡', dmg: 25, life: 80, owner: char, laser: true });
        if (skillSlot === 's3') { [[-5, -5], [5, -5], [-5, 5], [5, 5]].forEach(v => { projectiles.push({ x: char.x + 20, y: char.y + 20, vx: v[0], vy: v[1], img: '🟡', dmg: 5, life: 120, owner: char }); }); }
    } else if (char.type === 'araña') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🕸️', dmg: 8, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 10 * dir, vy: 0, img: '🕸️', dmg: 2, life: 120, owner: char, slow: true });
        if (skillSlot === 's3') char.speedBoostUntil = now + 3000;
    } else if (char.type === 'veneno') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 14 * dir, vy: 0, img: '🟣', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 16 * dir, vy: 0, img: '💜', dmg: 5, life: 100, owner: char, silence: true });
        if (skillSlot === 's3') projectiles.push({ x: char.x, y: char.y, vx: 0, vy: 0, img: '🟪', dmg: 35, life: 500, owner: char, mine: true });
    } else if (char.type === 'agua') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '💦', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') { char.x += 180 * dir; projectiles.push({ x: char.x - (90 * dir), y: char.y, vx: 0, vy: 0, img: '🌊', dmg: 15, life: 12, owner: char }); }
        if (skillSlot === 's3') { let tx = char.x + 280 * dir, ty = char.y; setTimeout(() => { if (Math.hypot(tx - enemy.x, ty - enemy.y) < 100) enemy.hp -= 35; }, 1500); }
    } else if (char.type === 'fuego') {
        if (skillSlot === 's1') projectiles.push({ x: spawnX, y: char.y, vx: 15 * dir, vy: 0, img: '🔥', dmg: 12, life: 100, owner: char });
        if (skillSlot === 's2') projectiles.push({ x: spawnX, y: char.y, vx: 0, vy: 0, img: '🟧', dmg: 25, life: 15, owner: char });
        if (skillSlot === 's3') projectiles.push({ x: enemy.x, y: -60, vx: 0, vy: 8, img: '☄️', dmg: 40, life: 200, owner: char });
    }
}

function spawnSonicWave(x, y, owner) {
    projectiles.push({ x: x, y: y, radius: 10, maxRadius: 220, owner: owner, isSonicWave: true, life: 50 });
}

function drawCooldowns(char, x, y) {
    const now = Date.now();
    const icons = { 
        agua: ['💦', '🌊', '⛲'], fuego: ['🔥', '🟧', '☄️'], planta: ['☘️', '🌿', '🌸'], 
        viento: ['🌫️', '🌪️', '⬛'], veneno: ['🟣', '💜', '🟪'], oscuridad: ['🌑', '👥', '🍳'], 
        hada: ['🌺', '🍄', '🦄'], hielo: ['❄️', '🧊', '🟦'], araña: ['🕸️', '🕸️', '⚡'], 
        electrico: ['🧽', '💡', '🟡'], alma: ['🔹', '💙', '👻'], dragon: ['🔥', '🔺', '🔥'], portal: ['🎐', '🌀', '🍞'],
        arena: ['💳', '🍪', '🧇'], musical: ['🔊', '🎵', '🧿'], espacial: ['◽', '🍇', '🔮']
    };
    let cds = DEFAULT_CD;
    if (char.type === 'araña') cds = SPIDER_CD;
    if (char.type === 'electrico') cds = ELECTRIC_CD;
    if (char.type === 'alma') cds = ALMA_CD;
    if (char.type === 'dragon') cds = DRAGON_CD;
    if (char.type === 'portal') cds = PORTAL_CD;
    if (char.type === 'arena') cds = ARENA_CD;
    if (char.type === 'musical') cds = MUSICAL_CD;
    if (char.type === 'espacial') cds = ESPACIAL_CD;
    
    const set = icons[char.type];
    [0, 1, 2].forEach(i => {
        const bx = x + (i * 75), sid = 's' + (i + 1);
        const progress = Math.min(1, (now - char.lastAttack[sid]) / cds[sid]);
        ctx.fillStyle = "#333"; ctx.fillRect(bx, y, 60, 6);
        ctx.fillStyle = (now < char.silencedUntil) ? "#8e44ad" : (progress === 1 ? "#2ecc71" : "#f1c40f");
        ctx.fillRect(bx, y, 60 * progress, 6);
        ctx.font = "20px Arial"; ctx.fillText(set[i], bx + 15, y + 25);
    });
}

function loop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = Date.now();

    function move(p) {
        if (now < p.frozenUntil || p.isCharging) return;
        
        let baseSpeed = 6 - (p.sandStacks * 0.1); 
        if (baseSpeed < 1) baseSpeed = 1;

        if (now < p.speedBoostUntil) baseSpeed = 12;
        if (now < p.slowedUntil) baseSpeed = 2;

        let up = (p === p1) ? 'KeyW' : 'ArrowUp';
        let down = (p === p1) ? 'KeyS' : 'ArrowDown';
        let left = (p === p1) ? 'KeyA' : 'ArrowLeft';
        let right = (p === p1) ? 'KeyD' : 'ArrowRight';

        if (now < p.possessedUntil) { 
            let tempUp = up; up = down; down = tempUp;
            let tempLeft = left; left = right; right = tempLeft;
        }

        if (keys[up] && p.y > 0) p.y -= baseSpeed;
        if (keys[down] && p.y < 450) p.y += baseSpeed;
        if (keys[left] && p.x > 0) p.x -= baseSpeed;
        if (keys[right] && p.x < 950) p.x += baseSpeed;

        let enemy = (p === p1) ? p2 : p1;
        if (now < p.cookieMirrorUntil) {
            let fastSpeed = 14; 
            if (keys[up] && enemy.y > 0) enemy.y -= fastSpeed;
            if (keys[down] && enemy.y < 450) enemy.y += fastSpeed;
            if (keys[left] && enemy.x > 0) enemy.x -= fastSpeed;
            if (keys[right] && enemy.x < 950) enemy.x += fastSpeed;
        }

        if (p.type === 'viento' && now < p.windShieldUntil) {
            let angle = (now / 200) % (Math.PI * 2);
            let orbitX = (p.x + 25) + Math.cos(angle) * 50;
            let orbitY = (p.y + 25) + Math.sin(angle) * 50;
            if (Math.hypot(orbitX - (enemy.x + 25), orbitY - (enemy.y + 25)) < 35) {
                enemy.hp -= 0.5;
            }
        }
    }

    move(p1); move(p2);

    [p1, p2].forEach(p => {
        if (p.isCharging) {
            p.x += 14 * p.chargeDir;
            let enemy = (p === p1) ? p2 : p1;
            if (Math.hypot(p.x - enemy.x, p.y - enemy.y) < 50) {
                enemy.hp -= 30;
                p.isCharging = false;
            }
            if (p.x < 0 || p.x > 950) p.isCharging = false;
        }
    });

    p1.draw(); p2.draw();
    drawCooldowns(p1, 50, 450);
    drawCooldowns(p2, 730, 450);

    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        let target = (p.owner === p1) ? p2 : p1;

        if (p.isSonicWave) {
            p.radius += 5; 
            p.life--;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(153, 54, 199, 0.75)";
            ctx.lineWidth = 6;
            ctx.stroke();

            if (!p.hitEnemy && Math.hypot((target.x + 25) - p.x, (target.y + 25) - p.y) < p.radius + 20) {
                target.hp -= 25;
                p.hitEnemy = true;
            }

            if (!p.healedOwner && Math.hypot((p.owner.x + 25) - p.x, (p.owner.y + 25) - p.y) < p.radius + 20) {
                p.owner.hp = Math.min(maxHP, p.owner.hp + 50);
                p.healedOwner = true;
            }

            if (p.life <= 0 || p.radius >= p.maxRadius) projectiles.splice(i, 1);
            continue;
        }

        // --- MANEJO DE LA LÍNEA MORADA DAÑINA DE ESPACIAL (🍇) ---
        if (p.isGrapeTrail) {
            ctx.beginPath();
            ctx.moveTo(p.startX, p.startY);
            ctx.lineTo(p.x + 15, p.y + 20);
            ctx.strokeStyle = "rgba(155, 89, 182, 0.85)";
            ctx.lineWidth = 8;
            ctx.stroke();

            // Daño directo instantáneo al tocar la línea morada
            let enemyDistToLine = Math.hypot((target.x + 25) - (p.x + 15), (target.y + 25) - (p.y + 20));
            if (enemyDistToLine < 35) {
                target.hp -= 1; // Daño constante mientras la cruce o toque
            }
        }

        if (p.isPortal) {
            [p1, p2].forEach(player => {
                if (Math.hypot(player.x - p.x, player.y - p.y) < 30 && now - player.lastTP > 500) {
                    player.x = p.partnerX; player.y = p.partnerY;
                    player.lastTP = now;
                    p.life = 0;
                }
            });
        }

        let pEnemy = p.owner.isP1 ? p2 : p1;
        if (pEnemy.type === 'portal' && now - pEnemy.lastAttack.s3 < 2000) {
            let pDir = (pEnemy.isP1 ? p2 : p1).x > pEnemy.x ? 1 : -1;
            let shieldX = pEnemy.x + (pDir * 60);
            if (p.x > shieldX - 20 && p.x < shieldX + 20 && Math.abs(p.y - pEnemy.y) < 60) {
                p.img = '🍞'; p.owner = pEnemy; p.vx *= -1.5; p.dmg = 20; p.isPortal = false;
            }
        }

        if (p.homing) { 
            let dx = target.x - p.x, dy = target.y - p.y, dist = Math.sqrt(dx * dx + dy * dy); 
            p.vx = (dx / dist) * 3.5; p.vy = (dy / dist) * 3.5; 
        }
        
        if (p.destroyer) { 
            for (let j = projectiles.length - 1; j >= 0; j--) { 
                let o = projectiles[j]; 
                if (o !== p && o.owner !== p.owner && Math.hypot(p.x - o.x, p.y - o.y) < 50) { 
                    projectiles.splice(j, 1); if (j < i) i--; 
                } 
            } 
        }

        if (p.bouncer) {
            if (p.x <= 0 || p.x >= 950) { p.vx *= -1; p.bouncesLeft--; }
            if (p.y <= 0 || p.y >= 450) { p.vy *= -1; p.bouncesLeft--; }

            [p1, p2].forEach(pl => {
                if (p.lastBouncerHit !== pl && Math.hypot((pl.x + 25) - (p.x + 15), (pl.y + 25) - (p.y + 15)) < 35) {
                    p.vx *= -1.2;
                    p.vy = (Math.random() - 0.5) * 8;
                    p.bouncesLeft--;
                    p.lastBouncerHit = pl;
                    pl.hp -= p.dmg;
                }
            });

            if (p.bouncesLeft <= 0) { p.life = 0; }
        }

        p.x += p.vx; p.y += p.vy; p.life--;
        ctx.font = p.laser ? "60px Arial" : "40px Arial"; 
        ctx.fillText(p.img, p.x, p.y + 40);
        
        let isHitBlocked = (target.type === 'hielo' && now - target.lastAttack.s3 < 3000) || target.isFlying;
        if (isHitBlocked) { 
            if (Math.hypot((target.x + 25) - p.x, (target.y + 25) - p.y) < 55) { p.life = 0; continue; } 
        }

        let hitWall = (p.x <= 0 || p.x >= 950 || p.y <= 0 || p.y >= 450);
        if (hitWall) {
            if (p.isNote) {
                p.owner.musicMultiplier = 10;
                p.life = 0;
            }
            if (p.isResonantOrb) {
                spawnSonicWave(p.x, p.y, p.owner);
                p.life = 0;
            }
        }

        let hitDist = Math.hypot((target.x + 25) - (p.x + 15), (target.y + 25) - (p.y + 15));
        if (p.vortex) {
            let directHit = Math.hypot((target.x + 25) - p.x, (target.y + 25) - p.y);
            if (directHit < 70) {
                let pushDir = p.vx > 0 ? 1 : -1;
                target.x = Math.max(0, Math.min(950, target.x + (pushDir * 1.5)));
                target.hp -= p.dmg;
            }
        } else if (!p.bouncer && (hitDist < 45 || (p.x < target.x + 50 && p.x + 40 > target.x && p.y < target.y + 50 && p.y + 40 > target.y))) {
            if (p.possess) target.possessedUntil = now + 5000;
            if (p.slow) target.slowedUntil = now + 3000;
            if (p.freeze) target.frozenUntil = now + 3000;
            if (p.silence) target.silencedUntil = now + 3000;
            
            if (p.isNote) {
                target.hp -= p.dmg;
                p.owner.musicMultiplier *= 2; 
                p.life = 0; 
                projectiles.splice(i, 1);
                continue;
            }

            if (p.isResonantOrb) {
                spawnSonicWave(p.x, p.y, p.owner);
                target.hp -= p.dmg;
                p.life = 0; 
                projectiles.splice(i, 1);
                continue;
            }

            if (p.push) {
                let pushDir = p.vx > 0 ? 1 : -1;
                target.x = Math.max(0, Math.min(950, target.x + (100 * pushDir)));
            }

            if (p.swap) {
                let tempX = p.owner.x, tempY = p.owner.y;
                p.owner.x = target.x; p.owner.y = target.y;
                target.x = tempX; target.y = tempY;
            }

            if (p.sandStacker) {
                target.sandStacks = Math.min(40, target.sandStacks + 3);
                setTimeout(() => { if (target.sandStacks > 0) target.sandStacks--; }, 60000);
            }

            if (p.pull) {
                target.x += (p.owner.x - target.x) * 0.7;
                target.y += (p.owner.y - target.y) * 0.7;
            }

            target.hp -= p.dmg; 
            if (!p.homing && !p.fireLine && !p.isPortal && !p.bouncer) p.life = 0;
        }

        if (p.life <= 0 || p.x < -200 || p.x > 1200) projectiles.splice(i, 1);
    }

    document.getElementById('p1-hp').innerText = Math.max(0, Math.ceil(p1.hp));
    document.getElementById('p2-hp').innerText = Math.max(0, Math.ceil(p2.hp));
    
    if (p1.hp <= 0 || p2.hp <= 0) { 
        gameRunning = false; alert("¡VICTORIA!"); location.reload(); 
    }
    requestAnimationFrame(loop);
}