export default function handler(req, res) {
  const randomIndex = Math.floor(Math.random() * jokes.length)
  const randomJoke = jokes[randomIndex]
  res.status(200).json(randomJoke)
}

const jokes = [
  "My New Years resolution is to stop leaving things so late.",
  "Child: Dad, make me a sandwich. Dad: Poof! You're a sandwich.",
  "The invention of the wheel was what got things rolling",
  "What kind of music do mummy's like? Rap",
  "What do you get when you cross a chicken with a skunk? A fowl smell!",
]
