import { Metadata } from "next";
import Demo from "~/components/Demo";

const BASE_URL = "frames-v2-3-1.vercel.app";
const domain = `https://${BASE_URL}`;

const frame = {
  version: "next",
  imageUrl: `${domain}/frame-image.png`,
  button: {
    title: "Open Demo",
    action: {
      type: "launch_frame",
      name: "Frame Demo",
      url: domain,
      splashImageUrl: `${domain}/splash.png`,
      splashBackgroundColor: "#ffffff"
    }
  }
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Frame Demo",
    openGraph: {
      title: "Frame Demo",
      description: "A Farcaster Frame",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Demo />
    </main>
  );
}
