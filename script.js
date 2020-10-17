let draw = SVG().addTo('#drawing').size('100%','100%')
const docHeight = window.innerHeight
const docWitdh = window.innerWidth

class TreeNode {
    children = []
    parent = null

    addChild(node){
        this.children.push(node)
        node.parent = this 
        console.log(this.children.length)
    }

    addChildren(nodes){
        nodes.forEach(e => this.addChild(e))
    }
}

class DrawNode {
    y = 0
    x = -1
    tree = null
    children = []
    circle = null

    constructor(tree, depth){
        this.y = depth
        this.tree = tree
        if(depth == undefined){
            this.children = tree.children.map(e => new DrawNode(e, 1))

        } else{
            this.children = tree.children.map(e => new DrawNode(e, depth + 1))
        }
        console.log("in drawNode(tree, depth)")
    }

    leftChild(){
        if (this.children.length == 0)
            return null
        else
            return this.children[0]
    }

    rightChild(){
        if (this.children.length == 1)
            return null
        else
            return this.children[1]
    }

    drawTree(){
        console.log(this.x)
        this.circle = draw.circle(50).center(400 +  (this.x * 100), 200 + (this.y * 100))
        this.children.forEach(e => e.drawTree())
        this.children.forEach(e => draw.line(this.circle.cx(), this.circle.cy(), e.circle.cx(), e.circle.cy())
                                        .stroke({color: '#000',  width: 2 }))
    }
}

// Draw tree using knuth_layout algorithm. Works only on binary trees
const knuth_layout = tree => {
    let i = 0
    const setup_tree = (tree, depth) => {
        const left = tree.leftChild()
        const right = tree.rightChild()
        console.log("in setup tree")
        if (left){
            setup_tree(left, depth + 1)
        }
        tree.x = i
        tree.y = depth
        i += 1
        if (right){
            setup_tree(right, depth + 1)
        }
    }
    setup_tree(tree, 0)
}


const minimum_ws = tree => {
    const nexts = Array(100).fill(0)
    const setup_tree = (tree,depth) => {
        tree.x = nexts[depth]
        tree.y = depth
        nexts[depth] += 1
        tree.children.forEach((e) => setup_tree(e, depth + 1))
    }
    setup_tree(tree, 0)
}

const custom_balanced = tree => {
    let next_x = 0
    const filled = Array(100).fill(false)
    const setup_tree = (tree,depth) => {
        tree.children.forEach(e => setup_tree(e, depth + 1))
        tree.y = depth
        if(tree.children.length == 0){
            tree.x = next_x
            filled[next_x] = true
            next_x += 1
        }
        else{
            if(tree.children.length == 1){
                tree.x = tree.children[0].x
            }
            else{
                filled[next_x] = true
                tree.x = tree.children.reduce((acc, curr) => acc + curr.x, 0) / tree.children.length
                console.log(tree.children.reduce((acc, curr) => acc + curr.x, 0)) 
            }
        }
    }
    setup_tree(tree, 0)
}

const tree = new TreeNode()
const left = new TreeNode()
const right = new TreeNode()
const rightleft = new TreeNode()
const rightleftleft = new TreeNode()
const rightleftleftleft = new TreeNode()
tree.addChildren([left,right])
left.addChildren([new TreeNode(), new TreeNode(), new TreeNode(), new TreeNode(), new TreeNode()])
right.addChild(rightleft)
rightleft.addChildren([rightleftleft, new TreeNode()])
rightleftleft.addChild(rightleftleftleft)
rightleftleft.addChild(new TreeNode())
rightleftleft.addChild(new TreeNode())
rightleftleft.addChild(new TreeNode())
const drawParent = new DrawNode(tree)
console.log(drawParent)


custom_balanced(drawParent)
drawParent.drawTree()

// let node = draw.circle(100).attr({ fill: '#f06' }).center(docWitdh/2)
