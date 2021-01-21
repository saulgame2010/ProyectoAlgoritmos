function Huffman(am, w, h) {
    this.init(am, w, h);
}

Huffman.prototype = new Algorithm();
Huffman.prototype.constructor = Huffman;
Huffman.superclass = Algorithm.prototype;
Huffman.MARGIN_X = 40;
Huffman.MARGIN_Y = 60;
Huffman.STATUS_LABEL_X = 20;
Huffman.STATUS_LABEL_Y = 20;
Huffman.NODE_WIDTH = 25;
Huffman.NODE_HEIGHT = 25;
Huffman.NODE_SPACING_X = 30;
Huffman.NODE_SPACING_Y = 35;
Huffman.NORMAL_FG_COLOR = "#000";
Huffman.ROOT_FG_COLOR = "#00f";
Huffman.cmpByFreq = function(node1, node2) {
    return node1.freq - node2.freq;
}

Huffman.prototype.init = function(am, w, h) {
    Huffman.superclass.init.call(this, am, w, h);
    this.addControls();
    this.reset();
}

Huffman.prototype.addControls = function() {
    this.controls = [];
    this.btnReset = addControlToAlgorithmBar("Button", "Reiniciar animación");
    this.btnReset.onclick = this.reset.bind(this);
    this.controls.push(this.btnReset);
    this.btnBuild = addControlToAlgorithmBar("Button", "Dibujar árbol");
    this.btnBuild.onclick = this.buildWrapper.bind(this);
    this.controls.push(this.btnBuild);
    this.lblText = addLabelToAlgorithmBar("Ingresa el texto que desea codificar:");
    this.txtText = addControlToAlgorithmBar("Text", "ingresaTxt");
    this.controls.push(this.txtText);
}

Huffman.prototype.disableUI = function(event) {
    this.setEnabled(false);
}

Huffman.prototype.enableUI = function(event) {
    this.setEnabled(true);
}

Huffman.prototype.setEnabled = function(b) {
    for (var i = 0; i < this.controls.length; ++i) {
        this.controls[i].disabled = !b;
    }
}

Huffman.prototype.reset = function() {
    var i, ch, freqs;
    var text = this.txtText.value;
    this.nextId = 0;
    this.animationManager.resetAll();
    this.clearHistory();
    this.commands = [];
    this.statusId = this.newId();
    this.cmd(
        "CreateLabel", this.statusId, "Estado actual: Esperando texto...", Huffman.STATUS_LABEL_X, Huffman.STATUS_LABEL_Y, 0);

    // Se calcula la frecuenia de cada caracter del texto ingresado
    freqs = {};
    for (i = 0; i < text.length; ++i) {
        ch = text[i];
        freqs[ch] = 1 + (freqs[ch] !== undefined ? freqs[ch] : 0)
    }

    //Se crea el nodo (dentro del arbol)
    this.roots = [];
    Object.keys(freqs).sort().forEach(function(c, i) {
        this.roots.push(this.newLeafNode(c, freqs[c], i));
    }, this);
    this.pq = new Huffman.PQ(this.roots, Huffman.cmpByFreq);
    this.redrawTree();
    this.animationManager.StartNewAnimation(this.commands);
}


Huffman.prototype.newId = function() {
    return this.nextId++;
}

Huffman.prototype.newLeafNode = function(value, freq, rootIndex) {
    return {
        freq: freq,
        value: value,
        parent: undefined,
        child1: undefined,
        child2: undefined,
        rootIndex: rootIndex,
        id: undefined,
        width: Huffman.NODE_WIDTH,
        x: undefined,
        y: undefined,
        inPQ: true
    };
}

Huffman.prototype.newParentNode = function(child1, child2, rootIndex) {
    var node = {
        freq: child1.freq + child2.freq,
        value: undefined,
        parent: undefined,
        child1: child1,
        child2: child2,
        rootIndex: rootIndex,
        id: undefined,
        width: child1.width + Huffman.NODE_SPACING_X + child2.width,
        x: undefined,
        y: undefined,
        inPQ: false
    };

    if (child1.parent !== undefined || child2.parent !== undefined) {
        throw new Error("newParentNode: El nodo hijo ya tiene un padre.");
    }
    child1.parent = node;
    child2.parent = node;
    return node;
}

