let blockCount = 1;
let connections = []; 
let characters = []; 

const workspace = document.getElementById('workspace');
const canvasContainer = document.getElementById('canvas-container');
const svgCanvas = document.getElementById('svg-canvas');
const svgNS = "http://www.w3.org/2000/svg";

let isPanning = false;
let startX = 0, startY = 0;
let panX = 0, panY = 0;

document.addEventListener("DOMContentLoaded", () => {
    initBlockEvents(document.getElementById('block-1'));
    initBlockTypeSelect(document.getElementById('block-1'));
    initPanAndZoom();
    updateConnections();

    document.getElementById('btn-add-char').addEventListener('click', () => {
        const nameInput = document.getElementById('char-name-input');
        const emojiInput = document.getElementById('char-emoji-input');

        const name = nameInput.value.trim();
        const emoji = emojiInput.value.trim();

        if (!name || !emoji) {
            alert('Por favor ingresa un nombre y un emoji para el personaje.');
            return;
        }

        const newChar = { id: Date.now(), name, emoji };
        characters.push(newChar);

        nameInput.value = '';
        emojiInput.value = '';

        updateCharacterUI();
    });

    // Lógica para Guardar Proyecto
    document.getElementById('btn-save').addEventListener('click', () => {
        const blocksData = [];
        const blockElements = document.querySelectorAll('.block');

        blockElements.forEach(el => {
            const id = parseInt(el.getAttribute('data-id'));
            const type = el.getAttribute('data-type');
            const top = parseInt(el.style.top);
            const left = parseInt(el.style.left);
            const dialogue = el.querySelector('.dialogo-input').value;
            const optionInput = el.querySelector('.opcion-input');
            const optionText = optionInput ? optionInput.value : '';
            const charSelect = el.querySelector('.char-select');
            const selectedChar = charSelect ? charSelect.value : '';

            blocksData.push({
                id,
                type,
                top,
                left,
                dialogue,
                optionText,
                selectedChar
            });
        });

        const projectData = {
            blockCount,
            connections,
            characters,
            blocks: blocksData
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "novela_grafica_proyecto.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Lógica para Cargar Proyecto
    document.getElementById('file-input-load').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const projectData = JSON.parse(event.target.result);
                loadProject(projectData);
            } catch (err) {
                alert("Error al cargar el archivo. Asegúrate de que sea un JSON válido.");
                console.error(err);
            }
        };
        reader.readAsText(file);
        // Limpiar input para permitir cargar el mismo archivo otra vez si se desea
        e.target.value = '';
    });
});

function initPanAndZoom() {
    workspace.addEventListener('mousedown', (e) => {
        if (e.target !== workspace && e.target !== canvasContainer && e.target !== svgCanvas) return;
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        canvasContainer.style.transform = `translate(${panX}px, ${panY}px)`;
    });

    document.addEventListener('mouseup', () => {
        isPanning = false;
    });
}

