window.onload = function() {
    let pontos = 0;
    let caracteres = [];

    document.getElementById('startButton').onclick = function() {
        const hiraganaCheck = document.getElementById('hiraganaCheck').checked;
        const katakanaCheck = document.getElementById('katakanaCheck').checked;

        if (!hiraganaCheck && !katakanaCheck) {
            alert('Selecione pelo menos um dos dois.');
            return;
        }

        const promises = [];

        if (hiraganaCheck) {
            promises.push(fetch('hiragana.json').then(response => response.json()));
        }
        if (katakanaCheck) {
            promises.push(fetch('katakana.json').then(response => response.json()));
        }

        Promise.all(promises)
            .then(results => {
                caracteres = results.flat();
                startGame();
            })
            .catch(error => console.error('ERROR: ', error));
    };

    function startGame() {
        function loadNewCharacter() {
            const randomIndex = Math.floor(Math.random() * caracteres.length);
            const character = caracteres[randomIndex];
            document.getElementById('character').textContent = character.src;
            return character;
        }

        let currentCharacter = loadNewCharacter();

        function checkAnswer() {
            const userInput = document.getElementById('resposta').value.trim().toLowerCase();
            const resultado = document.getElementById('resultado');

            if (userInput === currentCharacter.description.toLowerCase()) {
                resultado.textContent = 'Correto!';
                resultado.style.color = 'green';
                pontos++;
                document.getElementById('pontos').textContent = 'Pontuação: ' + pontos;
                setTimeout(function() {
                    currentCharacter = loadNewCharacter();
                    resultado.textContent = '';
                    document.getElementById('resposta').value = '';
                }, 1000);
            } else {
                resultado.textContent = 'Incorreto. Tente novamente.';
                resultado.style.color = 'red';
                setTimeout(function() {
                    document.getElementById('resposta').value = '';
                }, 10);
            }
        }
        
        document.getElementById('resposta').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (event.target.value.trim() !== "") {
                    checkAnswer();
                }
            }
        });

        document.getElementById('checkButton').onclick = checkAnswer;       
    }
};
