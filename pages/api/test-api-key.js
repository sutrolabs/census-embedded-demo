import fetch from "node-fetch";

export default async function handler(req, res) {
  const apiResponse = await fetch("http://localhost:3000/api/v1/describe", {
    method: "GET",
    headers: { ["authorization"]: req.headers["authorization"] },
  });
  console.log("test-api-key", apiResponse.status, await apiResponse.text());
  res.status(apiResponse.status).json({});
}
