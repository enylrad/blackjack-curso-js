
const game = (() => {
    'use strict'

    let deck = [];
    const types = ['C', 'D', 'H', 'S'],
        specials = ['A', 'J', 'Q', 'K'];

    let pointsPlayers = [];

    // References HTML
    const btnNewGame = document.querySelector('#btnNewGame'),
        btnHit = document.querySelector('#btnHit'),
        btnStand = document.querySelector('#btnStand');

    const divCardsPlayers = document.querySelectorAll('.divCards'),
        scorePlayers = document.querySelectorAll('small')

    const initializeGame = (numPlayers = 2) => {
        deck = createDeck();

        pointsPlayers = [];
        for (let i = 0; i < numPlayers; i++) {
            pointsPlayers.push(0);
        }

        scorePlayers.forEach(elem => elem.innerHTML = 0);
        divCardsPlayers.forEach(elem => elem.innerHTML = '');

        btnHit.disabled = false;
        btnStand.disabled = false;
    }

    const createDeck = () => {

        deck = [];
        types.forEach(type => {
            for (let num = 2; num <= 10; num++) {
                deck.push(`${num}${type}`);
            }
            specials.forEach(special => {
                deck.push(`${special}${type}`);
            });
        });

        return _.shuffle(deck);
    }

    const hitCard = () => {
        if (deck.length === 0) {
            const error = 'There are no cards in the deck'
            window.alert(error)
            throw error;
        }
        return deck.pop();
    }

    const valueCard = (card) => {
        const value = card.substring(0, card.length - 1);

        return (isNaN(value)) ?
            ((value === 'A') ? 11 : 10)
            : (value * 1);
    }

    // turnPlayer: 0 = player and other is CPU
    const sumPointsPlayer = (card, turnPlayer) => {

        pointsPlayers[turnPlayer] = pointsPlayers[turnPlayer] + valueCard(card);
        scorePlayers[turnPlayer].innerHTML = pointsPlayers[turnPlayer];

        return pointsPlayers[turnPlayer];
    }

    const createCard = (card, turnPlayer) => {
        const imgCard = document.createElement('img');
        imgCard.src = `assets/cards/${card}.png`;
        imgCard.classList.add('cardBJ');
        divCardsPlayers[turnPlayer].append(imgCard);
    }

    const determineWinner = () => {

        const [pointsMinimum, pointsCPU] = pointsPlayers;

        setTimeout(() => {
            if (pointsCPU === pointsMinimum) {
                alert('Draw!');
            } else if (pointsMinimum > 21) {
                alert('You Lose!');
            } else if (pointsCPU > 21) {
                alert('You Win!');
            } else if (pointsCPU > pointsMinimum) {
                alert('You Lose!');
            }
        }, 10);
    }

    const turnCPU = (pointsMinimum) => {

        btnHit.disabled = true;
        btnStand.disabled = true;

        let pointsCPU = 0;
        do {
            const card = hitCard();
            pointsCPU = sumPointsPlayer(card, pointsPlayers.length - 1);
            createCard(card, pointsPlayers.length - 1);

        } while ((pointsCPU <= pointsMinimum) && (pointsMinimum <= 21));

        determineWinner();
    }

    // Events

    btnHit.addEventListener('click', () => {

        const card = hitCard();
        const pointsPlayer = sumPointsPlayer(card, 0);

        createCard(card, 0);

        if (pointsPlayer > 21) {
            turnCPU(pointsPlayer);
        } else if (pointsPlayer == 21) {
            turnCPU(pointsPlayer);
        }
    });

    btnStand.addEventListener('click', () => {
        turnCPU(pointsPlayers[0]);
    });

    btnNewGame.addEventListener('click', () => {
        initializeGame();
    });

    return {
        newGame: initializeGame
    };
})();