import type { Metadata } from "next";
import TeacherSignupForm from "./TeacherSignupForm";

export const metadata: Metadata = {
  title: "Teacher Registration - SciGeeks",
  description: "Sign up for a teacher account on SciGeeks",
};

export default function TeacherSignupPage() {
  return <TeacherSignupForm />;
}
