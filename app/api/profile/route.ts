import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "profile.json");

const DEFAULT_DATA = {
    profile: {
        name: "홍길동",
        title: "Full Stack Developer",
        email: "example@email.com",
        phone: "010-0000-0000",
        location: "Seoul",
        birthdate: "2000-01-01",
        bio: "반갑습니다!",
        skills: "React, Next.js",
        github: "",
        linkedin: "",
        profileImage: "",
    },
    projects: []
};

export async function GET() {
    try {
        // 파일이 없으면 에러를 내지 말고 DEFAULT_DATA를 보냄 (404 방지)
        if (!fs.existsSync(DATA_PATH)) {
            return NextResponse.json(DEFAULT_DATA);
        }
        const fileContents = fs.readFileSync(DATA_PATH, "utf8");
        return NextResponse.json(JSON.parse(fileContents));
    } catch (error) {
        return NextResponse.json(DEFAULT_DATA);
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const dir = path.dirname(DATA_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}