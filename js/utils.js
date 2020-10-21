
// Knuth layout algorithm for drawing trees. Works only on binary trees.
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


// Minimum width algorithm for drawing trees.
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


// A balanced tree drawing algorithm. Messes up on some indexes.
// Inspired by Bill Mill's article on trees (linked in README.md).
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
            counter++
            return `\n${"\t".repeat(levelCounter)}{` 
                      + `\n${"\t".repeat(levelCounter+1)}\"id\": ${counter}, `
                      + `\n${"\t".repeat(levelCounter+1)}\"child\": [` 
                        + tree.children.map(e => traverse(e, levelCounter + 1)).join(",")
                      + `\n${"\t".repeat(levelCounter+1)}]`
                      + `\n${"\t".repeat(levelCounter)}}`
    }
    const res =  traverse(tree)
    document.getElementById("translated-tree").innerHTML = res
}

const copyJson = () => {
    const blockElement = document.getElementById("translated-tree")
    blockElement.select()
    document.execCommand("copy")
}