document.addEventListener('DOMContentLoaded', function() {
    const maze = document.getElementById('maze');
    const info = document.getElementById('info');
    const mazeSize = 10; // Tamaño del laberinto (10x10)
    const cellSize = 40; // Tamaño de cada celda
    const cells = [];
    let playerX = 0;
    let playerY = 0;
    const endX = mazeSize - 1;
    const endY = mazeSize - 1;
    let cellCounter = 0;

    // Función para imprimir la información de las celdas y sus vecinos
    function printCellInfo() {
        const pairs = [];
        for (let i = 0; i < mazeSize; i++) {
            for (let j = 0; j < mazeSize; j++) {
                if (!cells[i * mazeSize + j].classList.contains('wall')) {
                    const neighbors = [];
                    if (i > 0 && !cells[(i - 1) * mazeSize + j].classList.contains('wall')) {
                        neighbors.push([(i - 1) * mazeSize + j]);
                    }
                    if (i < mazeSize - 1 && !cells[(i + 1) * mazeSize + j].classList.contains('wall')) {
                        neighbors.push([(i + 1) * mazeSize + j]);
                    }
                    if (j > 0 && !cells[i * mazeSize + (j - 1)].classList.contains('wall')) {
                        neighbors.push([i * mazeSize + (j - 1)]);
                    }
                    if (j < mazeSize - 1 && !cells[i * mazeSize + (j + 1)].classList.contains('wall')) {
                        neighbors.push([i * mazeSize + (j + 1)]);
                    }
                    pairs.push({ cell: [i * mazeSize + j], neighbors: neighbors });
                }
            }
        }
        
        info2.innerText = JSON.stringify(pairs);
        
        const data = pairs;
        const pairs2 = data.flatMap(item => {
            const cell = item.cell[0];
            return item.neighbors.map(neighbor => [cell, ...neighbor]);
        }).sort((a, b) => a[0] - b[0] || a[1] - b[1]);

        info.innerText = JSON.stringify(pairs2);


        //////////////Busqueda en DSF/////////////

        const edges = pairs2;
        
        const n = 100;

        const graph = new Graph(edges, n);  

        const discovered = new Array(n).fill(false);

        const solucion = [];

        var valor;
        
        for (let i = 0; i < n; i++) {
          if (!discovered[i]) {
            
            valor = DFS(graph, i, discovered);

            solucion.push(valor);

          }

        }

        info.innerText = JSON.stringify(pairs2);

        //solucionDSF.innerText = JSON.stringify(solucion[solucion.length-1]);  //old solution, but good!
        



        //quitando movientos extras en la solución

        const numeros = solucion[solucion.length-1];

        const camino = [];
        
        for (let i = 0; i < numeros.length; i++) {
            
            camino.push(numeros[i]);

            if (numeros[i] === 99) {

                break; // Detener el bucle cuando encuentres el número 99

            }

        }


        //Mostrando resultados

        solucionDSF.innerText = JSON.stringify(camino.join(',')); 

        ////////////////////////////////

    }



    // Búsqueda en profundidad
    class Graph {
      constructor(edges, n) {
        this.adjList = new Array(n).fill(null).map(() => []);
        
        edges.forEach(([src, dest]) => {
          this.adjList[src].push(dest);
          this.adjList[dest].push(src);
        });
      }
    }

    
    const aux = []; 
    function DFS(graph, v, discovered) {

      

      discovered[v] = true;
      
      aux.push(v);
     
      //console.log(v + ' ');
      //document.write(v + ' '); // solo cambié esta línea para imprimir en una página web
      
      graph.adjList[v].forEach(u => {
        if (!discovered[u]) {
          DFS(graph, u, discovered);

        }

      });

      return aux;

    }




    // Función para mover al jugador
    function movePlayer(dx, dy) {
        const newX = playerX + dx;
        const newY = playerY + dy;
        const newIndex = newY * mazeSize     + newX;

        if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && !cells[newIndex].classList.contains('wall')) {
            playerX = newX;
            playerY = newY;
            cells.forEach(cell => cell.classList.remove('player'));
            cells[newIndex].classList.add('player');

            if (playerX === endX && playerY === endY) {
                alert('¡Has llegado a la meta!');
            }
        }
    }

    // Event listener para el movimiento del jugador usando las flechas del teclado
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (key === 'ArrowUp') {
            movePlayer(0, -1);
        } else if (key === 'ArrowDown') {
            movePlayer(0, 1);
        } else if (key === 'ArrowLeft') {
            movePlayer(-1, 0);
        } else if (key === 'ArrowRight') {
            movePlayer(1, 0);
        }
    });

    // Crear el laberinto y asignar números consecutivos a las celdas
    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.left = `${j * cellSize}px`;
            cell.style.top = `${i * cellSize}px`;
            cell.innerText = cellCounter++;
            if (i === 0 && j === 0) {
                cell.classList.add('start');
            } else if (i === endX && j === endY) {
                cell.classList.add('end');
            } else if (Math.random() < 0.2) { // Agrega paredes aleatorias
                cell.classList.add('wall');
            }
            maze.appendChild(cell);
            cells.push(cell);
        }
    }

    // Imprimir información de las celdas y sus vecinos al cargar la página
    printCellInfo();
});
