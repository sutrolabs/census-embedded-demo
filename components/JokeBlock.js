import { useEffect, useState } from "react";

export default function JokeBlock() {
  const [joke, setJoke] = useState("");

  useEffect(() => {
    fetch("/api/joke")
      .then((res) => res.json())
      .then((jokeJSON) => {
        setJoke(jokeJSON);
      });
  }, []);

  return <blockquote>{joke}</blockquote>;
}
