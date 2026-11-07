document.addEventListener('DOMContentLoaded', () => {
    const workspace = document.getElementById('workspace');
    const canvasContainer = document.getElementById('canvas-container');
    const svgCanvas = document.getElementById('svg-canvas');
    const sidebar = document.getElementById('sidebar');
    const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');

    let panX = 0, panY = 0;
    let isPanning = false;
    let startX = 0, startY = 0;

    let isDraggingBlock = false;
    let draggedBlock = null;
    let blockOffsetX = 0, blockOffsetY = 0;

    let connectingSourceId = null;

    // --- Adaptación del Menú Lateral para Móviles ---
    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // --- Arrastre del Lienzo (Pan) con ratón y táctil mediante Pointer Events ---
    workspace.addEventListener('pointerdown', (e) => {
        if (e.target === workspace || e.target === canvasContainer || e.target === svgCanvas) {
            isPanning = true;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
            workspace.setPointerCapture(e.pointerId);
        }
    });

    workspace.addEventListener('pointermove', (e) => {
        if (isPanning) {
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            updateTransform();
        } else if (isDraggingBlock && draggedBlock) {
            const x = (e.clientX - panX - blockOffsetX);
            const y = (e.clientY - panY - blockOffsetY);
            draggedBlock.style.left = `${x}px`;
            draggedBlock.style.top = `${y}px`;
            updateConnections();
        }
    });

    const endPanOrDrag = (e) => {
        if (isPanning) {
            isPanning = false;
            try { workspace.releasePointerCapture(e.pointerId); } catch (_) {}
        }
        if (isDraggingBlock) {
            isDraggingBlock = false;
            draggedBlock = null;
        }
    };

    workspace.addEventListener('pointerup', endPanOrDrag);
    workspace.addEventListener('pointercancel', endPanOrDrag);

    function updateTransform() {
        canvasContainer.style.transform = `translate(${panX}px, ${panY}px)`;
    }

    // --- Arrastre de Bloques (Soporta Mouse y Touch) ---
    function makeBlockDraggable(block) {
        const header = block.querySelector('.block-header');

        header.addEventListener('pointerdown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn-connect-touch')) return;
            isDraggingBlock = true;
            draggedBlock = block;

            const rect = block.getBoundingClientRect();
            blockOffsetX = e.clientX - rect.left;
            blockOffsetY = e.clientY - rect.top;

            header.setPointerCapture(e.pointerId);
            e.stopPropagation();
        });

        header.addEventListener('pointerup', (e) => {
            try { header.releasePointerCapture(e.pointerId); } catch (_) {}
        });

        // Conexión alternativa mediante el botón de enlace para pantallas táctiles
        const btnTouchConnect = block.querySelector('.btn-connect-touch');
        if (btnTouchConnect) {
            btnTouchConnect.addEventListener('click', (e) => {
                e.stopPropagation();
                handleBlockConnection(block.dataset.id);
            });
        }

        // Clic derecho convencional
        block.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            handleBlockConnection(block.dataset.id);
        });
    }

    function handleBlockConnection(blockId) {
        if (!connectingSourceId) {
            connectingSourceId = blockId;
            const sourceBlock = document.querySelector(`.block[data-id="${blockId}"]`);
            if (sourceBlock) sourceBlock.style.outline = '2px dashed #4CAF50';
        } else {
            if (connectingSourceId !== blockId) {
                createConnection(connectingSourceId, blockId);
            }
            const prevBlock = document.querySelector(`.block[data-id="${connectingSourceId}"]`);
            if (prevBlock) prevBlock.style.outline = 'none';
            connectingSourceId = null;
        }
    }

    function createConnection(sourceId, targetId) {
        // Implementación de lógica de conexión y actualización de SVG...
        updateConnections();
    }

    function updateConnections() {
        // Redibujado de líneas en svgCanvas entre bloques
    }

    // Inicializar bloques existentes
    document.querySelectorAll('.block').forEach(makeBlockDraggable);
});