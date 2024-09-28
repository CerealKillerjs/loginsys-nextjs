import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { comparePasswords, generateToken } from '@/lib/auth';

const DB_PATH = path.join(process.cwd(), 'db.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const users = await readDB();
  const user = users.find((u: any) => u.username === username);

  if (!user) {
    return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 400 });
  }

  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ success: false, message: 'Contraseña incorrecta' }, { status: 400 });
  }

  const token = generateToken({ id: user.id, username: user.username });

  return NextResponse.json({ success: true, token, message: 'Inicio de sesión exitoso' });
}