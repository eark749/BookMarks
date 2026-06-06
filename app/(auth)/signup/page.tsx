import { signup } from "@/lib/actions/auth";
import Link from "next/link";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 16px" }}>
      <h1>Create account</h1>
      <SignupForm />
      <p style={{ marginTop: 16 }}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
