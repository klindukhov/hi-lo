export async function getShuffledDeckId() {
    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(res => res.json())
        .then(data => data.deck_id)
        .catch(e => console.log('error', e));
}

export function getNextCard(deckId: string): Promise<any> {
    return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            return {
                'value': data.cards[0].value,
                'suit': data.cards[0].suit,
                'code': data.cards[0].code
            }
        }).catch(e => console.log('error', e));
}