function updateCharacterUI() {
    const listEl = document.getElementById('character-list');
    listEl.innerHTML = '';
    characters.forEach(c => {
        const badge = document.createElement('div');
        badge.classList.add('char-badge');
        badge.innerHTML = `<span>${c.emoji} <strong>${c.name}</strong></span>`;
        listEl.appendChild(badge);
    });

    const selects = document.querySelectorAll('.char-select');
    selects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = '<option value="">-- Elige personaje --</option>';
        characters.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.emoji} ${c.name}`;
            select.appendChild(opt);
        });
        select.value = currentVal;
    });
}

function initBlockTypeSelect(block) {
    const typeSelect = block.querySelector('.block-type-select');
    const charContainer = block.querySelector('.character-selector-container');

    typeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'character') {
            block.classList.add('character-block');
            charContainer.style.display = 'block';
            block.setAttribute('data-type', 'character');
        } else {
            block.classList.remove('character-block');
            charContainer.style.display = 'none';
            block.setAttribute('data-type', 'normal');
        }
    });
}

function initBlockEvents(block) {
    let isDraggingBlock = false;
    let dragStartX, dragStartY;
    const header = block.querySelector('.block-header');

    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('btn-delete-block')) return;
        isDraggingBlock = true;
        dragStartX = e.clientX - block.offsetLeft;
        dragStartY = e.clientY - block.offsetTop;
        block.style.zIndex = 100;
        e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingBlock) return;
        let x = e.clientX - dragStartX;
        let y = e.clientY - dragStartY;
        
        block.style.left = `${x}px`;
        block.style.top = `${y}px`;
        updateConnections();
    });

    document.addEventListener('mouseup', () => {
        if (isDraggingBlock) {
            isDraggingBlock = false;
            block.style.zIndex = 10;
        }
    });

    block.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        createNewBlock(block);
    });
}

function createNewBlock(parentBlock, savedData = null) {
    blockCount++;
    const newId = savedData ? savedData.id : blockCount;
    
    const newX = savedData ? savedData.left : (parentBlock.offsetLeft + 320);
    const newY = savedData ? savedData.top : (parentBlock.offsetTop + 50);

    const newBlock = document.createElement('div');
    newBlock.classList.add('block');
    newBlock.id = `block-${newId}`;
    newBlock.style.left = `${newX}px`;
    newBlock.style.top = `${newY}px`;
    newBlock.setAttribute('data-id', newId);
    
    const type = savedData ? savedData.type : 'normal';
    newBlock.setAttribute('data-type', type);
    if (type === 'character') {
        newBlock.classList.add('character-block');
    }

    let charOptionsHtml = '<option value="">-- Elige personaje --</option>';
    characters.forEach(c => {
        charOptionsHtml += `<option value="${c.id}">${c.emoji} ${c.name}</option>`;
    });

    const isRoot = (newId === 1);
    const deleteBtnHtml = isRoot ? '' : `<button class="btn-delete-block" title="Borrar bloque">🗑️</button>`;
    const optionStyle = isRoot ? 'style="display:none;"' : '';
    const charContainerStyle = (type === 'character') ? 'style="display:block;"' : 'style="display:none;"';

    newBlock.innerHTML = `
        <div class="block-header">
            <span>Bloque ${newId} ${isRoot ? '(Inicio)' : ''}</span>
            ${deleteBtnHtml}
        </div>
        <div class="block-body">
            <label>Tipo de bloque:</label>
            <select class="block-type-select">
                <option value="normal" ${type === 'normal' ? 'selected' : ''}>Narrador / Normal</option>
                <option value="character" ${type === 'character' ? 'selected' : ''}>Bloque de Personaje</option>
            </select>

            <div class="character-selector-container" ${charContainerStyle}>
                <label>Seleccionar Personaje:</label>
                <select class="char-select">
                    ${charOptionsHtml}
                </select>
            </div>

            <label>Diálogo del personaje:</label>
            <textarea class="dialogo-input" placeholder="Siguiente diálogo...">${savedData ? savedData.dialogue : ''}</textarea>
            
            <label class="opcion-label" ${optionStyle}>Texto de la opción (para llegar aquí):</label>
            <input type="text" class="opcion-input" placeholder="Ej: Aceptar misión" ${optionStyle} value="${savedData ? savedData.optionText : ''}">
        </div>
    `;

    canvasContainer.appendChild(newBlock);

    if (savedData && savedData.selectedChar) {
        newBlock.querySelector('.char-select').value = savedData.selectedChar;
    }

    if (!savedData) {
        connections.push({
            from: parseInt(parentBlock.getAttribute('data-id')),
            to: newId
        });
    }

    if (!isRoot) {
        const deleteBtn = newBlock.querySelector('.btn-delete-block');
        deleteBtn.addEventListener('click', () => {
            deleteBlock(newId);
        });
    }

    initBlockEvents(newBlock);
    initBlockTypeSelect(newBlock);
    updateConnections();
}

function deleteBlock(id) {
    const blockEl = document.querySelector(`[data-id="${id}"]`);
    if (!blockEl) return;

    blockEl.remove();
    connections = connections.filter(conn => conn.from !== id && conn.to !== id);
    updateConnections();
}

function loadProject(projectData) {
    // Limpiar bloques existentes (excepto el 1 para reutilizarlo o borrarlo)
    const allBlocks = document.querySelectorAll('.block');
    allBlocks.forEach(b => b.remove());

    blockCount = projectData.blockCount || 1;
    connections = projectData.connections || [];
    characters = projectData.characters || [];

    // Actualizar UI de personajes
    updateCharacterUI();

    // Reconstruir todos los bloques
    if (projectData.blocks && projectData.blocks.length > 0) {
        projectData.blocks.forEach(bData => {
            if (bData.id === 1) {
                // Recrear bloque 1 específicamente
                const newBlock = document.createElement('div');
                newBlock.classList.add('block');
                newBlock.id = `block-1`;
                newBlock.style.left = `${bData.left}px`;
                newBlock.style.top = `${bData.top}px`;
                newBlock.setAttribute('data-id', 1);
                newBlock.setAttribute('data-type', bData.type);
                if (bData.type === 'character') newBlock.classList.add('character-block');

                let charOptionsHtml = '<option value="">-- Elige personaje --</option>';
                characters.forEach(c => {
                    charOptionsHtml += `<option value="${c.id}">${c.emoji} ${c.name}</option>`;
                });

                newBlock.innerHTML = `
                    <div class="block-header">
                        <span>Bloque 1 (Inicio)</span>
                    </div>
                    <div class="block-body">
                        <label>Tipo de bloque:</label>
                        <select class="block-type-select">
                            <option value="normal" ${bData.type === 'normal' ? 'selected' : ''}>Narrador / Normal</option>
                            <option value="character" ${bData.type === 'character' ? 'selected' : ''}>Bloque de Personaje</option>
                        </select>

                        <div class="character-selector-container" ${bData.type === 'character' ? 'style="display:block;"' : 'style="display:none;"'}>
                            <label>Seleccionar Personaje:</label>
                            <select class="char-select">
                                ${charOptionsHtml}
                            </select>
                        </div>

                        <label>Diálogo del personaje:</label>
                        <textarea class="dialogo-input">${bData.dialogue || ''}</textarea>
                        
                        <label class="opcion-label" style="display:none;">Texto de la opción:</label>
                        <input type="text" class="opcion-input" style="display:none;">
                    </div>
                `;
                canvasContainer.appendChild(newBlock);
                if (bData.selectedChar) {
                    newBlock.querySelector('.char-select').value = bData.selectedChar;
                }
                initBlockEvents(newBlock);
                initBlockTypeSelect(newBlock);
            } else {
                createNewBlock(null, bData);
            }
        });
    }

    updateConnections();
    alert("¡Proyecto cargado con éxito!");
}

function updateConnections() {
    while (svgCanvas.firstChild) {
        svgCanvas.removeChild(svgCanvas.firstChild);
    }

    connections.forEach(conn => {
        const fromEl = document.querySelector(`[data-id="${conn.from}"]`);
        const toEl = document.querySelector(`[data-id="${conn.to}"]`);

        if (fromEl && toEl) {
            const x1 = fromEl.offsetLeft + fromEl.offsetWidth;
            const y1 = fromEl.offsetTop + (fromEl.offsetHeight / 2);
            const x2 = toEl.offsetLeft;
            const y2 = toEl.offsetTop + (toEl.offsetHeight / 2);

            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            svgCanvas.appendChild(line);
        }
    });
}

// ==========================================
// LÓGICA DEL VISOR DE NOVELA
// ==========================================
const btnStart = document.getElementById('btn-start');
const modal = document.getElementById('visualizer-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const vnText = document.getElementById('vn-text');
const vnChoicesContainer = document.getElementById('vn-choices-container');
const vnAvatar = document.getElementById('vn-character-avatar');
const vnAvatarEmoji = document.getElementById('vn-avatar-emoji');
const vnAvatarName = document.getElementById('vn-avatar-name');

let currentActiveCharacter = null;

btnStart.addEventListener('click', () => {
    modal.classList.remove('hidden');
    currentActiveCharacter = null; 
    startVisualizer(1); 
});

btnCloseModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

function startVisualizer(blockId) {
    const blockEl = document.querySelector(`[data-id="${blockId}"]`);
    if (!blockEl) return;

    const blockType = blockEl.getAttribute('data-type');
    if (blockType === 'character') {
        const charSelectVal = blockEl.querySelector('.char-select').value;
        if (charSelectVal) {
            const foundChar = characters.find(c => c.id == charSelectVal);
            if (foundChar) {
                currentActiveCharacter = foundChar; 
            }
        }
    }

    if (currentActiveCharacter) {
        vnAvatarEmoji.textContent = currentActiveCharacter.emoji;
        vnAvatarName.textContent = currentActiveCharacter.name;
        vnAvatar.classList.remove('hidden');
    } else {
        vnAvatar.classList.add('hidden');
    }

    const dialogueText = blockEl.querySelector('.dialogo-input').value;
    vnText.textContent = dialogueText || "(Bloque sin texto)";

    vnChoicesContainer.innerHTML = '';

    const outgoingConnections = connections.filter(conn => conn.from === blockId);

    if (outgoingConnections.length === 0) {
        const endMsg = document.createElement('p');
        endMsg.textContent = "- Fin de la ruta -";
        endMsg.style.color = "#aaa";
        endMsg.style.fontStyle = "italic";
        vnChoicesContainer.appendChild(endMsg);
    } else {
        outgoingConnections.forEach(conn => {
            const targetBlock = document.querySelector(`[data-id="${conn.to}"]`);
            if (targetBlock) {
                const optionText = targetBlock.querySelector('.opcion-input').value || `Ir al Bloque ${conn.to}`;
                
                const choiceBtn = document.createElement('button');
                choiceBtn.classList.add('vn-choice-btn');
                choiceBtn.textContent = optionText;
                
                choiceBtn.addEventListener('click', () => {
                    startVisualizer(conn.to);
                });

                vnChoicesContainer.appendChild(choiceBtn);
            }
        });
    }
}