"use client";

import type { Session } from "next-auth";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { WashingMachine } from "lucide-react";

export default function Navigation(props: { user ?: Session['user'] }) {
    const user = props.user;
    const router = useRouter();

    return (<nav className="fixed w-full !z-90 border-none bg-black shadow-md p-4 flex justify-between items-center border-b-2 border-m-primary-dark">
        <Button variant="ghost" className="hover:cursor-pointer hover:bg-transparent" onClick={() => router.push("/")}>
            <span className="text-3xl font-bold text-ultralight flex flex-row items-center"><WashingMachine className="size-6" /> Fit<span className="text-primary">ted</span></span>
        </Button>

        <div className="hidden md:flex gap-6 ml-auto mr-8">
            <Button variant="link" className="text-white rounded-none bg-gradient-to-br hover:from-violet-500 hover:to-primary-ultralight duration-400 transition-colors">
                <Link href="/outfit">Create Outfit</Link>
            </Button>
            <Button variant="link" className="text-white rounded-none bg-gradient-to-br hover:from-violet-500 hover:to-primary-ultralight duration-400 transition-colors">
                <Link href="/all">All Outfits</Link>
            </Button>
            <Button variant="link" className="text-white rounded-none bg-gradient-to-br hover:from-violet-500 hover:to-primary-ultralight duration-400 transition-colors">
                <Link href="/add">Add Clothes</Link>
            </Button>
            <Button variant="link" className="text-white rounded-none bg-gradient-to-br hover:from-violet-500 hover:to-primary-ultralight duration-400 transition-colors">
                <Link href="/wardrobe">View Wardrobe</Link>
            </Button>
            { user ? <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                    <Avatar className="size-8 bg-white hover:bg-gradient-to-br hover:from-violet-500 hover:to-primary-ultralight duration-400 transition-colors">
                            <AvatarImage src="default.png" />
                            <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 m-4">
                    <DropdownMenuLabel className="font-bold">Hello, {user.name}</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Link href="/add">Add to Wardrobe</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/wardrobe">View Wardrobe</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button
                            variant="destructive"
                            onClick={async () => await signOut({ redirectTo: "/" })}
                        >Sign Out</Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu> : <Button>
                <Link href="/login" className="text-primary-foreground">Login</Link>
            </Button> }
        </div>
    </nav>);
}