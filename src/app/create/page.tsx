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
  const [puzzleQuestion, setPuzzleQuestion] = useState("");
  const [puzzleAnswer, setPuzzleAnswer] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500; // Aggressive downscale for URL sharing
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Compress heavily to keep URL size manageable
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.3);
            setImage(compressedBase64);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!name || !image) {
      alert("Please provide a name and upload a letter image.");
      return;
    }

    setPublishing(true);

    const state = {
      name,
      theme,
      puzzle,
      puzzleQuestion: puzzle === "unscramble" ? puzzleQuestion : undefined,
      puzzleAnswer: puzzle === "unscramble" ? puzzleAnswer : undefined,
      message,
      image,
    };

    try {
      const response = await fetch("https://bytebin.lucko.me/post", {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "little-gift-together" },
        body: JSON.stringify(state),
      });
      
      if (!response.ok) throw new Error("Failed to post");
      
      const data = await response.json();
      const safeName = encodeURIComponent(name.trim().replace(/\s+/g, '-'));
      const url = `${window.location.origin}/to/${safeName}?id=${data.key}`;
      setPublishedUrl(url);
    } catch (error) {
      console.error(error);
      alert("Failed to generate link. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e6e6] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 paper-texture z-0 pointer-events-none"></div>
      <div className="max-w-md w-full bg-[#fdfbf7] p-6 sm:p-8 space-y-6 craft-border relative z-10">
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

          {puzzle === "unscramble" && (
            <div className="space-y-4 bg-orange-50/50 p-4 rounded-xl border border-orange-200/50">
              <div className="space-y-2">
                <Label htmlFor="puzzleQuestion">Secret Question</Label>
                <Input 
                  id="puzzleQuestion" 
                  placeholder="e.g., Where did we first meet?" 
                  value={puzzleQuestion}
                  onChange={(e) => setPuzzleQuestion(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="puzzleAnswer">Answer (1-10 letters)</Label>
                <Input 
                  id="puzzleAnswer" 
                  placeholder="e.g., PARIS" 
                  value={puzzleAnswer}
                  onChange={(e) => setPuzzleAnswer(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  maxLength={10}
                />
              </div>
            </div>
          )}

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
            className="w-full bg-[#d97777] hover:bg-[#c96666] text-white craft-border" 
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? "Creating Magic..." : "Publish Letter"}
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
