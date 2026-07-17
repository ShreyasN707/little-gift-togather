"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { themes, puzzles } from "@/lib/themes";

export default function CreatePage() {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("sakura-garden");
  const [puzzle, setPuzzle] = useState("memory");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!name || !image) {
      alert("Please provide a name and upload a letter image.");
      return;
    }

    const state = {
      name,
      theme,
      puzzle,
      message,
      image,
    };

    // Compress/encode state (simplistic for MVP)
    const encodedState = encodeURIComponent(JSON.stringify(state));
    const url = `${window.location.origin}/view#${encodedState}`;
    setPublishedUrl(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900">Letters for My Love</h1>
          <p className="text-gray-500 text-sm sm:text-base">Create a magical experience</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Receiver Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., My Love, Sarah" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="letter">Upload Letter (Image)</Label>
            <Input 
              id="letter" 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {themes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="puzzle">Puzzle Type</Label>
            <select
              id="puzzle"
              className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm"
              value={puzzle}
              onChange={(e) => setPuzzle(e.target.value)}
            >
              {puzzles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Secret Ending Message</Label>
            <Input 
              id="message" 
              placeholder="I hope this made you smile ❤️" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-rose-500 hover:bg-rose-600 text-white" 
            onClick={handlePublish}
          >
            Publish Letter
          </Button>
        </div>

        {publishedUrl && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg space-y-2 border border-green-200">
            <p className="text-sm text-green-800 font-medium">Letter Published Successfully!</p>
            <div className="flex gap-2">
              <Input value={publishedUrl} readOnly className="bg-white" />
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(publishedUrl);
                  alert("Copied to clipboard!");
                }}
              >
                Copy
              </Button>
            </div>
            <a href={publishedUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline block text-center">
              Preview Letter
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
