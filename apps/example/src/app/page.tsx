import { type NextPage } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const SigninSignup = () => {
    return (
        <div className="flex gap-4 text-2xl">
            <Link href="/signin" className="rounded-lg border px-4 py-2">
                Signin
            </Link>
            <Link href="/signup" className="rounded-lg border px-4 py-2">
                Signup
            </Link>
        </div>
    );
};

const Home: NextPage = async () => {
    const session = await getServerSession();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-white">
                <SigninSignup />
            </div>
        </main>
    );
};

export default Home;
