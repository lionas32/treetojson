let draw = SVG().addTo('.graph-container').size(1400,1000).viewbox(0,0,1400,1000)
let treeGroup = draw.group()

class TreeNode {
    constructor(){
        this.children = []
        this.parent = null
    }

    addChild(node){
        this.children.push(node)
        node.parent = this 
    }

    addChildren(nodes){
        nodes.forEach(e => this.addChild(e))
    }
}

class DrawNode {
    constructor(tree, depth){
        this.y = depth
        this.tree = tree
        if(depth == undefined){
            this.y = 0
            this.children = tree.children.map(e => new DrawNode(e, 1))
        } else{
            this.children = tree.children.map(e => new DrawNode(e, depth + 1))
        }
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
        this.drawNode()
        treeGroup.attr('transform', `translate(${(draw.width() / 2) - (treeGroup.width() / 2)}, 100)`)

    }

    drawNode(){
        this.circle = treeGroup.circle(35).center(this.x * 75, this.y * 75)
        this.circle.click(() => {
            const newChild = new TreeNode()
            this.tree.addChild(newChild)
            this.children.push(new DrawNode(newChild, this.y + 1))
            customBalanced(drawParent)
            treeGroup.clear()
            drawParent.drawTree()
        })
        this.children.forEach(e => e.drawNode())
        this.children.forEach(e => treeGroup
            .line(this.circle.cx(), this.circle.cy(), e.circle.cx(), e.circle.cy())
            .stroke({color: '#000',  width: 2 }))
    }
}

const tree = new TreeNode()
const drawParent = new DrawNode(tree)

customBalanced(drawParent)
drawParent.drawTree()