let g = {
  nodes: [],
  links: [],
};

let min_value = 0xffffff;
let max_value = -0xffffff;
let edge_length = 50;
let digraph = false;

function setEdgeLength(length) {
  edge_length = length;
}


function initFromMatrix(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    addNode(i);
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 0) {
        continue
      }
      if (!digraph && i <= j) {
        addEdge(i, j, matrix[i][j]);
      }
      
    }
    
  }
  
}


function addNode(node) {
  g.nodes.push({
    id: node.toString(),
  })
}

function addEdge(from, to, weight = 1) {
  min_value = Math.min(min_value, weight);
  max_value = Math.max(max_value, weight);
  g.links.push({
    source: from.toString(),
    target: to.toString(),
    value: weight,
    text: weight,
    label: {
      show: showLabel,
      formatter: (p) => {
        return p.data.text;
      },
      fontSize: 17,
    }
  })
}


function isDigraph(flag) {
  digraph = flag;
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function visitNode(node) {
  console.log('visitNode ', node);
  node = node.toString();
  g.nodes.map((item) => {
    if (item.id === node) {
      item.itemStyle = {
        color: '#4054cc'
      }
    }
  });
  chart.setOption({
    series: [{
      data: g.nodes
    }]
  });
}

let showLabel = true;

function isShowLabel(flag) {
  showLabel = flag;
}

function visitEdge(from, to) {
  console.log('visitEdge ', from, to);
  from = from.toString();
  to = to.toString();
  g.links.map((item) => {
    if (digraph && item.source === from && item.target === to) {
      item.lineStyle = {
        color: '#cc752e'
      };
    } else if ((item.source === from && item.target === to)
      || (item.source === to && item.target === from)) {
      item.lineStyle = {
        color: '#cc752e'
      };
    }
  });
  chart.setOption({
    series: [{
      links: g.links
    }]
  });
}

let _freezed = false;

function freezeGraph() {
  if (_freezed) {
    return;
  }
  g.nodes.map((node) => {
    node.fixed = true;
  });
  _freezed = true;
}

function draw(chart) {
  
  g.links.map((data) => {
    data.value = max_value - data.value
  });
  
  let option = {
    title: {
      text: 'Graph',
      top: 'bottom',
      left: 'right'
    },
    series: [
      {
        name: 'Les Miserables',
        type: 'graph',
        layout: 'force',
        data: g.nodes,
        links: g.links,
        roam: true,
        symbolSize: 35,
        draggable: true,
        label: {
          show: true,
          position: 'inside',
          fontSize: 20,
          color: '#fff',
          formatter: function (p) {
            return p.data.id;
          },
        },
        lineStyle: {
          color: '#000',
          width: 4,
          opacity: 1,
          
        },
        force: {
          repulsion: 50 * edge_length,
          gravity: 0.3,
          edgeLength: [min_value * edge_length, Math.min(max_value * edge_length, min_value * edge_length * 10)],
          
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: digraph ? 20 : 0,
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 6
          }
        }
      }
    ]
  };
  chart.setOption(option);
}
