module.exports = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ]
  },
}