Huffman.prototype.getChildren = function(node) {
    return node.child1 !== undefined ? [node.child1, node.child2] : [];
}

Huffman.prototype.setNodeInPQ = function(node, inPQ) {
    if (inPQ !== undefined) {
        node.inPQ = inPQ;
    }
    this.cmd(
        "SetForegroundColor",
        node.id,
        node.inPQ ? Huffman.ROOT_FG_COLOR : Huffman.NORMAL_FG_COLOR);
}

Huffman.prototype.setStatus = function(msg) {
    this.cmd("SetText", this.statusId, msg);
}

Huffman.prototype.redrawTree = function() {
    var i;
    this.repositionTree();
    for (i = 0; i < this.roots.length; ++i) {
        this.realizePositions(this.roots[i]);
    }
}


Huffman.prototype.repositionTree = function() {
    var x = Huffman.MARGIN_X + Huffman.NODE_WIDTH / 2;
    var y = Huffman.MARGIN_Y + Huffman.NODE_HEIGHT / 2;
    var i, root;
    for (i = 0; i < this.roots.length; ++i) {
        root = this.roots[i];
        root.x = x + root.width / 2;
        root.y = y;
        this.repositionChildren(root);
        x += root.width + Huffman.NODE_SPACING_X;
    }
}

Huffman.prototype.repositionChildren = function(node) {
    var x = node.x - node.width / 2;
    var y = node.y + Huffman.NODE_SPACING_Y + Huffman.NODE_HEIGHT;
    var children = this.getChildren(node);
    var i, child;
    for (i = 0; i < children.length; ++i) {
        child = children[i];
        child.x = x + child.width / 2;
        child.y = y;
        this.repositionChildren(child);
        x += child.width + Huffman.NODE_SPACING_X;
    }
}

Huffman.prototype.realizePositions = function(node) {
    var children = this.getChildren(node);
    var i, label;
    if (node.id === undefined) {
        node.id = this.newId();
        label = node.value === undefined ?
            node.freq + "" :
            node.value + " (" + node.freq + ")";
        this.cmd("CreateCircle", node.id, label, node.x, node.y);
        this.setNodeInPQ(node);
        if (node.parent !== undefined) {
            this.cmd("Connect", node.parent.id, node.id);
        }
    } else {
        this.cmd("Move", node.id, node.x, node.y);
    }
    for (i = 0; i < children.length; ++i) {
        this.realizePositions(children[i]);
    }
}

//Aqui se unen los dos sub arboles y se actualiza el nodo padre
Huffman.prototype.union = function(node1, node2) {
    var i, nodeTmp, newRoot;
    if (node1.rootIndex === undefined || node2.rootIndex === undefined) {
        throw new Error("union: Ambos nodos deben tener índices de nodo raíz.");
    }
    if (node1.rootIndex > node2.rootIndex) {
        nodeTmp = node1;
        node1 = node2;
        node2 = nodeTmp;
    }

    newRoot = this.newParentNode(node1, node2, node1.rootIndex);
    this.roots[newRoot.rootIndex] = newRoot;
    this.roots.splice(node2.rootIndex, 1);
    for (i = node2.rootIndex; i < this.roots.length; ++i) {
        this.roots[i].rootIndex = i;
    }
    node1.rootIndex = undefined;
    node2.rootIndex = undefined;
    this.redrawTree();
    this.cmd("Connect", newRoot.id, node1.id);
    this.cmd("Connect", newRoot.id, node2.id);
    return newRoot;
}

Huffman.prototype.buildWrapper = function(event) {
    this.reset();
    if (this.txtText.value === "") {
        return;
    }
    this.implementAction(this.build.bind(this), this.txtText.value);
}

