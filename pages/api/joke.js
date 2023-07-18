import jokes from "./jokes.json";

export default function handler(req, res) {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  const randomJoke = jokes[randomIndex];
  res.status(200).json(randomJoke);
}
