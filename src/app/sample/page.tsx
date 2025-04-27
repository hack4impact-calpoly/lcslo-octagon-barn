import { Button } from "@/components/ui/button";

export default function Sample() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Sample Page</h1>
      <Button className="bg-blue-500 text-white px-4 py-2 rounded">Click me</Button>
    </div>
  );
}
