if (!process.env.NEXT_PUBLIC_BACKEND) {
  throw new Error("NEXT_PUBLIC_BACKEND is not defined");
}

export const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
