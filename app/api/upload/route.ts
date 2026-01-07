import { NextRequest, NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import path from "path";
import fs, { createWriteStream } from "fs"; // createWriteStream 추가
import { Readable } from "stream"; // Readable 추가
import { finished } from "stream/promises"; // finished 추가

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 1. 저장 경로 설정
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // 2. 폴더 생성
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 3. 파일명 개선 (기존 로직 유지 - 아주 좋습니다!)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.name);
    const filename = `${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // 4. 🔥 [수정] 메모리 아끼는 스트리밍 방식으로 파일 저장
    // file.arrayBuffer() 대신 file.stream()을 사용하여 데이터를 조각 단위로 처리합니다.
    const stream = Readable.fromWeb(file.stream() as any);

    // 하드디스크에 바로 쓸 수 있는 통로(writeStream)를 엽니다.
    const writeStream = createWriteStream(filePath);

    // 스트림을 연결(pipe)하고 저장이 완전히 끝날 때까지(finished) 기다립니다.
    await finished(stream.pipe(writeStream));

    // 5. 성공 응답
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      url: fileUrl,
      filename: filename
    });

  } catch (error) {
    console.error("파일 업로드 에러:", error);
    return NextResponse.json({ error: "서버에 파일 저장 실패" }, { status: 500 });
  }
}