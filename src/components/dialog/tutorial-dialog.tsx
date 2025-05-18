"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"

export default function TutorialDialog() {
    const [open, setOpen] = useState<boolean>(false)
    const [currentStep, setCurrentStep] = useState<number>(0)

    useEffect(() => {
        const seen = localStorage.getItem("tutorialSeen")
        if (seen !== "true") {
            setOpen(true)
        }
    }, [])

    const tutorialSteps = [
        {
            title: "Welcome to Monad Empire",
            content:
                "👋 Hello! I'm Mox and I’ll guide you through this blockchain adventure. You're about to build the greatest business empire on the Monad Testnet. To get started, connect your MetaMask wallet and get ready to grow your fortune!",
            image: "/step-1.jpeg",
        },
        {
            title: "Step 2 – Your First Job",
            content:
                "Learn your first job and click the Work button to start earning money! You can also expand or upgrade your job to increase your earnings.",
            image: "/placeholder.svg?height=400&width=400",
        },
        {
            title: "Step 3 – Growing Your Empire",
            content:
                "Each time you level up, you'll need to make a test transaction on the Monad blockchain. This will save your game progress and update your ranking, all linked to your wallet.",
            image: "/placeholder.svg?height=400&width=400",
        }
    ]

    const nextStepOrFinish = () => {
        if (currentStep === tutorialSteps.length - 1) {
            handleOpenChange(false);
        }
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleOpenChange = (value: boolean) => {
        setOpen(value)
        if (!value) {
            localStorage.setItem("tutorialSeen", "true")
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden border">
                <Card className="w-full border-none shadow-none">
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="bg-purple-100 flex flex-col items-center justify-center relative min-h-[400px]">
                                <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-purple-700">
                                    Step {currentStep + 1} of {tutorialSteps.length}
                                </div>
                                <Image
                                    src={tutorialSteps[currentStep].image}
                                    alt="Tutorial character"
                                    width={250}
                                    height={250}
                                    className="w-full h-400"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col bg-monad-background">
                                <h1 className="text-2xl font-bold mb-4 text-amber-300">{tutorialSteps[currentStep].title}</h1>
                                <div className="flex-1 overflow-y-auto">
                                    <p className="mb-8 text-lg leading-relaxed text-amber-100">{tutorialSteps[currentStep].content}</p>
                                </div>

                                <div className="flex justify-center mb-6">
                                    {tutorialSteps.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`h-2 w-12 mx-1 rounded-full ${index === currentStep ? "bg-purple-600" : "bg-gray-200"}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={currentStep === 0}
                                        className="flex items-center gap-2"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={nextStepOrFinish}
                                        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                                    >
                                        {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
                                        {currentStep < tutorialSteps.length - 1 && <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
