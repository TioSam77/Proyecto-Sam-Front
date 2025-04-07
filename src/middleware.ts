
import { NextRequest, NextResponse } from "next/server"


export async function middleware(request: NextRequest) {
    try {
        const token = request.cookies.get('name')

        if (!token) {
            return NextResponse.redirect(new URL('/Login', request.url))
        }

        const res = await fetch('url verificadora de ruta', {
            headers: { token: token.value }
        })

        const data = await res.json()

        if (!data.isAuthorized) {
            return NextResponse.redirect(new URL('/Login', request.url))
        }

        return NextResponse.next()
    } catch (error) {
        return NextResponse.redirect(new URL('/Login', request.url))
    }
}

export const config = {
    matcher: ['/aqui se coloca lo que protege'],
}
