import { NextPage } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { Welcome } from "@/components/welcome";

const Dashboard: NextPage = async () => {
    const session = await getServerSession();

    if (!session) {
        notFound();
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-white">
                <h1 className="text-5xl font-extrabold">
                    Welcome to the Dashboard
                </h1>
                <Welcome user={session.user} />
            </div>
        </main>
    );
};

export default Dashboard;