// Animacion que contruye el arbol por medio de la codificacion de Huffman
Huffman.prototype.build = function(text) {
    var node, child1, child2;
    this.commands = [];
    this.cmd("Step");
    while (this.pq.size() > 1) {
        this.setStatus("Estado actual: Eliminando dos elementos mínimos de la cola de prioridad.");
        this.cmd("Step");
        child1 = this.pq.removeMin();
        child2 = this.pq.removeMin();
        this.setNodeInPQ(child1, false);
        this.setNodeInPQ(child2, false);
        this.cmd("SetHighlight", child1.id, 1);
        this.cmd("SetHighlight", child2.id, 1);
        this.cmd("Step");
        this.setStatus("Estado actual: Fusionando los dos sub árboles.");
        this.cmd("Step");
        this.cmd("SetHighlight", child1.id, 0);
        this.cmd("SetHighlight", child2.id, 0);
        node = this.union(child1, child2);
        this.cmd("SetHighlight", node.id, 1);
        this.cmd("Step");
        this.setStatus("Estado actual: Reinsertando el nuevo nodo raíz en la cola de prioridad.");
        this.cmd("Step");
        this.pq.insert(node);
        this.setNodeInPQ(node, true);
        this.cmd("SetHighlight", node.id, 0);
        this.cmd("Step");
    }

    node = this.pq.removeMin();
    this.setNodeInPQ(node, false);
    this.setStatus("Estado actual: Se ha terminado la codificación\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nEste algoritmo es de programación voraz ya que busca optimizar la solución, es decir, buscar el \n\nárbol más sencillo posible");
    return this.commands;
}

Huffman.PQ = function(elements, comparator) {
    var i;
    this.comparator = comparator;
    this.elements = elements.slice();
    for (i = this.elements.length - 1; i >= 0; --i) {
        this.percolateDown(i);
    }
}

Huffman.PQ.prototype.size = function() {
    return this.elements.length;
}

Huffman.PQ.prototype.insert = function(element) {
    this.elements.push(element);
    this.percolateUp(this.elements.length - 1);
}

Huffman.PQ.prototype.removeMin = function() {
    var minElement = this.elements[0];
    this.swap(0, this.elements.length - 1);
    this.elements.pop();
    this.percolateDown(0);
    return minElement;
}

Huffman.PQ.prototype.getParent = function(i) {
    return i === 0 ? undefined : (i - ((i & 1) == 1 ? 1 : 2)) / 2;
}

Huffman.PQ.prototype.findMinChild = function(i) {
    var j = i * 2 + 1;  // Left child index.
    if (j >= this.elements.length) {
        return undefined;
    } else if (j + 1 < this.elements.length) {
        // Two children; compare them.
        if (this.comparator(this.elements[j], this.elements[j + 1]) < 0) {
            return j;  // Left child is smaller.
        } else {
            return j + 1;  // Right child is smaller.
        }
    } else {
        // Only one child.
        return j;
    }
}

Huffman.PQ.prototype.swap = function(i, j) {
    var x = this.elements[i];
    this.elements[i] = this.elements[j];
    this.elements[j] = x;
}

Huffman.PQ.prototype.percolateDown = function(i) {
    var j;
    while (true) {
        j = this.findMinChild(i);
        if (j === undefined) {
            break;
        }
        if (this.comparator(this.elements[i], this.elements[j]) <= 0) {
            break;
        }
        this.swap(i, j);
        i = j;
    }
}

Huffman.PQ.prototype.percolateUp = function(i) {
    var j;
    while (true) {
        j = this.getParent(i);
        if (j === undefined) {
            break;  // No parent.
        }
        if (this.comparator(this.elements[i], this.elements[j]) >= 0) {
            break;  // Current node is >= parent.
        }
        this.swap(i, j);
        i = j;
    }
}

var currentAlg;
function init() {
    var animManag = initCanvas();
    currentAlg = new Huffman(animManag, canvas.width, canvas.height);
    var button = document.getElementById("Dibujar árbol");
    button.addEventListener("click", function() {
        recogerTxt();
    });
}