let draw = SVG().addTo('.graph-container').size(1000,1000).viewbox(-150,-250,2000,2000).attr({
    preserveAspectRatio:"xMidYMid meet"
})


class TreeNode {
    children = []
    parent = null

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
        this.circle = draw.circle(50).center(this.x * 100, 100 * this.y)
        this.circle.click(() => {
            const newChild = new TreeNode()
            this.tree.addChild(newChild)
            this.children.push(new DrawNode(newChild, this.y + 1))
            custom_balanced(drawParent)
            draw.clear()
            drawParent.drawTree()
        })
        this.children.forEach(e => e.drawTree())
        this.children.forEach(e => draw.line(this.circle.cx(), this.circle.cy(), e.circle.cx(), e.circle.cy())
                                        .stroke({color: '#000',  width: 2 }))
    }
}

const tree = new TreeNode()
const drawParent = new DrawNode(tree)

custom_balanced(drawParent)
drawParent.drawTree()