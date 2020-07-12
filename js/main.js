//Mapear los controles del HTML
const results_container = document.querySelector('.result-items');
const operation_container = document.querySelector('.operation-items');

//Array de objetos tipo Values -> estos son los items que se usaran en el drag n drop
const game_items = [];

//Elemento a arrastrar
let draggedItem = null;

//Verificar si el tablero esta completo
//Sirve para finalizar el juego y mostrar la opcion de volver a jugar
let board_done = 0;

//Poblamos el array inicial game_items
function fillArray() {
    for (let index = 0; index <= 11; index++) {
        let num_1 = Math.floor((Math.random() * 20) + 0);
        let num_2 = Math.floor((Math.random() * 20) + 0);
        let position = index;
        const value_item = new Values(num_1, num_2, position);
        game_items.push(value_item);
    }
    //console.log(game_items);
}

//Clase que maneja los valores y los resultados
class Values {
    constructor(num1, num2, index) {
        this.valoruno = num1;
        this.valordos = num2;
        this.resultado = this.valoruno + this.valordos;
        this.img_position = index;
    }
}

//Clase para manejar los eventos del UI
class UI {

    //Se hace el append al contenedor padre de los resultados
    static fillResultCard() {
        const local_array = [...game_items];
        /* local_array.sort((a, b) => {
            return b.resultado - a.resultado;
        }); */

        //Desordenar array
        local_array.sort(() => Math.random() - 0.5);

        for (let index = 0; index < local_array.length; index++) {
            const item = local_array[index].resultado;
            let position = local_array[index].img_position;
            results_container.appendChild(this.createResultCard(item, position));
        }

        var all_result_card = document.querySelectorAll('.result-card');
        this.setPropsToDraggedElement(all_result_card);
    }

    //Crear el elemento del DOM que tendra los resultados de cada operacion
    static createResultCard(item, position) {
        const result_text = document.createElement('h3');
        result_text.innerHTML = item;
        const result_div = document.createElement('div');
        const image = document.createElement('img');
        image.src = '../img/' + position + '.png';
        result_div.setAttribute('draggable', 'true');
        result_div.classList.add('result-card');
        result_div.setAttribute('data-result', item);
        result_div.setAttribute('data-position', position);
        result_div.append(result_text);
        result_div.append(image);
        return result_div;
    }

    //Event listener de los elementos que contienen cada resultado
    static setPropsToDraggedElement(array) {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];

            element.addEventListener('dragstart', () => {
                draggedItem = element;
                setTimeout(function() {
                    draggedItem.style.display = 'none';
                }, 0);
            });

            element.addEventListener('dragend', function() {
                setTimeout(() => {
                    draggedItem.style.display = 'block';
                    draggedItem = null;
                }, 0);
            });

        }
    }

    //Se hace el append al contenedor padre de las operaciones
    static fillOperationCard() {
        for (let index = 0; index < game_items.length; index++) {
            let value_one = game_items[index].valoruno;
            let value_two = game_items[index].valordos;
            let result = game_items[index].resultado;
            let operation = value_one + ' + ' + value_two;
            let position = game_items[index].img_position;
            operation_container.appendChild(this.createOperationCard(operation, result, position));
        }
        var operation_card = document.querySelectorAll('.operation-card');
        this.setPropsToDragArea(operation_card);
    }

    //Crear el elemento del DOM que tendra las operaciones asociadas a cada resultado
    static createOperationCard(item, result, position) {
        const operation_div = document.createElement('div');
        operation_div.classList.add('operation-card');
        operation_div.setAttribute('data-result', result);
        operation_div.setAttribute('data-position', position);
        operation_div.append(item);
        return operation_div;
    }

    //Event listener de los elementos que contienen cada operacion
    static setPropsToDragArea(array) {
        for (let j = 0; j < array.length; j++) {
            const operation_holder = array[j];

            operation_holder.addEventListener('dragover', function(e) {
                e.preventDefault();
            });

            operation_holder.addEventListener('dragenter', function(e) {
                e.preventDefault();
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            });

            operation_holder.addEventListener('dragleave', function(e) {
                this.style.backgroundColor = 'rgba(255,255,255)';
            });

            operation_holder.addEventListener('drop', function(e) {
                e.preventDefault();
                if (draggedItem.getAttribute('data-result') == this.getAttribute('data-result') &&
                    draggedItem.getAttribute('data-position') == this.getAttribute('data-position')) {
                    this.innerHTML = '';
                    operation_holder.append(draggedItem);
                    draggedItem.style.width = '100%';
                    draggedItem.style.margin = '0';
                    draggedItem.style.height = '100%';
                    draggedItem.children[1].style.width = '100%';
                    draggedItem.children[1].style.height = '100% ';
                    draggedItem.style.backgroundColor = 'green';
                    draggedItem.style.color = 'white';
                    this.style.backgroundColor = 'white';
                    board_done++;
                    if (board_done == 12) {
                        results_container.style.display = 'none';
                        let operation_cards_length = document.querySelectorAll('.operation-card');
                        for (let index = 0; index < operation_cards_length.length; index++) {
                            operation_cards_length[index].style.margin = '0px';
                        }
                        operation_container.style.padding = '30px';

                        setTimeout(() => {
                            alertify.alert('Enhorabuena, has completado el tablero', '¿Deseas volver a jugar?').set('onok', function(closeEvent) {
                                alertify.success('Espera mientras reiniciamos el juego');

                                setTimeout(() => {
                                    window.location.reload();
                                }, 1500);
                            });
                        }, 1500);

                    }
                } else if (draggedItem.getAttribute('data-result') == this.getAttribute('data-result') &&
                    draggedItem.getAttribute('data-position') != this.getAttribute('data-position')) {
                    alertify.warning('Casi, el resultado esta bien, pero esta pieza no va aqui');
                } else {
                    alertify.error('Ups, resultado equivocado', 2);;
                }
            });
        }
    }

}

/**** Llamadas para mostrar los elementos en el HTML ****/
fillArray();
UI.fillResultCard();
UI.fillOperationCard();

//Modal con las instrucciones del juego
if (!localStorage.getItem('firstRun')) {
    setTimeout(() => {
        alertify.alert('Mensaje de bienvenida', `
    Bienvenido a sumar jugando <br> <br>
    <p style='line-height:2em'>A la izquierda encontraras un panel con las piezas <br>
    del rompecabezas, cada pieza posee un numero, este <br>
    numero es el resultado de alguna casilla del panel <br>
    de la derecha, tu tarea es arrastrar cada pieza a la <br>
    casilla con la operacion correspondiente. <br>
    ¡Mucha Suerte!</p>
    `);
    }, 0);
    /*Seteamos la variable firstRun al localStorage para que el 
    modal de bienvenida solo aparezca la primera vez que se corre el juego,
    en nuevas partidas no aparece*/
    localStorage.setItem('firstRun', 'true');
}