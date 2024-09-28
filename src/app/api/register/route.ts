import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { hashPassword } from '@/lib/auth';

const DB_PATH = path.join(process.cwd(), 'db.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeDB(users: any[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
}

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const users = await readDB();
  
  if (users.some((user: any) => user.username === username)) {
    return NextResponse.json({ success: false, message: 'El nombre de usuario ya existe' }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
  };

  users.push(newUser);
  await writeDB(users);

  return NextResponse.json({ success: true, message: 'Usuario registrado exitosamente' });
}