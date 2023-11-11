import Head from "next/head"
import Link from "next/link"
import { Line } from "react-chartjs-2"

import { Anchor } from "@components/Anchor"
import Button from "@components/Button"
import { Card } from "@components/Card"

export default function Index() {
  return (
    <>
      <Head>
        <title>Dashboard - Census Embedded Demo App</title>
      </Head>
      <h2 className="text-2xl font-bold text-stone-700">Dashboard</h2>
      <hr className="border-t border-stone-400" />
      <p className="italic text-stone-500">
        Unlock the full potential of your tea production business with comprehensive data on retailers and
        trends.
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <h3 className="font-medium text-teal-800">Retailer Datasets</h3>
          <ul className="ml-6 flex grow list-disc flex-col gap-1 text-sm text-stone-600">
            <li>
              <Anchor href="/retailers">US tea boutiques</Anchor> updated 1 week ago
            </li>
            <li>
              <Anchor href="/retailers">Australia grocers</Anchor> updated 3 week ago
            </li>
            <li>
              <Anchor href="/retailers">Canada markets</Anchor> updated 2 months ago
            </li>
          </ul>
          <Link href="/retailers">
            <Button>Explore retailers</Button>
          </Link>
        </Card>
        <Card className="flex flex-col gap-3">
          <div className="flex flex-row justify-between">
            <h3 className="font-medium text-teal-800">Retailer Highlights</h3>
            <span className="text-sm text-stone-500">1 / 12</span>
          </div>
          <ul className="ml-2 flex grow flex-col text-sm text-stone-600">
            <ol>
              <span className="text-teal-600">Name:</span>{" "}
              <span className="font-medium text-stone-800">Healthways</span>
            </ol>
            <ol>
              <span className="text-teal-600">Type:</span> Grocery chain
            </ol>
            <ol>
              <span className="text-teal-600">Location:</span> UK
            </ol>
            <ol>
              <span className="text-teal-600">Annual tea revenue:</span> $2.1M
            </ol>
            <ol>
              <span className="text-teal-600">Contacts:</span> 4
            </ol>
          </ul>
          <div className="flex flex-row justify-center gap-2">
            <Button>&lt;</Button>
            <Link href="/retailers">
              <Button className="grow">View details</Button>
            </Link>
            <Button>&gt;</Button>
          </div>
        </Card>
        <Card className="flex flex-col gap-3">
          <h3 className="font-medium text-teal-800">Trend Datasets</h3>
          <ul className="ml-6 flex grow list-disc flex-col gap-1 text-sm text-stone-600">
            <li>
              <Anchor href="/trends">Global prices</Anchor> updated 1 day ago
            </li>
            <li>
              <Anchor href="/trends">Global consumption</Anchor> updated 2 week ago
            </li>
            <li>
              <Anchor href="/trends">Tea rankings</Anchor> updated 1 month ago
            </li>
          </ul>
          <Link href="/trends">
            <Button>Explore trends</Button>
          </Link>
        </Card>
        <Card className="flex flex-col gap-3">
          <div className="flex flex-row justify-between">
            <h3 className="font-medium text-teal-800">Trend Highlights</h3>
            <span className="text-sm text-stone-500">1 / 12</span>
          </div>
          <div className="-mb-3 text-sm text-stone-800 underline">Global price</div>
          <Line
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  label: "Tea Prices",
                  data: [2.5, 2.7, 2.8, 3.1, 3.0, 2.9],
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              interaction: {
                mode: "index",
                intersect: false,
              },
              plugins: {
                tooltip: {
                  enabled: true,
                  mode: "index",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
          <div className="flex flex-row justify-center gap-2">
            <Button>&lt;</Button>
            <Link href="/trends">
              <Button className="grow">View details</Button>
            </Link>
            <Button>&gt;</Button>
          </div>
        </Card>
        <Card className="flex flex-col gap-3">
          <h3 className="font-medium text-teal-800">Integrations</h3>
          <p className="text-sm text-teal-500">
            Did you know you can connect this data directly to your CRM and ad platforms?
          </p>
          <Link href="/integrations">
            <Button>Get started</Button>
          </Link>
        </Card>
      </div>
    </>
  )
}
