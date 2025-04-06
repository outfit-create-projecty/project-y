"use client";

import type { ClothingItem, Outfit, User } from "~/server/db/schema";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useToast } from "../components/hooks/use-toast";
import Image from "next/image";

export default function OutfitClient({ user }: { user: User }) {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
    const [feedback, setFeedback] = useState("");
    const [generatedOutfit, setGeneratedOutfit] = useState<{
        name: string,
        description: string,
        top: ClothingItem,
        bottom: ClothingItem,
        misc: ClothingItem,
        id?: string
    } | null>(null);
    const createOutfit = api.outfit.create.useMutation();
    const { toast } = useToast();

    const generateOutfit = async (feedbackPrompt?: string) => {
        const finalPrompt = feedbackPrompt || prompt;
        if (!finalPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const result = await createOutfit.mutateAsync({ prompt: finalPrompt });
            if (result) {
                toast({
                    title: "Success",
                    description: "Your outfit has been generated successfully",
                    className: "bg-green-300",
                    duration: 2000,
                });

                setGeneratedOutfit(result);
                setFeedback(""); // Clear feedback after regeneration
            }
        } catch (error) {
            toast({
                title: "Uh oh!",
                description: "Failed to generate outfit",
                className: "bg-red-300",
                duration: 2000,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFeedback = async () => {
        if (!feedback.trim()) return;
        
        // Combine the original prompt with the feedback
        const newPrompt = `${prompt}. Please modify the outfit based on this feedback: ${feedback}`;
        await generateOutfit(newPrompt);
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-144px)]">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Generate Your Outfit</h1>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                            Describe your desired outfit
                        </label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="e.g., A casual summer outfit for a beach day..."
                        />
                    </div>

                    <button
                        onClick={() => generateOutfit()}
                        disabled={isGenerating || !prompt.trim()}
                        className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                            isGenerating || !prompt.trim()
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isGenerating ? "Generating..." : "Generate Outfit"}
                    </button>

                    {generatedOutfit && (
                        <div className="mt-8 p-6 border rounded-lg bg-gray-50">
                            <h2 className="text-xl font-semibold mb-2">{generatedOutfit.name}</h2>
                            <p className="text-gray-600 mb-4">{generatedOutfit.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {generatedOutfit.top && (
                                    <div 
                                        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => setSelectedItem(generatedOutfit.top)}
                                    >
                                        <div className="relative w-full aspect-square mb-2">
                                            <img
                                                src={generatedOutfit.top.image}
                                                alt={generatedOutfit.top.name}
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <h3 className="font-medium">Top</h3>
                                        <p className="text-sm text-gray-600">{generatedOutfit.top.name}</p>
                                    </div>
                                )}
                                {generatedOutfit.bottom && (
                                    <div 
                                        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => setSelectedItem(generatedOutfit.bottom)}
                                    >
                                        <div className="relative w-full aspect-square mb-2">
                                            <img
                                                src={generatedOutfit.bottom.image}
                                                alt={generatedOutfit.bottom.name}
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <h3 className="font-medium">Bottom</h3>
                                        <p className="text-sm text-gray-600">{generatedOutfit.bottom.name}</p>
                                    </div>
                                )}
                                {generatedOutfit.misc && (
                                    <div 
                                        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => setSelectedItem(generatedOutfit.misc)}
                                    >
                                        <div className="relative w-full aspect-square mb-2">
                                            <img
                                                src={generatedOutfit.misc.image}
                                                alt={generatedOutfit.misc.name}
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <h3 className="font-medium">Accessory</h3>
                                        <p className="text-sm text-gray-600">{generatedOutfit.misc.name}</p>
                                    </div>
                                )}
                            </div>

                            {/* Feedback Section */}
                            <div className="mt-6 border-t pt-6">
                                <h3 className="text-lg font-medium mb-4">Want to modify this outfit?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Tell us what you'd like to change about the outfit. For example:
                                    "Make it more casual", "Use a different color scheme", or "Add more accessories"
                                </p>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Describe how you'd like to modify the outfit..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                                    rows={3}
                                />
                                <button
                                    onClick={handleFeedback}
                                    disabled={isGenerating || !feedback.trim()}
                                    className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                                        isGenerating || !feedback.trim()
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {isGenerating ? "Modifying..." : "Modify Outfit"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Item Details Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="relative w-full aspect-square mb-4">
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.name}
                                className="object-cover rounded-lg"
                            />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{selectedItem.name}</h3>
                        <p className="text-gray-600 mb-2">{selectedItem.description}</p>
                        <p className="text-sm text-gray-500">Type: {selectedItem.classification}</p>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="mt-4 w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}