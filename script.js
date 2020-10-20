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

// Draw tree using knuth_layout algorithm. Works only on binary trees
const knuth_layout = tree => {
    let i = 0
    const setup_tree = (tree, depth) => {
        const left = tree.leftChild()
        const right = tree.rightChild()
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
    const setup_tree = (tree) => {
        tree.children.forEach(e => setup_tree(e))
        if(tree.children.length == 0){
            tree.x = next_x
            next_x += 1
        }
        else{
            if(tree.children.length == 1){
                tree.x = tree.children[0].x
            }
            else{
                tree.x = tree.children.reduce((acc, curr) => acc + curr.x, 0) / tree.children.length
            }
        }
    }
    setup_tree(tree)
}

const produceJson = (tree) => {
    let counter = 0
    const traverse = (tree, levelCounter = 0) => {
            // TODO: fix this
            counter++
            return `\n${"\t".repeat(levelCounter)}{` 
                      + `\n${"\t".repeat(levelCounter+1)}\"id\": ${counter}, `
                      + `\n${"\t".repeat(levelCounter+1)}\"child\": [` 
                        + tree.children.map(e => traverse(e, levelCounter + 1)).join(",")
                      + `\n${"\t".repeat(levelCounter+1)}]`
                      + `\n${"\t".repeat(levelCounter)}}`
    }
    const res =  traverse(tree)
    console.log(res)
    document.getElementById("translated-tree").innerHTML = res
}

const copyJson = () => {
    const blockElement = document.getElementById("translated-tree")
    blockElement.select()
    document.execCommand("copy")
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
const rightest = new TreeNode()
rightest.addChild(new TreeNode)
rightleft.addChildren([rightleftleft, rightest])
rightleftleft.addChild(rightleftleftleft)
rightleftleft.addChild(new TreeNode())
rightleftleft.addChild(new TreeNode())
rightleftleft.addChild(new TreeNode())
const drawParent = new DrawNode(tree)


custom_balanced(drawParent)
drawParent.drawTree()

// let node = draw.circle(100).attr({ fill: '#f06' }).center(docWitdh/2)
