export const getRandomWords = (numOfwords:number) => {
    const words = [
      "Lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
      "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"
    ];
    const randomWords = [];

    for (let i = 0; i < numOfwords; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      randomWords.push(words[randomIndex]);
    }

    return randomWords.join(" ");
  };