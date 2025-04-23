import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    console.log(request)
    console.log('lol!!!');
}