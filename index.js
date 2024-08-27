class Node {
    constructor(value = null, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

class Tree {
    constructor(array) {
        this.array = array;
        this.root = this.buildTree(this.sortedArray);
    }

    get sortedArray() {
        return [...new Set(this.array)].sort((a, b) => a - b);
    }

    buildTree(sortedArray) {
        if (sortedArray.length === 0) {
            return null;
        }
        const index = Math.floor(sortedArray.length / 2);
        const root = new Node(sortedArray[index]);
        root.left = this.buildTree(sortedArray.slice(0, index));
        root.right = this.buildTree(sortedArray.slice(index + 1));
        return root;
    }

    prettyPrint(node = this.root, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    }

    insert(value, node = this.root) {
        if (node == null) {
            return new Node(value);
        }
        if (node.value > value) {
            node.left = this.insert(value, node.left);
        } else if (node.value < value) {
            node.right = this.insert(value, node.right);
        }
        return node;
    }

    deleteItem(value, node = this.root, parent = null) {
        if (node == null) {
            return null;
        }
        if (node.value > value) {
            node.left = this.deleteItem(value, node.left, node);
        } else if (node.value < value) {
            node.right = this.deleteItem(value, node.right, node);
        } else {
            if (node.left == null && node.right == null) {
                this.#updateParentChildLink(parent, node, null);
                return null;
            } else if (node.left == null) {
                this.#updateParentChildLink(parent, node, node.right);
                return node.right;
            } else if (node.right == null) {
                this.#updateParentChildLink(parent, node, node.left);
                return node.left;
            } else {
                let leafNode = this.#findMinNode(node.right);
                node.value = leafNode.value;
                node.right = this.deleteItem(leafNode.value, node.right, node);
            }
        }
        return node;
    }

    #updateParentChildLink(parent, current, newChild) {
        if (parent === null) {
            this.root = newChild;
        } else if (parent.left === current) {
            parent.left = newChild;
        } else if (parent.right === current) {
            parent.right = newChild;
        }
    }

    #findMinNode(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    find(value, node = this.root) {
        if (value == node.value || node == null) {
            return node;
        }
        if (node.value > value) {
            return this.find(value, node.left);
        } else {
            return this.find(value, node.right);
        }
    }

    levelOrder(callback) {
        if (!callback) throw new Error("A callback is required.");
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            callback(node);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }

    inOrder(callback, node = this.root) {
        if (!callback) throw new Error("A callback is required.");
        if (node == null) return;
        this.inOrder(callback, node.left);
        callback(node);
        this.inOrder(callback, node.right);
    }

    preOrder(callback, node = this.root) {
        if (!callback) throw new Error("A callback is required.");
        if (node == null) return;
        callback(node);
        this.preOrder(callback, node.left);
        this.preOrder(callback, node.right);
    }

    postOrder(callback, node = this.root) {
        if (!callback) throw new Error("A callback is required.");
        if (node == null) return;
        this.postOrder(callback, node.left);
        this.postOrder(callback, node.right);
        callback(node);
    }

    height(node) {
        if (node == null) {
            return -1;
        }
        return 1 + Math.max(this.height(node.left), this.height(node.right));
    }

    depth(node, current = this.root) {
        if (current == null) {
            return -1;
        }
        if (node.value == current.value) {
            return 0;
        } else if (node.value < current.value) {
            return 1 + this.depth(node, current.left);
        } else {
            return 1 + this.depth(node, current.right);
        }
    }

    isBalanced(node = this.root) {
        if (node == null) {
            return true;
        }
        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return false;
        }
        return this.isBalanced(node.left) && this.isBalanced(node.right);
    }

    reBalance() {
        const sortedArray = this.toArray();
        this.root = this.buildTree(sortedArray);
    }

    toArray() {
        const sorted = [];
        const callback = node => {
            sorted.push(node.value);
        }
        this.inOrder(callback, this.root);
        return sorted;
    }

}

function getRandomArray(size, max) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * max));
    }
    return array;
}
const testArray = getRandomArray(10, 100);
const tree = new Tree(testArray);
console.log(`testArray: ${testArray}`);
console.log(`sortedArray: ${tree.sortedArray}`);
console.log(`isBalanced? ${tree.isBalanced()}`);
tree.prettyPrint();

const levelOrderArray = [];
tree.levelOrder(node => levelOrderArray.push(node.value));
console.log(`levelOrderArray: ${levelOrderArray}`);

const inOrderArray = [];
tree.inOrder(node => inOrderArray.push(node.value));
console.log(`inOrderArray: ${inOrderArray}`);

const preOrderArray = [];
tree.preOrder(node => preOrderArray.push(node.value));
console.log(`preOrderArray: ${preOrderArray}`);

const postOrderArray = [];
tree.postOrder(node => postOrderArray.push(node.value));
console.log(`postOrderArray: ${postOrderArray}`);

tree.insert(200);
tree.insert(300);
tree.insert(400);

tree.prettyPrint();
console.log(`isBalanced? ${tree.isBalanced()}`);
tree.reBalance();
tree.prettyPrint();
console.log(`isBalanced? ${tree.isBalanced()}`);

const levelOrderArray2 = [];
tree.levelOrder(node => levelOrderArray2.push(node.value));
console.log(`levelOrderArray: ${levelOrderArray2}`);

const inOrderArray2 = [];
tree.inOrder(node => inOrderArray2.push(node.value));
console.log(`inOrderArray: ${inOrderArray2}`);

const preOrderArray2 = [];
tree.preOrder(node => preOrderArray2.push(node.value));
console.log(`preOrderArray: ${preOrderArray2}`);

const postOrderArray2 = [];
tree.postOrder(node => postOrderArray2.push(node.value));
console.log(`postOrderArray: ${postOrderArray2}`);