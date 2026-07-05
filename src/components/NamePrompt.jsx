import { useState } from "react";
import { databases } from "../appwrite";
import { ID } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const VISITOR_COLLECTION_ID = import.meta.env.VITE_APPWRITE_VISITOR_COLLECTION_ID;

function NamePrompt({ onNameEntered }) {
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Please enter a valid name.");
            return;
        }

        try {
            if (DATABASE_ID && VISITOR_COLLECTION_ID) {
                // Save to Appwrite
                await databases.createDocument(DATABASE_ID, VISITOR_COLLECTION_ID, ID.unique(), {
                    name,
                });
            } else {
                console.warn("⚠️ Appwrite environment variables not configured. Skipping remote name save.");
            }
        } catch (error) {
            console.error("❌ Failed to save name to Appwrite:", error);
        } finally {
            // Save to localStorage and proceed regardless of Appwrite success/failure
            localStorage.setItem("visitorName", name);
            onNameEntered(name);
        }
    };

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit} style={{ padding: 40, textAlign: "center" }}>
                <h2 className="text-white" style={{ padding: 20 }}>! Identification required for personalization</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="_Your Name_"
                    style={{
                        margin: "10px",
                        padding: "12px 16px",
                        width: "250px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "16px",   
                        backgroundColor: "#fff",
                        color: "#000",
                    }}
                />
                <br />
                <button className="text-white" type="submit" style={{ padding: "10px 20px" }}>
                   Confirm Identity
                </button>
            </form>
        </div>
    );
}

export default NamePrompt;
