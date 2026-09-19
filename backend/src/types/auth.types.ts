export interface signupDTO {
  name: string;
  email: string;
  id: string;
  role?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}