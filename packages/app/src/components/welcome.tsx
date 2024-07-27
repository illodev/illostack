"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

const Welcome = ({ user }: { user: Session["user"] }) => {
    async function onSignout() {
        await signOut({ redirect: false });
    }

    return (
        <div className="flex gap-4">
            <h3 className="text-lg">Welcome back, {user?.email}</h3>
            <button className="text-gray-300 underline" onClick={onSignout}>
                Signout
            </button>
        </div>
    );
};

export { Welcome };
