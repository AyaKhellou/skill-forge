import { useEffect, useRef, useState } from "react";
import { Camera, CircleAlert, Moon, Pen, Sun } from "lucide-react";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import useProfileInfo from "../../hooks/useProfileInfo";
import { deleteWarning, uploadImage } from "../../services/function";

export default function Settings() {
    const {
        profileInfo,
        error,
        loadingProfile,
        updateUserDetails,
        updateUserProfile,
        deleteUserAccount,
    } = useProfileInfo();

    const [editNameMode, setEditNameMode] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [changeImageMode, setChangeImageMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (profileInfo) {
            setNameInput(profileInfo.name);
        }
    }, [profileInfo]);

    useEffect(() => {
        if (editNameMode) {
            nameInputRef.current?.focus();
        }
    }, [editNameMode]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setChangeImageMode(true);
        }
    };

    async function saveChanges() {
        if (nameInput !== profileInfo?.name) {
            try {
                await updateUserDetails({ name: nameInput });
                await updateUserProfile({ displayName: nameInput });
                setEditNameMode(false);
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        }

        if (imageFile) {
            try {
                const newImageUrl = await uploadImage(imageFile);
                await updateUserDetails({ pfp: newImageUrl });
                await updateUserProfile({ photoURL: newImageUrl });
                setChangeImageMode(false);
                setImageFile(null);
                setImagePreview(null);
            } catch (error) {
                console.error("Error updating profile image:", error);
            }
        }
    }

    async function deleteUser() {
        const confirmed = await deleteWarning(
            ", Are you sure you want to delete your account?",
        );
        if (!confirmed) return;

        try {
            await deleteUserAccount();
        } catch (error) {
            console.error("Error deleting user account:", error);
        }
    }

    if (loadingProfile) {
        return (
            <section className="page flex items-center justify-center">
                <Loader />
            </section>
        );
    }

    if (error) {
        return (
            <section className="page flex items-center justify-center">
                <ErrorMessage
                    message={`Unable to load your settings. ${error.message || "Please try again."}`}
                />
            </section>
        );
    }

    if (!profileInfo) {
        return (
            <section className="page flex items-center justify-center">
                <ErrorMessage message="Profile information is unavailable." />
            </section>
        );
    }

    return (
        <section className="page">
            <div className="bg-card-background shadow rounded p-section flex flex-col gap-4 items-center">
                <div className="relative rounded-[50%] mb-3 w-16 h-16 flex items-center justify-center bg-accent cursor-pointer overflow-hidden">
                    <input
                        type="file"
                        id="image-upload"
                        name="imageUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <label
                        htmlFor="image-upload"
                        className="absolute top-0 left-0 bg-gray-950/40 opacity-0 hover:opacity-100 w-full h-full flex items-center justify-center"
                    >
                        <Camera width={30} height={30} />
                    </label>
                    <img
                        src={imagePreview || profileInfo?.pfp}
                        alt="user pfp"
                    />
                </div>

                <div className="flex items-center gap-2 justify-center">
                    {editNameMode ? (
                        <input
                            className="text-xl font-bold mb-4 text-text w-fit"
                            ref={nameInputRef}
                            type="text"
                            value={nameInput}
                            onChange={(event) => setNameInput(event.target.value)}
                        />
                    ) : (
                        <h3>{profileInfo?.name}</h3>
                    )}
                    <button
                        className="cursor-pointer self-start"
                        onClick={() => setEditNameMode((previousMode) => !previousMode)}
                    >
                        <Pen width={17} />
                    </button>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <div className="bg-background shadow rounded flex items-center justify-between p-3">
                        <p className="detail">Email</p>
                        <p>{profileInfo?.email}</p>
                    </div>

                    <div className="bg-background shadow rounded flex items-center justify-between p-3">
                        <p className="detail">Mode</p>
                        <div className="flex gap-4">
                            <p>{profileInfo?.mode}</p>
                            {profileInfo?.mode === "dark mode" ? <Moon /> : <Sun />}
                        </div>
                    </div>

                    <div className="bg-background shadow rounded flex items-center justify-between p-3">
                        <p className="detail">delete account</p>
                        <button
                            className="text-red flex items-center justify-center gap-2 cursor-pointer"
                            onClick={deleteUser}
                        >
                            delete
                            <CircleAlert className="text-red!" width={17} height={17} />
                        </button>
                    </div>
                </div>

                <Button
                    classes="self-end"
                    onClick={saveChanges}
                    disabled={!editNameMode && !changeImageMode}
                >
                    save edits
                </Button>
            </div>
        </section>
    );
}